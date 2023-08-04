/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dapp-container/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-token-modal/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@ijstech/eth-contract/index.d.ts" />
/// <amd-module name="@scom/scom-disperse/global/utils/helper.ts" />
declare module "@scom/scom-disperse/global/utils/helper.ts" {
    import { BigNumber } from "@ijstech/eth-wallet";
    export const explorerTxUrlsByChainId: {
        [key: number]: string;
    };
    export const DefaultDateFormat = "YYYY/MM/DD HH:mm:ss";
    export const formatUTCDate: (date: any, formatType?: string) => string;
    export const formatNumber: (value: any, decimals?: number) => string;
    export const formatNumberWithSeparators: (value: number, precision?: number) => string;
    export const viewOnExplorerByTxHash: (chainId: number, txHash: string) => void;
    export interface DisperseData {
        address: string;
        amount: BigNumber;
    }
    export interface DisperseCheckedData extends DisperseData {
        isAddressOk: boolean;
        AddressErrorMessage: string;
        isAmountOk: boolean;
        AmountErrorMessage: string;
    }
    export function disperseDataToString(data: DisperseData[]): string;
    export const toDisperseData: (inputText: string) => DisperseData[];
    export const downloadCSVFile: (content: string, name: string) => void;
}
/// <amd-module name="@scom/scom-disperse/global/utils/common.ts" />
declare module "@scom/scom-disperse/global/utils/common.ts" {
    import { ISendTxEventsOptions } from "@ijstech/eth-wallet";
    export const registerSendTxEvents: (sendTxEventHandlers: ISendTxEventsOptions) => void;
    export const isAddressValid: (address: string) => Promise<any>;
}
/// <amd-module name="@scom/scom-disperse/global/utils/index.ts" />
declare module "@scom/scom-disperse/global/utils/index.ts" {
    export * from "@scom/scom-disperse/global/utils/helper.ts";
    export * from "@scom/scom-disperse/global/utils/common.ts";
}
/// <amd-module name="@scom/scom-disperse/global/index.ts" />
declare module "@scom/scom-disperse/global/index.ts" {
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
    export * from "@scom/scom-disperse/global/utils/index.ts";
}
/// <amd-module name="@scom/scom-disperse/store/data/core.ts" />
declare module "@scom/scom-disperse/store/data/core.ts" {
    export const CoreContractAddressesByChainId: {
        [chainId: number]: {
            [contract: string]: string;
        };
    };
}
/// <amd-module name="@scom/scom-disperse/store/data/dummy.ts" />
declare module "@scom/scom-disperse/store/data/dummy.ts" {
    export const dummyAddressList: string[];
}
/// <amd-module name="@scom/scom-disperse/store/data/warning.ts" />
declare module "@scom/scom-disperse/store/data/warning.ts" {
    export enum ImportFileWarning {
        Empty = "No data found in the imported file.",
        Broken = "Data is corrupted. No data were recovered.",
        Corrupted = "Data is corrupted. Please double check the recovered data below.",
        Ok = "Import Successful. No errors found."
    }
}
/// <amd-module name="@scom/scom-disperse/store/data/index.ts" />
declare module "@scom/scom-disperse/store/data/index.ts" {
    export { CoreContractAddressesByChainId } from "@scom/scom-disperse/store/data/core.ts";
    export { dummyAddressList } from "@scom/scom-disperse/store/data/dummy.ts";
    export { ImportFileWarning } from "@scom/scom-disperse/store/data/warning.ts";
}
/// <amd-module name="@scom/scom-disperse/store/utils.ts" />
declare module "@scom/scom-disperse/store/utils.ts" {
    import { INetwork, ERC20ApprovalModel, IERC20ApprovalEventOptions, BigNumber } from '@ijstech/eth-wallet';
    import { ICommissionInfo } from "@scom/scom-disperse/global/index.ts";
    export * from "@scom/scom-disperse/store/data/index.ts";
    export type ProxyAddresses = {
        [key: number]: string;
    };
    export class State {
        networkMap: {
            [key: number]: INetwork;
        };
        infuraId: string;
        proxyAddresses: ProxyAddresses;
        embedderCommissionFee: string;
        rpcWalletId: string;
        approvalModel: ERC20ApprovalModel;
        constructor(options: any);
        initRpcWallet(defaultChainId: number): string;
        private initData;
        private setNetworkList;
        getProxyAddress(chainId?: number): string;
        getRpcWallet(): import("@ijstech/eth-wallet").IRpcWallet;
        isRpcWalletConnected(): boolean;
        getChainId(): number;
        getDisperseAddress(chainId?: number): string;
        getCurrentCommissions(commissions: ICommissionInfo[]): ICommissionInfo[];
        getCommissionAmount: (commissions: ICommissionInfo[], amount: BigNumber) => BigNumber;
        setApprovalModelAction(options: IERC20ApprovalEventOptions): Promise<import("@ijstech/eth-wallet").IERC20ApprovalAction>;
    }
    export function isClientWalletConnected(): boolean;
}
/// <amd-module name="@scom/scom-disperse/store/index.ts" />
declare module "@scom/scom-disperse/store/index.ts" {
    export * from "@scom/scom-disperse/store/utils.ts";
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/Authorization.json.ts" />
declare module "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/Authorization.json.ts" {
    const _default: {
        abi: ({
            inputs: any[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
            name?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            stateMutability?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        })[];
        bytecode: string;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/Authorization.ts" />
declare module "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/Authorization.ts" {
    import { IWallet, Contract as _Contract, TransactionReceipt, Event, TransactionOptions } from "@ijstech/eth-contract";
    export class Authorization extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(options?: TransactionOptions): Promise<string>;
        parseAuthorizeEvent(receipt: TransactionReceipt): Authorization.AuthorizeEvent[];
        decodeAuthorizeEvent(event: Event): Authorization.AuthorizeEvent;
        parseDeauthorizeEvent(receipt: TransactionReceipt): Authorization.DeauthorizeEvent[];
        decodeDeauthorizeEvent(event: Event): Authorization.DeauthorizeEvent;
        parseStartOwnershipTransferEvent(receipt: TransactionReceipt): Authorization.StartOwnershipTransferEvent[];
        decodeStartOwnershipTransferEvent(event: Event): Authorization.StartOwnershipTransferEvent;
        parseTransferOwnershipEvent(receipt: TransactionReceipt): Authorization.TransferOwnershipEvent[];
        decodeTransferOwnershipEvent(event: Event): Authorization.TransferOwnershipEvent;
        deny: {
            (user: string, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (user: string, options?: TransactionOptions) => Promise<void>;
            txData: (user: string, options?: TransactionOptions) => Promise<string>;
        };
        isPermitted: {
            (param1: string, options?: TransactionOptions): Promise<boolean>;
        };
        newOwner: {
            (options?: TransactionOptions): Promise<string>;
        };
        owner: {
            (options?: TransactionOptions): Promise<string>;
        };
        permit: {
            (user: string, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (user: string, options?: TransactionOptions) => Promise<void>;
            txData: (user: string, options?: TransactionOptions) => Promise<string>;
        };
        takeOwnership: {
            (options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (options?: TransactionOptions) => Promise<void>;
            txData: (options?: TransactionOptions) => Promise<string>;
        };
        transferOwnership: {
            (newOwner: string, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (newOwner: string, options?: TransactionOptions) => Promise<void>;
            txData: (newOwner: string, options?: TransactionOptions) => Promise<string>;
        };
        private assign;
    }
    export module Authorization {
        interface AuthorizeEvent {
            user: string;
            _event: Event;
        }
        interface DeauthorizeEvent {
            user: string;
            _event: Event;
        }
        interface StartOwnershipTransferEvent {
            user: string;
            _event: Event;
        }
        interface TransferOwnershipEvent {
            user: string;
            _event: Event;
        }
    }
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/Proxy.json.ts" />
declare module "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/Proxy.json.ts" {
    const _default_1: {
        abi: ({
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            outputs?: undefined;
            stateMutability?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                components: {
                    internalType: string;
                    name: string;
                    type: string;
                }[];
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        } | {
            inputs: ({
                internalType: string;
                name: string;
                type: string;
                components?: undefined;
            } | {
                components: ({
                    internalType: string;
                    name: string;
                    type: string;
                    components?: undefined;
                } | {
                    components: {
                        internalType: string;
                        name: string;
                        type: string;
                    }[];
                    internalType: string;
                    name: string;
                    type: string;
                })[];
                internalType: string;
                name: string;
                type: string;
            })[];
            name: string;
            outputs: any[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        } | {
            stateMutability: string;
            type: string;
            anonymous?: undefined;
            inputs?: undefined;
            name?: undefined;
            outputs?: undefined;
        })[];
        bytecode: string;
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/Proxy.ts" />
declare module "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/Proxy.ts" {
    import { IWallet, Contract as _Contract, TransactionReceipt, BigNumber, Event, TransactionOptions } from "@ijstech/eth-contract";
    export interface IClaimantIdsParams {
        param1: string;
        param2: string;
    }
    export interface IEthInParams {
        target: string;
        commissions: {
            to: string;
            amount: number | BigNumber;
        }[];
        data: string;
    }
    export interface IGetClaimantBalanceParams {
        claimant: string;
        token: string;
    }
    export interface IGetClaimantsInfoParams {
        fromId: number | BigNumber;
        count: number | BigNumber;
    }
    export interface IProxyCallParams {
        target: string;
        tokensIn: {
            token: string;
            amount: number | BigNumber;
            directTransfer: boolean;
            commissions: {
                to: string;
                amount: number | BigNumber;
            }[];
        }[];
        to: string;
        tokensOut: string[];
        data: string;
    }
    export interface ITokenInParams {
        target: string;
        tokensIn: {
            token: string;
            amount: number | BigNumber;
            directTransfer: boolean;
            commissions: {
                to: string;
                amount: number | BigNumber;
            }[];
        };
        data: string;
    }
    export class Proxy extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(options?: TransactionOptions): Promise<string>;
        parseAddCommissionEvent(receipt: TransactionReceipt): Proxy.AddCommissionEvent[];
        decodeAddCommissionEvent(event: Event): Proxy.AddCommissionEvent;
        parseClaimEvent(receipt: TransactionReceipt): Proxy.ClaimEvent[];
        decodeClaimEvent(event: Event): Proxy.ClaimEvent;
        parseSkimEvent(receipt: TransactionReceipt): Proxy.SkimEvent[];
        decodeSkimEvent(event: Event): Proxy.SkimEvent;
        parseTransferBackEvent(receipt: TransactionReceipt): Proxy.TransferBackEvent[];
        decodeTransferBackEvent(event: Event): Proxy.TransferBackEvent;
        parseTransferForwardEvent(receipt: TransactionReceipt): Proxy.TransferForwardEvent[];
        decodeTransferForwardEvent(event: Event): Proxy.TransferForwardEvent;
        claim: {
            (token: string, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (token: string, options?: TransactionOptions) => Promise<void>;
            txData: (token: string, options?: TransactionOptions) => Promise<string>;
        };
        claimMultiple: {
            (tokens: string[], options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (tokens: string[], options?: TransactionOptions) => Promise<void>;
            txData: (tokens: string[], options?: TransactionOptions) => Promise<string>;
        };
        claimantIdCount: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
        claimantIds: {
            (params: IClaimantIdsParams, options?: TransactionOptions): Promise<BigNumber>;
        };
        claimantsInfo: {
            (param1: number | BigNumber, options?: TransactionOptions): Promise<{
                claimant: string;
                token: string;
                balance: BigNumber;
            }>;
        };
        ethIn: {
            (params: IEthInParams, options?: number | BigNumber | TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IEthInParams, options?: number | BigNumber | TransactionOptions) => Promise<void>;
            txData: (params: IEthInParams, options?: number | BigNumber | TransactionOptions) => Promise<string>;
        };
        getClaimantBalance: {
            (params: IGetClaimantBalanceParams, options?: TransactionOptions): Promise<BigNumber>;
        };
        getClaimantsInfo: {
            (params: IGetClaimantsInfoParams, options?: TransactionOptions): Promise<{
                claimant: string;
                token: string;
                balance: BigNumber;
            }[]>;
        };
        lastBalance: {
            (param1: string, options?: TransactionOptions): Promise<BigNumber>;
        };
        proxyCall: {
            (params: IProxyCallParams, options?: number | BigNumber | TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IProxyCallParams, options?: number | BigNumber | TransactionOptions) => Promise<void>;
            txData: (params: IProxyCallParams, options?: number | BigNumber | TransactionOptions) => Promise<string>;
        };
        skim: {
            (tokens: string[], options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (tokens: string[], options?: TransactionOptions) => Promise<void>;
            txData: (tokens: string[], options?: TransactionOptions) => Promise<string>;
        };
        tokenIn: {
            (params: ITokenInParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: ITokenInParams, options?: TransactionOptions) => Promise<void>;
            txData: (params: ITokenInParams, options?: TransactionOptions) => Promise<string>;
        };
        private assign;
    }
    export module Proxy {
        interface AddCommissionEvent {
            to: string;
            token: string;
            amount: BigNumber;
            _event: Event;
        }
        interface ClaimEvent {
            from: string;
            token: string;
            amount: BigNumber;
            _event: Event;
        }
        interface SkimEvent {
            token: string;
            to: string;
            amount: BigNumber;
            _event: Event;
        }
        interface TransferBackEvent {
            target: string;
            token: string;
            sender: string;
            amount: BigNumber;
            _event: Event;
        }
        interface TransferForwardEvent {
            target: string;
            token: string;
            sender: string;
            amount: BigNumber;
            commissions: BigNumber;
            _event: Event;
        }
    }
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/ProxyV2.json.ts" />
declare module "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/ProxyV2.json.ts" {
    const _default_2: {
        abi: ({
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            outputs?: undefined;
            stateMutability?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                components: {
                    internalType: string;
                    name: string;
                    type: string;
                }[];
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        } | {
            inputs: ({
                internalType: string;
                name: string;
                type: string;
                components?: undefined;
            } | {
                components: ({
                    internalType: string;
                    name: string;
                    type: string;
                    components?: undefined;
                } | {
                    components: {
                        internalType: string;
                        name: string;
                        type: string;
                    }[];
                    internalType: string;
                    name: string;
                    type: string;
                })[];
                internalType: string;
                name: string;
                type: string;
            })[];
            name: string;
            outputs: any[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        } | {
            stateMutability: string;
            type: string;
            anonymous?: undefined;
            inputs?: undefined;
            name?: undefined;
            outputs?: undefined;
        })[];
        bytecode: string;
    };
    export default _default_2;
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/ProxyV2.ts" />
declare module "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/ProxyV2.ts" {
    import { IWallet, Contract as _Contract, TransactionReceipt, BigNumber, Event, TransactionOptions } from "@ijstech/eth-contract";
    export interface IClaimantIdsParams {
        param1: string;
        param2: string;
    }
    export interface IEthInParams {
        target: string;
        commissions: {
            to: string;
            amount: number | BigNumber;
        }[];
        data: string;
    }
    export interface IGetClaimantBalanceParams {
        claimant: string;
        token: string;
    }
    export interface IGetClaimantsInfoParams {
        fromId: number | BigNumber;
        count: number | BigNumber;
    }
    export interface IProxyCallParams {
        target: string;
        tokensIn: {
            token: string;
            amount: number | BigNumber;
            directTransfer: boolean;
            commissions: {
                to: string;
                amount: number | BigNumber;
            }[];
            totalCommissions: number | BigNumber;
        }[];
        to: string;
        tokensOut: string[];
        data: string;
    }
    export interface ITokenInParams {
        target: string;
        tokensIn: {
            token: string;
            amount: number | BigNumber;
            directTransfer: boolean;
            commissions: {
                to: string;
                amount: number | BigNumber;
            }[];
            totalCommissions: number | BigNumber;
        };
        data: string;
    }
    export class ProxyV2 extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(options?: TransactionOptions): Promise<string>;
        parseAddCommissionEvent(receipt: TransactionReceipt): ProxyV2.AddCommissionEvent[];
        decodeAddCommissionEvent(event: Event): ProxyV2.AddCommissionEvent;
        parseClaimEvent(receipt: TransactionReceipt): ProxyV2.ClaimEvent[];
        decodeClaimEvent(event: Event): ProxyV2.ClaimEvent;
        parseSkimEvent(receipt: TransactionReceipt): ProxyV2.SkimEvent[];
        decodeSkimEvent(event: Event): ProxyV2.SkimEvent;
        parseTransferBackEvent(receipt: TransactionReceipt): ProxyV2.TransferBackEvent[];
        decodeTransferBackEvent(event: Event): ProxyV2.TransferBackEvent;
        parseTransferForwardEvent(receipt: TransactionReceipt): ProxyV2.TransferForwardEvent[];
        decodeTransferForwardEvent(event: Event): ProxyV2.TransferForwardEvent;
        claim: {
            (token: string, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (token: string, options?: TransactionOptions) => Promise<void>;
            txData: (token: string, options?: TransactionOptions) => Promise<string>;
        };
        claimMultiple: {
            (tokens: string[], options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (tokens: string[], options?: TransactionOptions) => Promise<void>;
            txData: (tokens: string[], options?: TransactionOptions) => Promise<string>;
        };
        claimantIdCount: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
        claimantIds: {
            (params: IClaimantIdsParams, options?: TransactionOptions): Promise<BigNumber>;
        };
        claimantsInfo: {
            (param1: number | BigNumber, options?: TransactionOptions): Promise<{
                claimant: string;
                token: string;
                balance: BigNumber;
            }>;
        };
        ethIn: {
            (params: IEthInParams, options?: number | BigNumber | TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IEthInParams, options?: number | BigNumber | TransactionOptions) => Promise<void>;
            txData: (params: IEthInParams, options?: number | BigNumber | TransactionOptions) => Promise<string>;
        };
        getClaimantBalance: {
            (params: IGetClaimantBalanceParams, options?: TransactionOptions): Promise<BigNumber>;
        };
        getClaimantsInfo: {
            (params: IGetClaimantsInfoParams, options?: TransactionOptions): Promise<{
                claimant: string;
                token: string;
                balance: BigNumber;
            }[]>;
        };
        lastBalance: {
            (param1: string, options?: TransactionOptions): Promise<BigNumber>;
        };
        proxyCall: {
            (params: IProxyCallParams, options?: number | BigNumber | TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IProxyCallParams, options?: number | BigNumber | TransactionOptions) => Promise<void>;
            txData: (params: IProxyCallParams, options?: number | BigNumber | TransactionOptions) => Promise<string>;
        };
        skim: {
            (tokens: string[], options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (tokens: string[], options?: TransactionOptions) => Promise<void>;
            txData: (tokens: string[], options?: TransactionOptions) => Promise<string>;
        };
        tokenIn: {
            (params: ITokenInParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: ITokenInParams, options?: TransactionOptions) => Promise<void>;
            txData: (params: ITokenInParams, options?: TransactionOptions) => Promise<string>;
        };
        private assign;
    }
    export module ProxyV2 {
        interface AddCommissionEvent {
            to: string;
            token: string;
            amount: BigNumber;
            _event: Event;
        }
        interface ClaimEvent {
            from: string;
            token: string;
            amount: BigNumber;
            _event: Event;
        }
        interface SkimEvent {
            token: string;
            to: string;
            amount: BigNumber;
            _event: Event;
        }
        interface TransferBackEvent {
            target: string;
            token: string;
            sender: string;
            amount: BigNumber;
            _event: Event;
        }
        interface TransferForwardEvent {
            target: string;
            token: string;
            sender: string;
            amount: BigNumber;
            commissions: BigNumber;
            _event: Event;
        }
    }
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/ProxyV3.json.ts" />
declare module "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/ProxyV3.json.ts" {
    const _default_3: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
            name?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            stateMutability?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                components: ({
                    internalType: string;
                    name: string;
                    type: string;
                    components?: undefined;
                } | {
                    components: {
                        internalType: string;
                        name: string;
                        type: string;
                    }[];
                    internalType: string;
                    name: string;
                    type: string;
                })[];
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: ({
                internalType: string;
                name: string;
                type: string;
                components?: undefined;
            } | {
                components: {
                    internalType: string;
                    name: string;
                    type: string;
                }[];
                internalType: string;
                name: string;
                type: string;
            })[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        } | {
            inputs: {
                components: ({
                    internalType: string;
                    name: string;
                    type: string;
                    components?: undefined;
                } | {
                    components: {
                        internalType: string;
                        name: string;
                        type: string;
                    }[];
                    internalType: string;
                    name: string;
                    type: string;
                })[];
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        } | {
            inputs: ({
                internalType: string;
                name: string;
                type: string;
                components?: undefined;
            } | {
                components: {
                    internalType: string;
                    name: string;
                    type: string;
                }[];
                internalType: string;
                name: string;
                type: string;
            })[];
            name: string;
            outputs: any[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        } | {
            stateMutability: string;
            type: string;
            inputs?: undefined;
            anonymous?: undefined;
            name?: undefined;
            outputs?: undefined;
        })[];
        bytecode: string;
    };
    export default _default_3;
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/ProxyV3.ts" />
declare module "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/ProxyV3.ts" {
    import { IWallet, Contract as _Contract, TransactionReceipt, BigNumber, Event, TransactionOptions } from "@ijstech/eth-contract";
    export interface IAddProjectAdminParams {
        projectId: number | BigNumber;
        admin: string;
    }
    export interface ICampaignAccumulatedCommissionParams {
        param1: number | BigNumber;
        param2: string;
    }
    export interface IClaimantIdsParams {
        param1: string;
        param2: string;
    }
    export interface IGetCampaignParams {
        campaignId: number | BigNumber;
        returnArrays: boolean;
    }
    export interface IGetCampaignArrayData1Params {
        campaignId: number | BigNumber;
        targetAndSelectorsStart: number | BigNumber;
        targetAndSelectorsLength: number | BigNumber;
        referrersStart: number | BigNumber;
        referrersLength: number | BigNumber;
    }
    export interface IGetCampaignArrayData2Params {
        campaignId: number | BigNumber;
        inTokensStart: number | BigNumber;
        inTokensLength: number | BigNumber;
        outTokensStart: number | BigNumber;
        outTokensLength: number | BigNumber;
    }
    export interface IGetClaimantBalanceParams {
        claimant: string;
        token: string;
    }
    export interface IGetClaimantsInfoParams {
        fromId: number | BigNumber;
        count: number | BigNumber;
    }
    export interface IProxyCallParams {
        campaignId: number | BigNumber;
        target: string;
        data: string;
        referrer: string;
        to: string;
        tokensIn: {
            token: string;
            amount: number | BigNumber;
        }[];
        tokensOut: string[];
    }
    export interface IRemoveProjectAdminParams {
        projectId: number | BigNumber;
        admin: string;
    }
    export interface IStakeParams {
        projectId: number | BigNumber;
        token: string;
        amount: number | BigNumber;
    }
    export interface IStakeMultipleParams {
        projectId: number | BigNumber;
        token: string[];
        amount: (number | BigNumber)[];
    }
    export interface IStakesBalanceParams {
        param1: number | BigNumber;
        param2: string;
    }
    export interface ITransferProjectOwnershipParams {
        projectId: number | BigNumber;
        newOwner: string;
    }
    export interface IUnstakeParams {
        projectId: number | BigNumber;
        token: string;
        amount: number | BigNumber;
    }
    export interface IUnstakeMultipleParams {
        projectId: number | BigNumber;
        token: string[];
        amount: (number | BigNumber)[];
    }
    export class ProxyV3 extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(protocolRate: number | BigNumber, options?: TransactionOptions): Promise<string>;
        parseAddCommissionEvent(receipt: TransactionReceipt): ProxyV3.AddCommissionEvent[];
        decodeAddCommissionEvent(event: Event): ProxyV3.AddCommissionEvent;
        parseAddProjectAdminEvent(receipt: TransactionReceipt): ProxyV3.AddProjectAdminEvent[];
        decodeAddProjectAdminEvent(event: Event): ProxyV3.AddProjectAdminEvent;
        parseAuthorizeEvent(receipt: TransactionReceipt): ProxyV3.AuthorizeEvent[];
        decodeAuthorizeEvent(event: Event): ProxyV3.AuthorizeEvent;
        parseClaimEvent(receipt: TransactionReceipt): ProxyV3.ClaimEvent[];
        decodeClaimEvent(event: Event): ProxyV3.ClaimEvent;
        parseClaimProtocolFeeEvent(receipt: TransactionReceipt): ProxyV3.ClaimProtocolFeeEvent[];
        decodeClaimProtocolFeeEvent(event: Event): ProxyV3.ClaimProtocolFeeEvent;
        parseDeauthorizeEvent(receipt: TransactionReceipt): ProxyV3.DeauthorizeEvent[];
        decodeDeauthorizeEvent(event: Event): ProxyV3.DeauthorizeEvent;
        parseNewCampaignEvent(receipt: TransactionReceipt): ProxyV3.NewCampaignEvent[];
        decodeNewCampaignEvent(event: Event): ProxyV3.NewCampaignEvent;
        parseNewProjectEvent(receipt: TransactionReceipt): ProxyV3.NewProjectEvent[];
        decodeNewProjectEvent(event: Event): ProxyV3.NewProjectEvent;
        parseRemoveProjectAdminEvent(receipt: TransactionReceipt): ProxyV3.RemoveProjectAdminEvent[];
        decodeRemoveProjectAdminEvent(event: Event): ProxyV3.RemoveProjectAdminEvent;
        parseSetProtocolRateEvent(receipt: TransactionReceipt): ProxyV3.SetProtocolRateEvent[];
        decodeSetProtocolRateEvent(event: Event): ProxyV3.SetProtocolRateEvent;
        parseSkimEvent(receipt: TransactionReceipt): ProxyV3.SkimEvent[];
        decodeSkimEvent(event: Event): ProxyV3.SkimEvent;
        parseStakeEvent(receipt: TransactionReceipt): ProxyV3.StakeEvent[];
        decodeStakeEvent(event: Event): ProxyV3.StakeEvent;
        parseStartOwnershipTransferEvent(receipt: TransactionReceipt): ProxyV3.StartOwnershipTransferEvent[];
        decodeStartOwnershipTransferEvent(event: Event): ProxyV3.StartOwnershipTransferEvent;
        parseTakeoverProjectOwnershipEvent(receipt: TransactionReceipt): ProxyV3.TakeoverProjectOwnershipEvent[];
        decodeTakeoverProjectOwnershipEvent(event: Event): ProxyV3.TakeoverProjectOwnershipEvent;
        parseTransferBackEvent(receipt: TransactionReceipt): ProxyV3.TransferBackEvent[];
        decodeTransferBackEvent(event: Event): ProxyV3.TransferBackEvent;
        parseTransferForwardEvent(receipt: TransactionReceipt): ProxyV3.TransferForwardEvent[];
        decodeTransferForwardEvent(event: Event): ProxyV3.TransferForwardEvent;
        parseTransferOwnershipEvent(receipt: TransactionReceipt): ProxyV3.TransferOwnershipEvent[];
        decodeTransferOwnershipEvent(event: Event): ProxyV3.TransferOwnershipEvent;
        parseTransferProjectOwnershipEvent(receipt: TransactionReceipt): ProxyV3.TransferProjectOwnershipEvent[];
        decodeTransferProjectOwnershipEvent(event: Event): ProxyV3.TransferProjectOwnershipEvent;
        parseUnstakeEvent(receipt: TransactionReceipt): ProxyV3.UnstakeEvent[];
        decodeUnstakeEvent(event: Event): ProxyV3.UnstakeEvent;
        addProjectAdmin: {
            (params: IAddProjectAdminParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IAddProjectAdminParams, options?: TransactionOptions) => Promise<void>;
            txData: (params: IAddProjectAdminParams, options?: TransactionOptions) => Promise<string>;
        };
        campaignAccumulatedCommission: {
            (params: ICampaignAccumulatedCommissionParams, options?: TransactionOptions): Promise<BigNumber>;
        };
        claim: {
            (token: string, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (token: string, options?: TransactionOptions) => Promise<void>;
            txData: (token: string, options?: TransactionOptions) => Promise<string>;
        };
        claimMultiple: {
            (tokens: string[], options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (tokens: string[], options?: TransactionOptions) => Promise<void>;
            txData: (tokens: string[], options?: TransactionOptions) => Promise<string>;
        };
        claimMultipleProtocolFee: {
            (tokens: string[], options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (tokens: string[], options?: TransactionOptions) => Promise<void>;
            txData: (tokens: string[], options?: TransactionOptions) => Promise<string>;
        };
        claimProtocolFee: {
            (token: string, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (token: string, options?: TransactionOptions) => Promise<void>;
            txData: (token: string, options?: TransactionOptions) => Promise<string>;
        };
        claimantIdCount: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
        claimantIds: {
            (params: IClaimantIdsParams, options?: TransactionOptions): Promise<BigNumber>;
        };
        claimantsInfo: {
            (param1: number | BigNumber, options?: TransactionOptions): Promise<{
                claimant: string;
                token: string;
                balance: BigNumber;
            }>;
        };
        deny: {
            (user: string, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (user: string, options?: TransactionOptions) => Promise<void>;
            txData: (user: string, options?: TransactionOptions) => Promise<string>;
        };
        getCampaign: {
            (params: IGetCampaignParams, options?: TransactionOptions): Promise<{
                projectId: BigNumber;
                maxInputTokensInEachCall: BigNumber;
                maxOutputTokensInEachCall: BigNumber;
                referrersRequireApproval: boolean;
                startDate: BigNumber;
                endDate: BigNumber;
                targetAndSelectors: string[];
                acceptAnyInToken: boolean;
                acceptAnyOutToken: boolean;
                inTokens: string[];
                directTransferInToken: boolean[];
                commissionInTokenConfig: {
                    rate: BigNumber;
                    feeOnProjectOwner: boolean;
                    capPerTransaction: BigNumber;
                    capPerCampaign: BigNumber;
                }[];
                outTokens: string[];
                commissionOutTokenConfig: {
                    rate: BigNumber;
                    feeOnProjectOwner: boolean;
                    capPerTransaction: BigNumber;
                    capPerCampaign: BigNumber;
                }[];
                referrers: string[];
            }>;
        };
        getCampaignArrayData1: {
            (params: IGetCampaignArrayData1Params, options?: TransactionOptions): Promise<{
                targetAndSelectors: string[];
                referrers: string[];
            }>;
        };
        getCampaignArrayData2: {
            (params: IGetCampaignArrayData2Params, options?: TransactionOptions): Promise<{
                inTokens: string[];
                directTransferInToken: boolean[];
                commissionInTokenConfig: {
                    rate: BigNumber;
                    feeOnProjectOwner: boolean;
                    capPerTransaction: BigNumber;
                    capPerCampaign: BigNumber;
                }[];
                outTokens: string[];
                commissionOutTokenConfig: {
                    rate: BigNumber;
                    feeOnProjectOwner: boolean;
                    capPerTransaction: BigNumber;
                    capPerCampaign: BigNumber;
                }[];
            }>;
        };
        getCampaignArrayLength: {
            (campaignId: number | BigNumber, options?: TransactionOptions): Promise<{
                targetAndSelectorsLength: BigNumber;
                inTokensLength: BigNumber;
                outTokensLength: BigNumber;
                referrersLength: BigNumber;
            }>;
        };
        getCampaignsLength: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
        getClaimantBalance: {
            (params: IGetClaimantBalanceParams, options?: TransactionOptions): Promise<BigNumber>;
        };
        getClaimantsInfo: {
            (params: IGetClaimantsInfoParams, options?: TransactionOptions): Promise<{
                claimant: string;
                token: string;
                balance: BigNumber;
            }[]>;
        };
        getProject: {
            (projectId: number | BigNumber, options?: TransactionOptions): Promise<{
                owner: string;
                newOwner: string;
                projectAdmins: string[];
            }>;
        };
        getProjectAdminsLength: {
            (projectId: number | BigNumber, options?: TransactionOptions): Promise<BigNumber>;
        };
        getProjectsLength: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
        isPermitted: {
            (param1: string, options?: TransactionOptions): Promise<boolean>;
        };
        lastBalance: {
            (param1: string, options?: TransactionOptions): Promise<BigNumber>;
        };
        newCampaign: {
            (params: {
                projectId: number | BigNumber;
                maxInputTokensInEachCall: number | BigNumber;
                maxOutputTokensInEachCall: number | BigNumber;
                referrersRequireApproval: boolean;
                startDate: number | BigNumber;
                endDate: number | BigNumber;
                targetAndSelectors: string[];
                acceptAnyInToken: boolean;
                acceptAnyOutToken: boolean;
                inTokens: string[];
                directTransferInToken: boolean[];
                commissionInTokenConfig: {
                    rate: number | BigNumber;
                    feeOnProjectOwner: boolean;
                    capPerTransaction: number | BigNumber;
                    capPerCampaign: number | BigNumber;
                }[];
                outTokens: string[];
                commissionOutTokenConfig: {
                    rate: number | BigNumber;
                    feeOnProjectOwner: boolean;
                    capPerTransaction: number | BigNumber;
                    capPerCampaign: number | BigNumber;
                }[];
                referrers: string[];
            }, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: {
                projectId: number | BigNumber;
                maxInputTokensInEachCall: number | BigNumber;
                maxOutputTokensInEachCall: number | BigNumber;
                referrersRequireApproval: boolean;
                startDate: number | BigNumber;
                endDate: number | BigNumber;
                targetAndSelectors: string[];
                acceptAnyInToken: boolean;
                acceptAnyOutToken: boolean;
                inTokens: string[];
                directTransferInToken: boolean[];
                commissionInTokenConfig: {
                    rate: number | BigNumber;
                    feeOnProjectOwner: boolean;
                    capPerTransaction: number | BigNumber;
                    capPerCampaign: number | BigNumber;
                }[];
                outTokens: string[];
                commissionOutTokenConfig: {
                    rate: number | BigNumber;
                    feeOnProjectOwner: boolean;
                    capPerTransaction: number | BigNumber;
                    capPerCampaign: number | BigNumber;
                }[];
                referrers: string[];
            }, options?: TransactionOptions) => Promise<BigNumber>;
            txData: (params: {
                projectId: number | BigNumber;
                maxInputTokensInEachCall: number | BigNumber;
                maxOutputTokensInEachCall: number | BigNumber;
                referrersRequireApproval: boolean;
                startDate: number | BigNumber;
                endDate: number | BigNumber;
                targetAndSelectors: string[];
                acceptAnyInToken: boolean;
                acceptAnyOutToken: boolean;
                inTokens: string[];
                directTransferInToken: boolean[];
                commissionInTokenConfig: {
                    rate: number | BigNumber;
                    feeOnProjectOwner: boolean;
                    capPerTransaction: number | BigNumber;
                    capPerCampaign: number | BigNumber;
                }[];
                outTokens: string[];
                commissionOutTokenConfig: {
                    rate: number | BigNumber;
                    feeOnProjectOwner: boolean;
                    capPerTransaction: number | BigNumber;
                    capPerCampaign: number | BigNumber;
                }[];
                referrers: string[];
            }, options?: TransactionOptions) => Promise<string>;
        };
        newOwner: {
            (options?: TransactionOptions): Promise<string>;
        };
        newProject: {
            (admins: string[], options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (admins: string[], options?: TransactionOptions) => Promise<BigNumber>;
            txData: (admins: string[], options?: TransactionOptions) => Promise<string>;
        };
        owner: {
            (options?: TransactionOptions): Promise<string>;
        };
        permit: {
            (user: string, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (user: string, options?: TransactionOptions) => Promise<void>;
            txData: (user: string, options?: TransactionOptions) => Promise<string>;
        };
        protocolFeeBalance: {
            (param1: string, options?: TransactionOptions): Promise<BigNumber>;
        };
        protocolRate: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
        proxyCall: {
            (params: IProxyCallParams, options?: number | BigNumber | TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IProxyCallParams, options?: number | BigNumber | TransactionOptions) => Promise<void>;
            txData: (params: IProxyCallParams, options?: number | BigNumber | TransactionOptions) => Promise<string>;
        };
        removeProjectAdmin: {
            (params: IRemoveProjectAdminParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IRemoveProjectAdminParams, options?: TransactionOptions) => Promise<void>;
            txData: (params: IRemoveProjectAdminParams, options?: TransactionOptions) => Promise<string>;
        };
        setProtocolRate: {
            (newRate: number | BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (newRate: number | BigNumber, options?: TransactionOptions) => Promise<void>;
            txData: (newRate: number | BigNumber, options?: TransactionOptions) => Promise<string>;
        };
        skim: {
            (tokens: string[], options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (tokens: string[], options?: TransactionOptions) => Promise<void>;
            txData: (tokens: string[], options?: TransactionOptions) => Promise<string>;
        };
        stake: {
            (params: IStakeParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IStakeParams, options?: TransactionOptions) => Promise<void>;
            txData: (params: IStakeParams, options?: TransactionOptions) => Promise<string>;
        };
        stakeETH: {
            (projectId: number | BigNumber, options?: number | BigNumber | TransactionOptions): Promise<TransactionReceipt>;
            call: (projectId: number | BigNumber, options?: number | BigNumber | TransactionOptions) => Promise<void>;
            txData: (projectId: number | BigNumber, options?: number | BigNumber | TransactionOptions) => Promise<string>;
        };
        stakeMultiple: {
            (params: IStakeMultipleParams, options?: number | BigNumber | TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IStakeMultipleParams, options?: number | BigNumber | TransactionOptions) => Promise<void>;
            txData: (params: IStakeMultipleParams, options?: number | BigNumber | TransactionOptions) => Promise<string>;
        };
        stakesBalance: {
            (params: IStakesBalanceParams, options?: TransactionOptions): Promise<BigNumber>;
        };
        takeOwnership: {
            (options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (options?: TransactionOptions) => Promise<void>;
            txData: (options?: TransactionOptions) => Promise<string>;
        };
        takeoverProjectOwnership: {
            (projectId: number | BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (projectId: number | BigNumber, options?: TransactionOptions) => Promise<void>;
            txData: (projectId: number | BigNumber, options?: TransactionOptions) => Promise<string>;
        };
        transferOwnership: {
            (newOwner: string, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (newOwner: string, options?: TransactionOptions) => Promise<void>;
            txData: (newOwner: string, options?: TransactionOptions) => Promise<string>;
        };
        transferProjectOwnership: {
            (params: ITransferProjectOwnershipParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: ITransferProjectOwnershipParams, options?: TransactionOptions) => Promise<void>;
            txData: (params: ITransferProjectOwnershipParams, options?: TransactionOptions) => Promise<string>;
        };
        unstake: {
            (params: IUnstakeParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IUnstakeParams, options?: TransactionOptions) => Promise<void>;
            txData: (params: IUnstakeParams, options?: TransactionOptions) => Promise<string>;
        };
        unstakeETH: {
            (projectId: number | BigNumber, options?: number | BigNumber | TransactionOptions): Promise<TransactionReceipt>;
            call: (projectId: number | BigNumber, options?: number | BigNumber | TransactionOptions) => Promise<void>;
            txData: (projectId: number | BigNumber, options?: number | BigNumber | TransactionOptions) => Promise<string>;
        };
        unstakeMultiple: {
            (params: IUnstakeMultipleParams, options?: number | BigNumber | TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IUnstakeMultipleParams, options?: number | BigNumber | TransactionOptions) => Promise<void>;
            txData: (params: IUnstakeMultipleParams, options?: number | BigNumber | TransactionOptions) => Promise<string>;
        };
        private assign;
    }
    export module ProxyV3 {
        interface AddCommissionEvent {
            to: string;
            token: string;
            commission: BigNumber;
            commissionBalance: BigNumber;
            protocolFee: BigNumber;
            protocolFeeBalance: BigNumber;
            _event: Event;
        }
        interface AddProjectAdminEvent {
            projectId: BigNumber;
            admin: string;
            _event: Event;
        }
        interface AuthorizeEvent {
            user: string;
            _event: Event;
        }
        interface ClaimEvent {
            from: string;
            token: string;
            amount: BigNumber;
            _event: Event;
        }
        interface ClaimProtocolFeeEvent {
            token: string;
            amount: BigNumber;
            _event: Event;
        }
        interface DeauthorizeEvent {
            user: string;
            _event: Event;
        }
        interface NewCampaignEvent {
            campaignId: BigNumber;
            _event: Event;
        }
        interface NewProjectEvent {
            projectId: BigNumber;
            _event: Event;
        }
        interface RemoveProjectAdminEvent {
            projectId: BigNumber;
            admin: string;
            _event: Event;
        }
        interface SetProtocolRateEvent {
            protocolRate: BigNumber;
            _event: Event;
        }
        interface SkimEvent {
            token: string;
            to: string;
            amount: BigNumber;
            _event: Event;
        }
        interface StakeEvent {
            projectId: BigNumber;
            token: string;
            amount: BigNumber;
            balance: BigNumber;
            _event: Event;
        }
        interface StartOwnershipTransferEvent {
            user: string;
            _event: Event;
        }
        interface TakeoverProjectOwnershipEvent {
            projectId: BigNumber;
            newOwner: string;
            _event: Event;
        }
        interface TransferBackEvent {
            target: string;
            token: string;
            sender: string;
            amount: BigNumber;
            _event: Event;
        }
        interface TransferForwardEvent {
            target: string;
            token: string;
            sender: string;
            amount: BigNumber;
            _event: Event;
        }
        interface TransferOwnershipEvent {
            user: string;
            _event: Event;
        }
        interface TransferProjectOwnershipEvent {
            projectId: BigNumber;
            newOwner: string;
            _event: Event;
        }
        interface UnstakeEvent {
            projectId: BigNumber;
            token: string;
            amount: BigNumber;
            balance: BigNumber;
            _event: Event;
        }
    }
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/index.ts" />
declare module "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/index.ts" {
    export { Authorization } from "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/Authorization.ts";
    export { Proxy } from "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/Proxy.ts";
    export { ProxyV2 } from "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/ProxyV2.ts";
    export { ProxyV3 } from "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/ProxyV3.ts";
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-commission-proxy-contract/utils.ts" />
declare module "@scom/scom-disperse/contracts/scom-commission-proxy-contract/utils.ts" {
    import { IRpcWallet } from "@ijstech/eth-wallet";
    const getProxyCampaign: (wallet: IRpcWallet, proxyAddress: string, campaignId: number) => Promise<{
        projectId: import("@ijstech/eth-wallet").BigNumber;
        maxInputTokensInEachCall: import("@ijstech/eth-wallet").BigNumber;
        maxOutputTokensInEachCall: import("@ijstech/eth-wallet").BigNumber;
        referrersRequireApproval: boolean;
        startDate: import("@ijstech/eth-wallet").BigNumber;
        endDate: import("@ijstech/eth-wallet").BigNumber;
        targetAndSelectors: string[];
        acceptAnyInToken: boolean;
        acceptAnyOutToken: boolean;
        inTokens: string[];
        directTransferInToken: boolean[];
        commissionInTokenConfig: {
            rate: import("@ijstech/eth-wallet").BigNumber;
            feeOnProjectOwner: boolean;
            capPerTransaction: import("@ijstech/eth-wallet").BigNumber;
            capPerCampaign: import("@ijstech/eth-wallet").BigNumber;
        }[];
        outTokens: string[];
        commissionOutTokenConfig: {
            rate: import("@ijstech/eth-wallet").BigNumber;
            feeOnProjectOwner: boolean;
            capPerTransaction: import("@ijstech/eth-wallet").BigNumber;
            capPerCampaign: import("@ijstech/eth-wallet").BigNumber;
        }[];
        referrers: string[];
    }>;
    const getCommissionRate: (wallet: IRpcWallet, proxyAddress: string, campaignId: number) => Promise<string>;
    export { getProxyCampaign, getCommissionRate };
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-commission-proxy-contract/index.ts" />
declare module "@scom/scom-disperse/contracts/scom-commission-proxy-contract/index.ts" {
    import * as Contracts from "@scom/scom-disperse/contracts/scom-commission-proxy-contract/contracts/index.ts";
    export { Contracts };
    import { IWallet } from '@ijstech/eth-wallet';
    import * as ContractUtils from "@scom/scom-disperse/contracts/scom-commission-proxy-contract/utils.ts";
    export { ContractUtils };
    export interface IDeployOptions {
        version?: string;
        protocolRate?: string;
    }
    export interface IDeployResult {
        proxy: string;
    }
    export var DefaultDeployOptions: IDeployOptions;
    export function deploy(wallet: IWallet, options?: IDeployOptions): Promise<IDeployResult>;
    export function onProgress(handler: any): void;
    const _default_4: {
        Contracts: typeof Contracts;
        deploy: typeof deploy;
        DefaultDeployOptions: IDeployOptions;
        onProgress: typeof onProgress;
    };
    export default _default_4;
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-disperse-contract/contracts/Disperse.json.ts" />
declare module "@scom/scom-disperse/contracts/scom-disperse-contract/contracts/Disperse.json.ts" {
    const _default_5: {
        abi: {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: any[];
            stateMutability: string;
            type: string;
        }[];
        bytecode: string;
    };
    export default _default_5;
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-disperse-contract/contracts/Disperse.ts" />
declare module "@scom/scom-disperse/contracts/scom-disperse-contract/contracts/Disperse.ts" {
    import { IWallet, Contract as _Contract, TransactionReceipt, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IDisperseEtherParams {
        recipients: string[];
        values: (number | BigNumber)[];
    }
    export interface IDisperseTokenParams {
        token: string;
        recipients: string[];
        values: (number | BigNumber)[];
    }
    export interface IDisperseTokenSimpleParams {
        token: string;
        recipients: string[];
        values: (number | BigNumber)[];
    }
    export class Disperse extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(options?: TransactionOptions): Promise<string>;
        disperseEther: {
            (params: IDisperseEtherParams, options?: number | BigNumber | TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IDisperseEtherParams, options?: number | BigNumber | TransactionOptions) => Promise<void>;
            txData: (params: IDisperseEtherParams, options?: number | BigNumber | TransactionOptions) => Promise<string>;
        };
        disperseToken: {
            (params: IDisperseTokenParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IDisperseTokenParams, options?: TransactionOptions) => Promise<void>;
            txData: (params: IDisperseTokenParams, options?: TransactionOptions) => Promise<string>;
        };
        disperseTokenSimple: {
            (params: IDisperseTokenSimpleParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IDisperseTokenSimpleParams, options?: TransactionOptions) => Promise<void>;
            txData: (params: IDisperseTokenSimpleParams, options?: TransactionOptions) => Promise<string>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-disperse-contract/contracts/index.ts" />
declare module "@scom/scom-disperse/contracts/scom-disperse-contract/contracts/index.ts" {
    export { Disperse } from "@scom/scom-disperse/contracts/scom-disperse-contract/contracts/Disperse.ts";
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-disperse-contract/utils.ts" />
declare module "@scom/scom-disperse/contracts/scom-disperse-contract/utils.ts" {
    import { BigNumber, IWallet } from "@ijstech/eth-contract";
    export interface DisperseData {
        address: string;
        amount: BigNumber;
    }
    export function doDisperse(wallet: IWallet, contractAddress: string, tokenAddress: string | null, tokenDecimals: number | null, data: DisperseData[]): Promise<import("@ijstech/eth-contract").TransactionReceipt>;
}
/// <amd-module name="@scom/scom-disperse/contracts/scom-disperse-contract/index.ts" />
declare module "@scom/scom-disperse/contracts/scom-disperse-contract/index.ts" {
    import { IWallet } from '@ijstech/eth-wallet';
    import * as Contracts from "@scom/scom-disperse/contracts/scom-disperse-contract/contracts/index.ts";
    export * as DisperseActions from "@scom/scom-disperse/contracts/scom-disperse-contract/utils.ts";
    export { DisperseData } from "@scom/scom-disperse/contracts/scom-disperse-contract/utils.ts";
    export { Contracts };
    export interface IDeployResult {
        disperse: string;
    }
    export function deploy(wallet: IWallet): Promise<IDeployResult>;
    export function onProgress(handler: any): void;
    const _default_6: {
        Contracts: typeof Contracts;
        deploy: typeof deploy;
        onProgress: typeof onProgress;
    };
    export default _default_6;
}
/// <amd-module name="@scom/scom-disperse/disperse-utils/index.ts" />
declare module "@scom/scom-disperse/disperse-utils/index.ts" {
    import { State } from "@scom/scom-disperse/store/index.ts";
    import { DisperseData, ICommissionInfo } from "@scom/scom-disperse/global/index.ts";
    import { ITokenObject } from "@scom/scom-token-list";
    interface IDisperseData {
        token: ITokenObject;
        data: DisperseData[];
        commissions?: ICommissionInfo[];
    }
    const onDisperse: (state: State, disperseData: IDisperseData) => Promise<{
        receipt: any;
        error: any;
    } | {
        receipt: any;
        error?: undefined;
    }>;
    export { onDisperse };
}
/// <amd-module name="@scom/scom-disperse/assets.ts" />
declare module "@scom/scom-disperse/assets.ts" {
    function fullPath(path: string): string;
    const _default_7: {
        fullPath: typeof fullPath;
    };
    export default _default_7;
}
/// <amd-module name="@scom/scom-disperse/index.css.ts" />
declare module "@scom/scom-disperse/index.css.ts" {
    export const disperseLayout: string;
    export const disperseStyle: string;
    export const tokenModalStyle: string;
}
/// <amd-module name="@scom/scom-disperse/data.json.ts" />
declare module "@scom/scom-disperse/data.json.ts" {
    const _default_8: {
        infuraId: string;
        networks: {
            chainId: number;
            explorerName: string;
            explorerTxUrl: string;
            explorerAddressUrl: string;
        }[];
        proxyAddresses: {
            "97": string;
            "43113": string;
        };
        embedderCommissionFee: string;
        defaultBuilderData: {
            defaultChainId: number;
            networks: {
                chainId: number;
            }[];
            wallets: {
                name: string;
            }[];
        };
    };
    export default _default_8;
}
/// <amd-module name="@scom/scom-disperse/formSchema.json.ts" />
declare module "@scom/scom-disperse/formSchema.json.ts" {
    const _default_9: {
        general: {
            dataSchema: {
                type: string;
                properties: {};
            };
        };
        theme: {
            dataSchema: {
                type: string;
                properties: {
                    dark: {
                        type: string;
                        properties: {
                            backgroundColor: {
                                type: string;
                                format: string;
                            };
                            fontColor: {
                                type: string;
                                format: string;
                            };
                            secondaryColor: {
                                type: string;
                                title: string;
                                format: string;
                            };
                            secondaryFontColor: {
                                type: string;
                                title: string;
                                format: string;
                            };
                            inputBackgroundColor: {
                                type: string;
                                format: string;
                            };
                            inputFontColor: {
                                type: string;
                                format: string;
                            };
                        };
                    };
                    light: {
                        type: string;
                        properties: {
                            backgroundColor: {
                                type: string;
                                format: string;
                            };
                            fontColor: {
                                type: string;
                                format: string;
                            };
                            secondaryColor: {
                                type: string;
                                title: string;
                                format: string;
                            };
                            secondaryFontColor: {
                                type: string;
                                title: string;
                                format: string;
                            };
                            inputBackgroundColor: {
                                type: string;
                                format: string;
                            };
                            inputFontColor: {
                                type: string;
                                format: string;
                            };
                        };
                    };
                };
            };
        };
    };
    export default _default_9;
}
/// <amd-module name="@scom/scom-disperse" />
declare module "@scom/scom-disperse" {
    import { Container, Module, ControlElement } from '@ijstech/components';
    import { DisperseData, IDisperseConfigUI, ICommissionInfo } from "@scom/scom-disperse/global/index.ts";
    import { BigNumber } from '@ijstech/eth-wallet';
    import { IWalletPlugin } from '@scom/scom-wallet-modal';
    import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
    import { INetworkConfig } from '@scom/scom-network-picker';
    interface ScomDisperseElement extends ControlElement {
        defaultChainId: number;
        networks: INetworkConfig[];
        wallets: IWalletPlugin[];
        showHeader?: boolean;
        lazyLoad?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-disperse']: ScomDisperseElement;
            }
        }
    }
    export default class ScomDisperse extends Module {
        private state;
        private containerElm;
        private resultElm;
        private firstStepElm;
        private secondStepElm;
        private thirdStepElm;
        private btnDownload;
        private btnImport;
        private importFileElm;
        private inputBatch;
        private tokenElm;
        private tokenInfoElm;
        private mdToken;
        private token;
        private addressesElm;
        private totalElm;
        private balanceElm;
        private remainingElm;
        private btnApprove;
        private btnDisperse;
        private txStatusModal;
        private resultAddresses;
        private invalidElm;
        private messageModal;
        private messageElm;
        private mdWallet;
        private dappContainer;
        private iconTotal;
        private hStackGroupButton;
        private btnWallet;
        private contractAddress;
        private _data;
        tag: any;
        defaultEdit: boolean;
        private rpcWalletEvents;
        private approvalModelAction;
        private getData;
        private resetRpcWallet;
        private setData;
        private updateTag;
        private setTag;
        private getTag;
        private updateStyle;
        private updateTheme;
        private getActions;
        getConfigurators(): ({
            name: string;
            target: string;
            getActions: (category?: string) => any;
            getData: any;
            setData: (data: IDisperseConfigUI) => Promise<void>;
            getTag: any;
            setTag: any;
            elementName?: undefined;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
            bindOnChanged?: undefined;
        } | {
            name: string;
            target: string;
            elementName: string;
            getLinkParams: () => {
                data: any;
            };
            setLinkParams: (params: any) => Promise<void>;
            bindOnChanged: (element: ScomCommissionFeeSetup, callback: (data: any) => Promise<void>) => void;
            getData: () => {
                fee: string;
                commissions?: ICommissionInfo[];
                defaultChainId: number;
                wallets: IWalletPlugin[];
                networks: INetworkConfig[];
                showHeader?: boolean;
            };
            setData: any;
            getTag: any;
            setTag: any;
            getActions?: undefined;
        })[];
        private DummyDisperseData;
        private refreshUI;
        constructor(parent?: Container, options?: any);
        removeRpcWalletEvents(): void;
        onHide(): void;
        private onWalletConnect;
        private onChainChanged;
        private updateTokenModal;
        private updateButtons;
        private get chainId();
        private get rpcWallet();
        get listAddresses(): DisperseData[];
        get hasAddress(): boolean;
        get balance(): string;
        get total(): BigNumber;
        get remaining(): BigNumber;
        get defaultChainId(): number;
        set defaultChainId(value: number);
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get showHeader(): boolean;
        set showHeader(value: boolean);
        get commissions(): ICommissionInfo[];
        set commissions(value: ICommissionInfo[]);
        private checkStepStatus;
        private setThirdStatus;
        private setFourthStatus;
        private onSelectToken;
        private onDisperseAgain;
        private onDownloadReport;
        private onDownloadFile;
        private onImportFile;
        private onInputBatch;
        private convertCSVToText;
        private showImportCSVError;
        private initInputFile;
        private resetData;
        private showMessage;
        private setEnabledStatus;
        private updateCommissionsTooltip;
        private updateContractAddress;
        private initApprovalModelAction;
        private checkAllowance;
        private handleApprove;
        private handleDisperse;
        private initWallet;
        private connectWallet;
        private loadLib;
        private renderResult;
        onLoad: () => void;
        init(): Promise<void>;
        render(): any;
    }
}
