/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-commission-proxy-contract/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dapp-container/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-token-modal/@ijstech/eth-wallet/index.d.ts" />
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
/// <amd-module name="@scom/scom-disperse/index.css.ts" />
declare module "@scom/scom-disperse/index.css.ts" {
    export const disperseLayout: string;
    export const disperseStyle: string;
    export const tokenModalStyle: string;
}
/// <amd-module name="@scom/scom-disperse/data.json.ts" />
declare module "@scom/scom-disperse/data.json.ts" {
    const _default: {
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
    export default _default;
}
/// <amd-module name="@scom/scom-disperse/formSchema.json.ts" />
declare module "@scom/scom-disperse/formSchema.json.ts" {
    const _default_1: {
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
    export default _default_1;
}
/// <amd-module name="@scom/scom-disperse/assets.ts" />
declare module "@scom/scom-disperse/assets.ts" {
    function fullPath(path: string): string;
    const _default_2: {
        fullPath: typeof fullPath;
    };
    export default _default_2;
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
