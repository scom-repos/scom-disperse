import { getCurrentChainId, getDefaultChainId, getInfuraId, getSiteSupportedNetworks, getWalletPluginProvider, setCurrentChainId, setWalletPluginProvider, WalletPlugin } from './utils';
import Coin98Provider from '../wallets/scom-coin98-wallet/index';
import TrustWalletProvider from '../wallets/scom-trust-wallet/index';
import BinanceChainWalletProvider from '../wallets/scom-binance-chain-wallet/index';
import ONTOWalletProvider from '../wallets/scom-onto-wallet/index';
import BitKeepWalletProvider from '../wallets/scom-bit-keep-wallet/index';
import FrontierWalletProvider from '../wallets/scom-frontier-wallet/index';
import { IClientProviderOptions, IClientSideProvider, IClientSideProviderEvents, MetaMaskProvider, Wallet, Web3ModalProvider } from '@ijstech/eth-wallet';
import { application } from '@ijstech/components';
import { EventId } from '../global/index';
import { tokenStore } from './token';

export type WalletPluginItemType = {
  provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => IClientSideProvider;
}

export type WalletPluginConfigType = Record<WalletPlugin, WalletPluginItemType>;

export const WalletPluginConfig: WalletPluginConfigType = {
  [WalletPlugin.MetaMask]: {
    provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
      return new MetaMaskProvider(wallet, events, options);
    }
  },
  [WalletPlugin.Coin98]: {
    provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
      return new Coin98Provider(wallet, events, options);
    }
  },
  [WalletPlugin.TrustWallet]: {
    provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
      return new TrustWalletProvider(wallet, events, options);
    }
  },
  [WalletPlugin.BinanceChainWallet]: {
    provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
      return new BinanceChainWalletProvider(wallet, events, options);
    }
  },
  [WalletPlugin.ONTOWallet]: {
    provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
      return new ONTOWalletProvider(wallet, events, options);
    }
  },
  [WalletPlugin.BitKeepWallet]: {
    provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
      return new BitKeepWalletProvider(wallet, events, options);
    }
  },
  [WalletPlugin.FrontierWallet]: {
    provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
      return new FrontierWalletProvider(wallet, events, options);
    },
  },
  [WalletPlugin.WalletConnect]: {
    provider: (wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions) => {
      return new Web3ModalProvider(wallet, events, options);
    }
  }
}

export function initWalletPlugins(eventHandlers?: { [key: string]: Function }) {
  let wallet: any = Wallet.getClientInstance();
  const events = {
    onAccountChanged: async (account: string) => {
      if (eventHandlers && eventHandlers.accountsChanged) {
        eventHandlers.accountsChanged(account);
      }
      const connected = !!account;
      if (connected) {
        localStorage.setItem('walletProvider', Wallet.getClientInstance().clientSideProvider?.name || '');
        if (wallet.chainId !== getCurrentChainId()) {
          setCurrentChainId(wallet.chainId);
          application.EventBus.dispatch(EventId.chainChanged, wallet.chainId);
        }
        tokenStore.updateTokenMapData();
        await tokenStore.updateAllTokenBalances();
      }
      application.EventBus.dispatch(EventId.IsWalletConnected, connected);
    },
    onChainChanged: async (chainIdHex: string) => {
      const chainId = Number(chainIdHex);

      if (eventHandlers && eventHandlers.chainChanged) {
        eventHandlers.chainChanged(chainId);
      }

      setCurrentChainId(chainId);
      tokenStore.updateTokenMapData();
      await tokenStore.updateAllTokenBalances();
      application.EventBus.dispatch(EventId.chainChanged, chainId);
    }
  }
  let networkList = getSiteSupportedNetworks();
  const rpcs: { [chainId: number]: string } = {}
  for (const network of networkList) {
    let rpc = network.rpcUrls[0];
    if (rpc) rpcs[network.chainId] = rpc;
  }

  for (let pluginName in WalletPluginConfig) {
    let providerOptions;
    if (pluginName == WalletPlugin.WalletConnect) {
      providerOptions = {
        name: pluginName,
        infuraId: getInfuraId(),
        bridge: "https://bridge.walletconnect.org",
        rpc: rpcs,
        useDefaultProvider: true
      }
    }
    else {
      providerOptions = {
        name: pluginName,
        infuraId: getInfuraId(),
        rpc: rpcs,
        useDefaultProvider: true
      }
    }
    let provider = WalletPluginConfig[pluginName as WalletPlugin].provider(wallet, events, providerOptions);
    setWalletPluginProvider(pluginName as WalletPlugin, provider);
  }
}

export async function connectWallet(walletPlugin: WalletPlugin) {
  let wallet: any = Wallet.getClientInstance();
  if (!wallet.chainId) {
    wallet.chainId = getDefaultChainId();
  }
  let provider = getWalletPluginProvider(walletPlugin);
  if (provider?.installed()) {
    await wallet.connect(provider);
  }
  return wallet;
}

export async function logoutWallet() {
  const wallet = Wallet.getClientInstance();
  await wallet.disconnect();
  localStorage.setItem('walletProvider', '');
  application.EventBus.dispatch(EventId.IsWalletDisconnected, false);
}
