export interface INetwork {
    chainId: number;
    name: string;
    label: string;
    icon: string;
    rpc?: string;
    isDisabled?: boolean;
    isTestnet?: boolean;
};

export const enum EventId {
    ConnectWallet = 'DisperseConnectWallet',
    ChangeNetwork = 'DisperseChangeNetwork',
    IsWalletConnected = 'isWalletConnected',
    IsWalletDisconnected = 'IsWalletDisconnected',
    Paid = 'Paid',
    chainChanged = 'chainChanged',
    ShowExpertModal = 'showExpertModal',
    ShowTransactionModal = 'showTransactionModal',
    SlippageToleranceChanged = 'slippageToleranceChanged',
    ExpertModeChanged = 'expertModeChanged',
    ShowResult = 'showResult',
    SetResultMessage = 'setResultMessage',
    EmitButtonStatus = 'emitButtonStatus',
    EmitNewToken = 'emitNewToken',
}

export * from './utils/index';

export {
    registerSendTxEvents,
    isAddressValid,
} from './utils/common';
