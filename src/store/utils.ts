import { Wallet, INetwork } from '@ijstech/eth-wallet';
import { CoreContractAddressesByChainId } from './data/index';
import { application } from '@ijstech/components';
import getNetworkList from '@scom/scom-network-list';
import { ITokenObject } from '@scom/scom-token-list';

export * from './data/index';

export enum WalletPlugin {
  MetaMask = 'metamask',
  WalletConnect = 'walletconnect'
}

export const INFINITE = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

const TOKENS = "oswap_user_tokens_";

const Disperse = "Disperse";

export const getUserTokens = (chainId: number) => {
  let tokens = localStorage[TOKENS + chainId];
  if (tokens) {
    tokens = JSON.parse(tokens);
  } else {
    tokens = [];
  }
  const userTokens = state.userTokens[chainId];
  if (userTokens && userTokens.length) {
    tokens = tokens.concat(userTokens);
  }
  return tokens.length ? tokens : null;
}

export const addUserTokens = (token: ITokenObject) => {
  const chainId = getChainId();
  let tokens = localStorage[TOKENS + chainId];
  let i = -1;
  if (tokens) {
    tokens = JSON.parse(tokens);
    i = tokens.findIndex((item: ITokenObject) => item.address == token.address);
  } else {
    tokens = [];
  }
  if (i == -1) {
    tokens.push(token);
  }
  localStorage[TOKENS + chainId] = JSON.stringify(tokens);
}

const setInfuraId = (infuraId: string) => {
  state.infuraId = infuraId;
}

export const getInfuraId = () => {
  return state.infuraId;
}

const setNetworkList = (networkList: INetwork[], infuraId?: string) => {
  const wallet = Wallet.getClientInstance();
  state.networkMap = {};
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
    state.networkMap[network.chainId] = {
      ...networkInfo,
      ...network
    };
    wallet.setNetworkInfo(state.networkMap[network.chainId]);
  }
}

export function getDisperseAddress(chainId?: number) {
  const address = CoreContractAddressesByChainId[chainId || getChainId()];
  return address ? address[Disperse] : null;
}

export const setDataFromSCConfig = (options: any) => {
  if (options.infuraId) {
    setInfuraId(options.infuraId)
  }
  if (options.networks) {
    setNetworkList(options.networks, options.infuraId)
  }
  if (options.proxyAddresses) {
    setProxyAddresses(options.proxyAddresses)
  }
  if (options.embedderCommissionFee) {
    setEmbedderCommissionFee(options.embedderCommissionFee);
  }
}

export const setProxyAddresses = (data: ProxyAddresses) => {
  state.proxyAddresses = data;
}

export const getProxyAddress = (chainId?: number) => {
  const _chainId = chainId || Wallet.getInstance().chainId;
  const proxyAddresses = state.proxyAddresses;
  if (proxyAddresses) {
    return proxyAddresses[_chainId];
  }
  return null;
}

const setEmbedderCommissionFee = (fee: string) => {
  state.embedderCommissionFee = fee;
}

export const getEmbedderCommissionFee = () => {
  return state.embedderCommissionFee;
}

export const hasMetaMask = function () {
  const wallet = Wallet.getClientInstance();
  return wallet?.clientSideProvider?.name === WalletPlugin.MetaMask;
}

export type ProxyAddresses = { [key: number]: string };

export const state = {
  networkMap: {} as { [key: number]: INetwork },
  infuraId: '',
  userTokens: {} as { [key: string]: ITokenObject[] },
  proxyAddresses: {} as ProxyAddresses,
  embedderCommissionFee: '0',
  tokens: [],
  rpcWalletId: ''
}

export const setUserTokens = (token: ITokenObject, chainId: number) => {
  if (!state.userTokens[chainId]) {
    state.userTokens[chainId] = [token];
  } else {
    state.userTokens[chainId].push(token);
  }
}

export const hasUserToken = (address: string, chainId: number) => {
  return state.userTokens[chainId]?.some((token: ITokenObject) => token.address?.toLocaleLowerCase() === address?.toLocaleLowerCase());
}

export function isClientWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}

export function isRpcWalletConnected() {
  const wallet = getRpcWallet();
  return wallet?.isConnected;
}

export function getChainId() {
  const rpcWallet = getRpcWallet();
  return rpcWallet?.chainId;
}

export function initRpcWallet(defaultChainId: number) {
  if (state.rpcWalletId) {
    return state.rpcWalletId;
  }
  const clientWallet = Wallet.getClientInstance();
  const networkList: INetwork[] = Object.values(application.store.networkMap);
  const instanceId = clientWallet.initRpcWallet({
    networks: networkList,
    defaultChainId,
    infuraId: application.store.infuraId,
    multicalls: application.store.multicalls
  });
  state.rpcWalletId = instanceId;
  if (clientWallet.address) {
    const rpcWallet = Wallet.getRpcWalletInstance(instanceId);
    rpcWallet.address = clientWallet.address;
  }
  return instanceId;
}

export function getRpcWallet() {
  return Wallet.getRpcWalletInstance(state.rpcWalletId);
}

export function getClientWallet() {
  return Wallet.getClientInstance();
}