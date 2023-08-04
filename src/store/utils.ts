import { Wallet, INetwork, ERC20ApprovalModel, IERC20ApprovalEventOptions, BigNumber } from '@ijstech/eth-wallet';
import { CoreContractAddressesByChainId } from './data/index';
import { application } from '@ijstech/components';
import getNetworkList from '@scom/scom-network-list';
import { ICommissionInfo } from '../global/index';

export * from './data/index';

const Disperse = "Disperse";
export type ProxyAddresses = { [key: number]: string };

export class State {
  networkMap: { [key: number]: INetwork } = {};
  infuraId: string = '';
  proxyAddresses: ProxyAddresses = {};
  embedderCommissionFee: string = '0';
  rpcWalletId: string = '';
  approvalModel: ERC20ApprovalModel;

  constructor(options: any) {
    this.networkMap = getNetworkList();
    this.initData(options);
  }

  initRpcWallet(defaultChainId: number) {
    if (this.rpcWalletId) {
      return this.rpcWalletId;
    }
    const clientWallet = Wallet.getClientInstance();
    const networkList: INetwork[] = Object.values(application.store?.networkMap || []);
    const instanceId = clientWallet.initRpcWallet({
      networks: networkList,
      defaultChainId,
      infuraId: application.store?.infuraId,
      multicalls: application.store?.multicalls
    });
    this.rpcWalletId = instanceId;
    if (clientWallet.address) {
      const rpcWallet = Wallet.getRpcWalletInstance(instanceId);
      rpcWallet.address = clientWallet.address;
    }
    return instanceId;
  }

  private initData(options: any) {
    if (options.infuraId) {
      this.infuraId = options.infuraId;
    }
    if (options.networks) {
      this.setNetworkList(options.networks, options.infuraId);
    }
    if (options.proxyAddresses) {
      this.proxyAddresses = options.proxyAddresses;
    }
    if (options.embedderCommissionFee) {
      this.embedderCommissionFee = options.embedderCommissionFee;
    }
  }

  private setNetworkList(networkList: INetwork[], infuraId?: string) {
    const wallet = Wallet.getClientInstance();
    this.networkMap = {};
    const defaultNetworkList = getNetworkList();
    const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
      acc[cur.chainId] = cur;
      return acc;
    }, {});
    for (let network of networkList) {
      const networkInfo = defaultNetworkMap[network.chainId];
      if (!networkInfo) continue;
      if (infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
        for (let i = 0; i < network.rpcUrls.length; i++) {
          network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, infuraId);
        }
      }
      this.networkMap[network.chainId] = {
        ...networkInfo,
        ...network
      };
      wallet.setNetworkInfo(this.networkMap[network.chainId]);
    }
  }

  getProxyAddress(chainId?: number) {
    const _chainId = chainId || Wallet.getInstance().chainId;
    const proxyAddresses = this.proxyAddresses;
    if (proxyAddresses) {
      return proxyAddresses[_chainId];
    }
    return null;
  }

  getRpcWallet() {
    return this.rpcWalletId ? Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
  }

  isRpcWalletConnected() {
    const wallet = this.getRpcWallet();
    return wallet?.isConnected;
  }

  getChainId() {
    const rpcWallet = this.getRpcWallet();
    return rpcWallet?.chainId;
  }

  getDisperseAddress(chainId?: number) {
    const address = CoreContractAddressesByChainId[chainId || this.getChainId()];
    return address ? address[Disperse] : null;
  }

  getCurrentCommissions(commissions: ICommissionInfo[]) {
    return (commissions || []).filter(v => v.chainId == this.getChainId());
  }


  getCommissionAmount = (commissions: ICommissionInfo[], amount: BigNumber) => {
    const _commissions = (commissions || []).filter(v => v.chainId == this.getChainId()).map(v => {
      return {
        to: v.walletAddress,
        amount: amount.times(v.share)
      }
    });
    const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new BigNumber(0);
    return commissionsAmount;
  }

  async setApprovalModelAction(options: IERC20ApprovalEventOptions) {
    const approvalOptions = {
      ...options,
      spenderAddress: ''
    };
    let wallet = this.getRpcWallet();
    this.approvalModel = new ERC20ApprovalModel(wallet, approvalOptions);
    let approvalModelAction = this.approvalModel.getAction();
    return approvalModelAction;
  }
}

export function isClientWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}