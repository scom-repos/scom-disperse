import { } from '@ijstech/eth-contract';
import { EthereumProvider } from '@ijstech/eth-wallet';
import { application } from '@ijstech/components';
let moduleDir = application.currentModuleDir;

function fullPath(path: string): string {
    if (path.indexOf('://') > 0)
        return path
    return `${moduleDir}/${path}`
}

export class ONTOWalletProvider extends EthereumProvider {
    get displayName() {
        return 'ONTO Wallet';
    }

    get image(): string {
        return fullPath('img/ONTOWallet.jpg');
    }

    get provider(): any {
        return window['onto'];
    }

    get homepage(): string {
        return 'https://onto.app/en/download/?mode=app';
    }

    installed(): boolean {
        return !!window['onto'];
    }
}