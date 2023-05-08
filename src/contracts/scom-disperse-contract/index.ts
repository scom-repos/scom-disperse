import {IWallet, BigNumber} from '@ijstech/eth-wallet';
import * as Contracts from './contracts/index';

export * as DisperseActions from './utils';
export { DisperseData } from './utils'
export {Contracts};

export interface IDeployResult {
    disperse: string;
};
var progressHandler: any;

function progress(msg: string){
    if (typeof(progressHandler) == 'function'){
        progressHandler(msg);
    };
}

export async function deploy(wallet: IWallet): Promise<IDeployResult>{
    let disperse = new Contracts.Disperse(wallet);
    progress('Deploy Disperse');
    let disperseAddress = await disperse.deploy();
    progress('Disperse deployed ' + disperseAddress);

    return {
        disperse: disperseAddress
    };
};
export function onProgress(handler: any){
    progressHandler = handler;
};
export default {
    Contracts,
    deploy,
    onProgress
};

