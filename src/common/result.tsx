
import { customElements, Module, ControlElement, Modal, Panel, Label, Image, Button, Container, VStack, Styles } from '@ijstech/components';
import { getNetworkType } from '../store/index';
import { viewOnExplorerByTxHash, parseContractError } from '../global/index';
import styleClass from './result.css';
import Assets from '../assets';
import { Wallet } from '@ijstech/eth-wallet';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			['disperse-result']: ControlElement;
		}
	}
};

export interface IMessage {
  status: 'warning' | 'success' | 'error',
  content?: any,
  txtHash?: string,
  obj?: any,
  customRedirect?: any,
}

@customElements('disperse-result')
export class Result extends Module {
  private confirmModal: Modal;
  private mainContent: Panel;
  private _message: any;

  get message(): IMessage {
    return this._message;
  }

  set message(value: IMessage) {
    this._message = value;
    this.renderUI();
  }

	constructor(parent?: Container, options?: any) {
		super(parent, options);
	};

	async init(){
		this.classList.add(styleClass);
		super.init();
    this.confirmModal.onClose = () => this.onCloseRedirect();
  }

  closeModal() {
    this.confirmModal.visible = false;
  }

  showModal() {
    this.confirmModal.visible = true;
  }

  onCloseRedirect() {
    const customRedirect = this.message?.customRedirect;
    if (customRedirect && customRedirect.name) {
      this._message.customRedirect = null;
      if (customRedirect.params) {
        const queries = new URLSearchParams(customRedirect.params).toString();
        window.location.assign(`/#/${customRedirect.name}?${queries}`);
      } else {
        window.location.assign(`/#/${customRedirect.name}`);
      }
    }
  }

  async buildLink() {
    if (this.message.txtHash) {
      const chainId: number = Wallet.getClientInstance().chainId;
      viewOnExplorerByTxHash(chainId, this.message.txtHash);
    }
  }

  async renderUI() {
    this.mainContent.clearInnerHTML();
    const mainSection = await VStack.create({
      horizontalAlignment: 'center'
    });
    if (this.message.status === 'warning') {
      mainSection.id = "warningSection";
      const loading = (
        <i-panel height={100}>
          <i-vstack id="loadingElm" class="i-loading-overlay" height="100%" background={{color: "transparent"}}>
            <i-vstack class="i-loading-spinner" horizontalAlignment="center" verticalAlignment="center">
              <i-icon 
                class="i-loading-spinner_icon"
                image={{ url: Assets.fullPath('img/loading.svg'), width: 24, height: 24 }}
              ></i-icon>
              <i-label caption="Loading..." font={{ color: '#F29224' }} class="i-loading-spinner_text"></i-label>
            </i-vstack>
          </i-vstack>
        </i-panel>
      )
      mainSection.appendChild(loading);
      const section = new VStack();
      section.margin={ bottom: 20 };
      const captionList = ['Waiting For Confirmation', this.message.content || '', 'Confirm this transaction in your wallet'];
      const options = [ {font: { color: '#F6C958', size: '20px'}, marginBottom: 15}, { marginBottom: 15 }, { font: { color: '#C2C3CB' }}];
      for (let i = 0; i < captionList.length; i++) {
        const caption = captionList[i];
        const option = options[i] || {};
        const label = await Label.create({...option});
        label.caption = caption;
        section.appendChild(label);
      };
      mainSection.appendChild(section);
    } else if (this.message.status === 'success') {
      const chainId: number = Wallet.getClientInstance().chainId;
      const networkType = getNetworkType(chainId);
      
      const image = await Image.create({
        width: '50px',
        url: Assets.fullPath('img/success-icon.svg'),
        margin: {bottom: 30},
        display: 'inline-block'
      });
      mainSection.appendChild(image);
      
      const label = await Label.create({
        caption: 'Transaction Submitted',
        margin: {bottom: 10},
        font: { size: '20px', color: '#F6C958' }  
      });
      mainSection.appendChild(label);

      const contentSection = await Panel.create();
      contentSection.id = "contentSection";
      mainSection.appendChild(contentSection);

      const contentLabel = await Label.create();
      contentLabel.caption = this.message.content || '';
      contentLabel.style.overflowWrap = 'anywhere';
      contentSection.appendChild(contentLabel);

      if (this.message.txtHash) {
        const section = new VStack();

        const label1 = await Label.create({
          caption: this.message.txtHash.substring(0, 33),
          margin: { bottom: 15 }
        });
        section.appendChild(label1);

        const label2 = await Label.create({
          caption: this.message.txtHash.substring(33, this.message.txtHash.length),
          margin: {bottom: 15}
        });
        section.appendChild(label2);

        const link = await Label.create({
          caption: `View on ${networkType}`,
          display: 'block',
          font: { color: '#FF9900' },
        });
        link.onClick = this.buildLink.bind(this);
        link.classList.add("pointer");
        section.appendChild(link);
        contentSection.appendChild(section);
      }

      const button = new Button(mainSection, {
        width: '100%',
        caption: 'Close',
      });
      button.classList.add('btn-os');
      button.classList.add('btn-approve');
      button.classList.add('mt-1');
      button.onClick = () => this.closeModal();
      mainSection.appendChild(button);
    } else {
      const image = await Image.create({
        width: '50px',
        url: Assets.fullPath('img/warning-icon.png'),
        display: 'inline-block',
        margin: {bottom: 30}
      });
      mainSection.appendChild(image);

      const label = await Label.create({
        caption: 'Transaction Rejected.',
        font: { size: '18px', color: '#F6C958' },
        margin: {bottom: 10}
      });
      mainSection.appendChild(label);

      const section = await VStack.create();
      section.id = "contentSection";
      const err = await this.onErrMsgChanged();
      const contentLabel =  await Label.create({
        caption: err,
        margin: {bottom: 15},
        visible: !!err
      });
      section.appendChild(contentLabel);
      mainSection.appendChild(section);

      const button = new Button(mainSection, {
        width: '100%',
        caption: 'Cancel'
      });
      button.classList.add('btn-os');
      button.classList.add('btn-approve');
      button.classList.add('mt-1');
      button.onClick = () => this.closeModal();
      mainSection.appendChild(button);
    }
    this.mainContent.clearInnerHTML();
    this.mainContent.appendChild(mainSection);
  }

  async onErrMsgChanged() {
    if (this.message.status !== 'error') return this.message.content;

    if (this.message.content.message && this.message.content.message.includes('Internal JSON-RPC error.')) {
      this.message.content.message = JSON.parse(this.message.content.message.replace('Internal JSON-RPC error.\n', '')).message;
    }
    
    return await parseContractError(this.message.content.message, this.message.obj);
  }

	render() {
		return (
      <i-modal
        id="confirmModal"
        closeIcon={{ name: 'times' }}
        class="dark-modal confirm-modal"
        minHeight="280px"
      >
        <i-panel id="mainContent" class="i-modal_content" />
      </i-modal>
		)
	}
};