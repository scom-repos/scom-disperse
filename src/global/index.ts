import { INetworkConfig } from '@scom/scom-network-picker';
import { IWalletPlugin } from '@scom/scom-wallet-modal';

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

export interface RenderResultData {
    receipt: string;
    address: string;
    timestamp: string;
}

export interface DownloadReportData extends RenderResultData {
    symbol: string;
}

export * from './utils/index';
