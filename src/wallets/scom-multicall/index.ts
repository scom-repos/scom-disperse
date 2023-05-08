import * as Contracts from './contracts/index';
export {Contracts};
import {IWallet, BigNumber} from '@ijstech/eth-wallet';

export interface IDeployOptions {
};
export interface IDeployResult {
    multicall: string;
};
var progressHandler: any;
export var DefaultDeployOptions: IDeployOptions = {
};
export async function deploy(wallet: IWallet, options: IDeployOptions, onProgress:(msg:string)=>void): Promise<IDeployResult>{
    let multicall = new Contracts.MultiCall(wallet);
    onProgress('Deploy MultiCall');
    let address = await multicall.deploy();
    onProgress('MultiCall deployed ' + address)
    return {
        multicall: address
    };
};
export default {
    Contracts,
    deploy,
    DefaultDeployOptions
};

export {
    IMulticallInfo,
    getMulticallInfoList,
    getMulticallInfo
} from './utils';