import { IWallet, Contract, TransactionReceipt, BigNumber } from "@ijstech/eth-wallet";
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
export declare class Disperse extends Contract {
    constructor(wallet: IWallet, address?: string);
    deploy(): Promise<string>;
    disperseEther: {
        (params: IDisperseEtherParams, _value: number | BigNumber): Promise<TransactionReceipt>;
        call: (params: IDisperseEtherParams, _value: number | BigNumber) => Promise<void>;
    };
    disperseToken: {
        (params: IDisperseTokenParams): Promise<TransactionReceipt>;
        call: (params: IDisperseTokenParams) => Promise<void>;
    };
    disperseTokenSimple: {
        (params: IDisperseTokenSimpleParams): Promise<TransactionReceipt>;
        call: (params: IDisperseTokenSimpleParams) => Promise<void>;
    };
    private assign;
}
