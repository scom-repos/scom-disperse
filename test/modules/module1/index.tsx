import { Module, customModule, Container } from '@ijstech/components';
import ScomDisperse from '@scom/scom-disperse';

@customModule
export default class Module1 extends Module {
    private disperseElm: ScomDisperse;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
    }

    render() {
        return <i-panel>
            <i-scom-disperse
                defaultChainId={43113}
                networks={[
                    {
                        "chainId": 43113
                    },
                    {
                        "chainId": 97
                    }
                ]}
                wallets={[
                    {
                        "name": "metamask"
                    }
                ]}
            />
        </i-panel>
    }
}