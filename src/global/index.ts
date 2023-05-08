import { INetwork } from '@ijstech/eth-wallet';

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

export { PageBlock } from './pagablock';
