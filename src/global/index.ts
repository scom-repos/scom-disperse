import { INetwork } from '@ijstech/eth-wallet';
import { IWalletPlugin } from '@scom/scom-wallet-modal';

export interface IExtendedNetwork extends INetwork {
    shortName?: string;
    isDisabled?: boolean;
    isMainChain?: boolean;
    isCrossChainSupported?: boolean;
    explorerName?: string;
    explorerTxUrl?: string;
    explorerAddressUrl?: string;
    isTestnet?: boolean;
};

export const enum EventId {
    IsWalletConnected = 'isWalletConnected',
    IsWalletDisconnected = 'IsWalletDisconnected',
    Paid = 'Paid',
    chainChanged = 'chainChanged',
    EmitNewToken = 'emitNewToken',
}

export interface INetworkConfig {
    chainName?: string;
    chainId: number;
}

export interface IDisperseConfigUI {
    commissions?: ICommissionInfo[];
    defaultChainId: number;
    wallets: IWalletPlugin[];
    networks: INetworkConfig[];
    showHeader?: boolean;
}

export interface ICommissionInfo {
    chainId: number;
    walletAddress: string;
    share: string;
}

export interface IEmbedData {
    commissions?: ICommissionInfo[];
}

export * from './utils/index';

export {
    registerSendTxEvents,
    isAddressValid,
} from './utils/common';
