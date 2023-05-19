import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./Disperse.json";
export interface IDisperseEtherParams {recipients:string[];values:(number|BigNumber)[]}
export interface IDisperseTokenParams {token:string;recipients:string[];values:(number|BigNumber)[]}
export interface IDisperseTokenSimpleParams {token:string;recipients:string[];values:(number|BigNumber)[]}
export class Disperse extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(options?: TransactionOptions): Promise<string>{
        return this.__deploy([], options);
    }
    disperseEther: {
        (params: IDisperseEtherParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IDisperseEtherParams, options?: number|BigNumber|TransactionOptions) => Promise<void>;
        txData: (params: IDisperseEtherParams, options?: number|BigNumber|TransactionOptions) => Promise<string>;
    }
    disperseToken: {
        (params: IDisperseTokenParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IDisperseTokenParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IDisperseTokenParams, options?: TransactionOptions) => Promise<string>;
    }
    disperseTokenSimple: {
        (params: IDisperseTokenSimpleParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IDisperseTokenSimpleParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IDisperseTokenSimpleParams, options?: TransactionOptions) => Promise<string>;
    }
    private assign(){
        let disperseEtherParams = (params: IDisperseEtherParams) => [params.recipients,this.wallet.utils.toString(params.values)];
        let disperseEther_send = async (params: IDisperseEtherParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('disperseEther',disperseEtherParams(params),options);
            return result;
        }
        let disperseEther_call = async (params: IDisperseEtherParams, options?: number|BigNumber|TransactionOptions): Promise<void> => {
            let result = await this.call('disperseEther',disperseEtherParams(params),options);
            return;
        }
        let disperseEther_txData = async (params: IDisperseEtherParams, options?: number|BigNumber|TransactionOptions): Promise<string> => {
            let result = await this.txData('disperseEther',disperseEtherParams(params),options);
            return result;
        }
        this.disperseEther = Object.assign(disperseEther_send, {
            call:disperseEther_call
            , txData:disperseEther_txData
        });
        let disperseTokenParams = (params: IDisperseTokenParams) => [params.token,params.recipients,this.wallet.utils.toString(params.values)];
        let disperseToken_send = async (params: IDisperseTokenParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('disperseToken',disperseTokenParams(params),options);
            return result;
        }
        let disperseToken_call = async (params: IDisperseTokenParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('disperseToken',disperseTokenParams(params),options);
            return;
        }
        let disperseToken_txData = async (params: IDisperseTokenParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('disperseToken',disperseTokenParams(params),options);
            return result;
        }
        this.disperseToken = Object.assign(disperseToken_send, {
            call:disperseToken_call
            , txData:disperseToken_txData
        });
        let disperseTokenSimpleParams = (params: IDisperseTokenSimpleParams) => [params.token,params.recipients,this.wallet.utils.toString(params.values)];
        let disperseTokenSimple_send = async (params: IDisperseTokenSimpleParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('disperseTokenSimple',disperseTokenSimpleParams(params),options);
            return result;
        }
        let disperseTokenSimple_call = async (params: IDisperseTokenSimpleParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('disperseTokenSimple',disperseTokenSimpleParams(params),options);
            return;
        }
        let disperseTokenSimple_txData = async (params: IDisperseTokenSimpleParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('disperseTokenSimple',disperseTokenSimpleParams(params),options);
            return result;
        }
        this.disperseTokenSimple = Object.assign(disperseTokenSimple_send, {
            call:disperseTokenSimple_call
            , txData:disperseTokenSimple_txData
        });
    }
}