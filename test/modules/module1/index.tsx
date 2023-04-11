import { Module, customModule, Container, VStack } from '@ijstech/components';
import ScomDisperse from '@scom/scom-disperse';

@customModule
export default class Module1 extends Module {
    private disperseElm: ScomDisperse;
    private mainStack: VStack;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
    }

    render() {
        return <i-panel>
            <i-hstack id="mainStack" margin={{top: '1rem', left: '1rem'}} gap="2rem">
                <i-scom-disperse />
            </i-hstack>
        </i-panel>
    }
}