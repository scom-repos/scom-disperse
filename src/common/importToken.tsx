import {
  customElements,
  Control,
  ControlElement,
  Module,
  Modal,
  observable,
  Button,
  Container,
  IEventBus,
  application,
  Checkbox
} from '@ijstech/components'; 
import { Wallet } from '@ijstech/eth-wallet';
import { EventId, ITokenObject, viewOnExplorerByAddress } from '../global/index';
import { addUserTokens, tokenStore } from '../store/index';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			['import-token']: ControlElement;
		}
	}
};

@customElements('import-token')
export class ImportToken extends Module {
  private importModal: Modal;
  private importBtn: Button;
  private _token: ITokenObject;
  private $eventBus: IEventBus;
  public onUpdate: any;

  @observable()
  private _state = {
    address: '',
    name: ''
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.$eventBus = application.EventBus;
  };

  set token(value: ITokenObject) {
    this._token = value;
    this.updateState();
  }

  get token() {
    return this._token;
  }

  updateState() {
    this._state.address = this.token.address || '';
    this._state.name = this.token.name || '';
  }

  closeModal() {
    this.importModal.visible = false;
  }

  showModal() {
    this.importModal.visible = true;
  }

  async onImportToken(source: Control, event: Event) {
    event.stopPropagation();
    const tokenObj = this.token;
    addUserTokens(tokenObj);
    tokenStore.updateTokenMapData();
    await tokenStore.updateAllTokenBalances();
    this.$eventBus.dispatch(EventId.EmitNewToken, tokenObj);
    if (typeof this.onUpdate === 'function') {
      this.onUpdate(tokenObj);
    }
    this.closeModal();
  }

  onHandleCheck(source: Control, event: Event) {
    this.importBtn.enabled = (source as Checkbox).checked;
  }

  viewContract() {
    const chainId = Wallet.getInstance().chainId;
    viewOnExplorerByAddress(chainId, this._state.address);
  }

  async init() {
    super.init();
  }
  
  render() {
		return (
      <i-modal id="importModal" class="bg-modal" title="Select Token" closeIcon={{ name: 'times' }}>
        <i-panel margin={{top: 12, bottom: 12}} padding={{top: 20, bottom: 16, left: 16, right: 16}} border={{radius: 12, width: 2, style: 'solid', color: '#FF8800'}}>
          <i-panel>
            <i-icon name="question" class="cicrle" fill={'#F29224'} width={15} height={15} margin={{right: 4}} />
            <i-label caption={this._state.name}/>
          </i-panel>
          <i-hstack margin={{ top: 5, bottom: 5 }}>
            <i-label caption={this._state.address}
              font={{ color: '#1890ff' }}
              class="pointer"
              onClick={() => this.viewContract()}
            />
          </i-hstack>
          <i-panel padding={{ top: 5, bottom: 5, left: 5, right: 5}} display="inline-block" background={{color: 'transparent linear-gradient(270deg, #FF9900 0%, #FC7428 100%) 0% 0% no-repeat padding-box'}} border={{ radius: 5 }}>
            <i-icon name="exclamation-triangle" margin={{right: 4}} fill="#fff" width={15} height={15} />
            <i-label caption="Unknow Source"/>
          </i-panel>
        </i-panel>
        <i-panel margin={{top: 12, bottom: 12}} padding={{top: 20, bottom: 16, left: 16, right: 16}} border={{radius: 12, width: 2, style: 'solid', color: '#FF8800'}}>
          <i-hstack horizontalAlignment="center" margin={{bottom: 5}}> 
            <i-icon name="exclamation-triangle" margin={{right: 4}} fill={'#F29224'} width={30} height={30} />
          </i-hstack>
          <i-hstack horizontalAlignment="center" class="text-center" margin={{bottom: 5}}> 
            <i-label font={{bold:true, color:"#fff"}} caption="Trade at your own risk!"/> 
          </i-hstack>
          <i-hstack horizontalAlignment="center" class="text-center" margin={{bottom: 5}}> 
            <i-label font={{color:"#fff"}} caption="Anyone can create a token, including creating fake versions of existing token that claims tp represent projects"/> 
          </i-hstack>
          <i-hstack horizontalAlignment="center" class="text-center" margin={{bottom: 5}}> 
            <i-label width={300} font={{bold:true, color:"#fff"}} caption="If you purchased this token, you may not be to able sell it back"/> 
          </i-hstack>
          <i-hstack horizontalAlignment="center" class="text-center"> 
            <i-checkbox id="checkInput" width="200" margin={{top: 30}} height={30} class="token-agree-input"
              background={{color: "transparent"}} caption="I understand" onChanged={this.onHandleCheck.bind(this)}
            />
          </i-hstack>
        </i-panel>
        <i-button id="importBtn" class="btn-os" border={{radius: 5}} padding={{top: 4, bottom: 4, left: 20, right: 20}} font={{size: '16px', color: '#fff'}} width="100%" caption="Import"
          height={40} enabled={false} onClick={this.onImportToken.bind(this)}
        />
      </i-modal>
		)
	}
}
