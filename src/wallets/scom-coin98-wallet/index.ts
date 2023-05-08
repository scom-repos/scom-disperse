import {} from '@ijstech/eth-contract';
import { EthereumProvider } from '@ijstech/eth-wallet';
import {application} from '@ijstech/components';
let moduleDir = application.currentModuleDir;

function fullPath(path: string): string{
    if (path.indexOf('://') > 0)
        return path
    return `${moduleDir}/${path}`
}

export default class Coin98Provider extends EthereumProvider {
    get displayName() {
        return 'Coin98 Wallet';
    }

    get image(): string {
        return fullPath('img/Coin98.svg');
    }

    get provider(): any {
        return window['ethereum'];
    }

    get homepage(): string {
        return 'https://docs.coin98.com/products/coin98-wallet';
    }

    installed(): boolean {
        let ethereum = window['ethereum'];
        return !!ethereum && (!!ethereum.isCoin98 || !!window['isCoin98']);
    }
}