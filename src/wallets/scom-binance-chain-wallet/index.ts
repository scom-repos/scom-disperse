import { } from '@ijstech/eth-contract';
import { EthereumProvider } from '@ijstech/eth-wallet';
import { application } from '@ijstech/components';
let moduleDir = application.currentModuleDir;

function fullPath(path: string): string {
    if (path.indexOf('://') > 0)
        return path
    return `${moduleDir}/${path}`
}

export default class BinanceChainWalletProvider extends EthereumProvider {
    get displayName() {
        return 'Binance Chain Wallet';
    }

    get image(): string {
        return fullPath('img/binance-chain-wallet.svg');
    }

    get provider(): any {
        return window['BinanceChain'];
    }

    get homepage(): string {
        return 'https://www.binance.org/en';
    }

    installed(): boolean {
        return !!window['BinanceChain'];
    }
}