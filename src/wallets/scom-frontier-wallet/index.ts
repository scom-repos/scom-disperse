import { } from '@ijstech/eth-contract';
import { EthereumProvider } from '@ijstech/eth-wallet';
import { application } from '@ijstech/components';
let moduleDir = application.currentModuleDir;

function fullPath(path: string): string {
    if (path.indexOf('://') > 0)
        return path
    return `${moduleDir}/${path}`
}

export class FrontierWalletProvider extends EthereumProvider {
    get displayName() {
        return 'Frontier Wallet';
    }

    get image(): string {
        return fullPath('img/frontier-wallet.svg');
    }

    get provider(): any {
        return window['frontier']['ethereum'];
    }

    get homepage(): string {
        return 'https://www.frontier.xyz/browser-extension';
    }

    installed(): boolean {
        return !!window['frontier'];
    }
}