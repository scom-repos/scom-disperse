import { } from '@ijstech/eth-contract';
import { EthereumProvider } from '@ijstech/eth-wallet';
import { application } from '@ijstech/components';
let moduleDir = application.currentModuleDir;

function fullPath(path: string): string {
    if (path.indexOf('://') > 0)
        return path
    return `${moduleDir}/${path}`
}

export class TrustWalletProvider extends EthereumProvider {
    get displayName() {
        return 'Trust Wallet';
    }

    get image(): string {
        return fullPath('img/trustwallet.svg');
    }

    get provider(): any {
        return window['ethereum'];
    }

    get homepage(): string {
        return 'https://link.trustwallet.com/open_url?url=' + window.location.href;
    }

    installed(): boolean {
        let ethereum = window['ethereum'];
        return !!ethereum && !!ethereum.isTrust;
    }
}