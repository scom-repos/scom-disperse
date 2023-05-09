import { getAddresses, INFINITE } from "../store/index";
import { DisperseData, ITokenObject } from "../global/index"
import { Wallet, BigNumber, Utils } from "@ijstech/eth-wallet";
import { Contracts as OpenSwapContracts } from "../contracts/oswap-openswap-contract/index";
import { DisperseActions } from "../contracts/scom-disperse-contract/index";

const getDisperseAddress = () => {
  return getAddresses(Wallet.getClientInstance().chainId)["Disperse"];
}

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

// TODO add disperse sdk
const onDisperse = async (token: ITokenObject, disperseData: DisperseData[]) => {
  let disperseAddress = getDisperseAddress();
  return await DisperseActions.doDisperse(
    Wallet.getClientInstance() as any,
    disperseAddress,
    token.address || null,
    token.decimals,
    disperseData
  );
}

export {
  getDisperseAddress,
  onCheckAllowance,
  onApproveToken,
  onDisperse,
}
