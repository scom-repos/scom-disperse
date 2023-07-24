import { getChainId, getDisperseAddress, getProxyAddress, INFINITE } from "../store/index";
import { DisperseData, ICommissionInfo } from "../global/index"
import { Wallet, BigNumber, Utils } from "@ijstech/eth-wallet";
import { Contracts as OpenSwapContracts } from "../contracts/oswap-openswap-contract/index";
import { Contracts as ProxyContracts } from "../contracts/scom-commission-proxy-contract/index";
import { Contracts } from "../contracts/scom-disperse-contract/index";
import { ITokenObject } from "@scom/scom-token-list";

const onCheckAllowance = async (token: ITokenObject, spender: string) => {
  if (!token.address) return null;
  let wallet = Wallet.getClientInstance();
  let erc20 = new OpenSwapContracts.ERC20(wallet, token.address);
  let allowance = await erc20.allowance({
    owner: wallet.account.address,
    spender,
  });
  return Utils.fromDecimals(allowance, token.decimals || 18);
}

const onApproveToken = async (token: ITokenObject, spender: string) => {
  if (!token.address) return;
  let erc20 = new OpenSwapContracts.ERC20(Wallet.getClientInstance(), token.address);
  let receipt = await erc20.approve({
    spender,
    amount: new BigNumber(INFINITE)
  });
  return receipt;
}

const getCurrentCommissions = (commissions: ICommissionInfo[]) => {
  return (commissions || []).filter(v => v.chainId == getChainId());
}

const getCommissionAmount = (commissions: ICommissionInfo[], amount: BigNumber) => {
  const _commissions = (commissions || []).filter(v => v.chainId == getChainId()).map(v => {
    return {
      to: v.walletAddress,
      amount: amount.times(v.share)
    }
  });
  const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new BigNumber(0);
  return commissionsAmount;
}

interface IDisperseData {
  token: ITokenObject,
  data: DisperseData[],
  commissions?: ICommissionInfo[]
}

const onDisperse = async (disperseData: IDisperseData) => {
  const { token, data, commissions } = disperseData;
  const wallet = Wallet.getClientInstance();
  const disperseAddress = getDisperseAddress();
  const disperseContract = new Contracts.Disperse(wallet, disperseAddress);
  const amount = Utils.toDecimals(data.reduce((pv, cv) => pv.plus(cv.amount), new BigNumber('0'))).dp(0);
  const _commissions = (commissions || []).filter(v => v.chainId == getChainId()).map(v => {
    return {
      to: v.walletAddress,
      amount: amount.times(v.share).dp(0)
    }
  });
  const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)).dp(0) : new BigNumber(0);
  const tokenDecimals = token.decimals || 18;
  const recipients: string[] = data.map(d => d.address);
  const values: BigNumber[] = data.map(d => d.amount.shiftedBy(tokenDecimals));
  let receipt: any;
  try {
    if (_commissions.length) {
      const proxyAddress = getProxyAddress();
      const proxy = new ProxyContracts.Proxy(wallet, proxyAddress);
      const tokensIn = {
        token: token.address || Utils.nullAddress,
        amount: amount.plus(commissionsAmount),
        directTransfer: false,
        commissions: _commissions
      }
      let txData: string;
      if (token?.address) {
        txData = await disperseContract.disperseToken.txData({ token: token.address, recipients, values });
      } else {
        txData = await disperseContract.disperseEther.txData({ recipients, values }, values.reduce((p, n) => p.plus(n)));
      }
      receipt = await proxy.proxyCall({
        target: disperseAddress,
        tokensIn: [
          tokensIn
        ],
        data: txData,
        to: wallet.address,
        tokensOut: []
      }, tokensIn.amount)
    } else {
      if (token?.address) {
        receipt = await disperseContract.disperseToken({ token: token.address, recipients, values });
      } else {
        receipt = await disperseContract.disperseEther({ recipients, values }, values.reduce((p, n) => p.plus(n)));
      }
    }
  } catch (err) {
    return { receipt: null, error: err };
  }
  return { receipt };
}

export {
  getDisperseAddress,
  onCheckAllowance,
  onApproveToken,
  onDisperse,
  getCurrentCommissions,
  getCommissionAmount
}
