import { } from '@ijstech/eth-contract';
import { EthereumProvider } from '@ijstech/eth-wallet';
import { application } from '@ijstech/components';
let moduleDir = application.currentModuleDir;

function fullPath(path: string): string {
    if (path.indexOf('://') > 0)
        return path
    return `${moduleDir}/${path}`
}

export class BitKeepWalletProvider extends EthereumProvider {
    get displayName() {
        return 'BitKeep Wallet';
    }

    get image(): string {
        return fullPath('img/BitKeep.png');
    }

    get provider(): any {
        return window['bitkeep']['ethereum'];
    }

    get homepage(): string {
        return 'https://bitkeep.com/download?type=2';
    }

    installed(): boolean {
        return !!window['isBitKeep'];
    }
}