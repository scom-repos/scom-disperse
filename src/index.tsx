import {
  application,
  moment,
  Button,
  Container,
  customModule,
  EventBus,
  HStack,
  Input,
  Label,
  Module,
  Panel,
  VStack,
  Modal,
  ControlElement,
  customElements,
  RequireJS,
  Icon,
  Styles
} from '@ijstech/components'
import {
  EventId,
  toDisperseData,
  downloadCSVFile,
  formatNumber,
  viewOnExplorerByTxHash,
  isAddressValid,
  DisperseData,
  disperseDataToString,
  registerSendTxEvents,
  formatUTCDate,
  IDisperseConfigUI,
  ICommissionInfo,
  RenderResultData,
  DownloadReportData
} from './global/index';
import {
  dummyAddressList,
  getChainId,
  getDisperseAddress,
  getEmbedderCommissionFee,
  getProxyAddress,
  getRpcWallet,
  ImportFileWarning,
  initRpcWallet,
  isClientWalletConnected,
  isRpcWalletConnected,
  setDataFromSCConfig
} from './store/index';
import { BigNumber, Constants, IEventBusRegistry, Wallet } from '@ijstech/eth-wallet';
import { onApproveToken, onCheckAllowance, onDisperse, getCommissionAmount, getCurrentCommissions } from './disperse-utils/index';
import { disperseLayout, disperseStyle, tokenModalStyle } from './index.css';
import { tokenStore, assets as tokenAssets, ITokenObject } from '@scom/scom-token-list';
import ScomWalletModal, { IWalletPlugin } from '@scom/scom-wallet-modal';
import ScomDappContainer from '@scom/scom-dapp-container';
import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
import { INetworkConfig } from '@scom/scom-network-picker';
import configData from './data.json';
import formSchema from './formSchema.json';
import Assets from './assets';
import ScomTokenModal from '@scom/scom-token-modal';
import ScomTxStatusModal from '@scom/scom-tx-status-modal';
const moduleDir = application.currentModuleDir;
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';

const Theme = Styles.Theme.ThemeVars;

declare const window: any;

interface ScomDisperseElement extends ControlElement {
  defaultChainId: number;
  networks: INetworkConfig[];
  wallets: IWalletPlugin[];
  showHeader?: boolean;
  lazyLoad?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-disperse']: ScomDisperseElement;
    }
  }
}

@customModule
@customElements('i-scom-disperse')
export default class ScomDisperse extends Module {
  private $eventBus: EventBus;
  private containerElm: VStack;
  private resultElm: Panel;
  private firstStepElm: HStack;
  private secondStepElm: VStack;
  private thirdStepElm: HStack;
  private btnDownload: Button;
  private btnImport: Button;
  private importFileElm: Label;
  private inputBatch: Input;
  private tokenElm: HStack;
  private tokenInfoElm: Label;
  private mdToken: ScomTokenModal;
  private token: ITokenObject | null;
  private addressesElm: VStack;
  private totalElm: Label;
  private balanceElm: Label;
  private remainingElm: Label;
  private btnApprove: Button;
  private btnDisperse: Button;
  private txStatusModal: ScomTxStatusModal;
  private resultAddresses: DisperseData[] = [];
  private invalidElm: Label;
  private messageModal: Modal;
  private messageElm: Label;
  private mdWallet: ScomWalletModal;
  private dappContainer: ScomDappContainer;
  private iconTotal: Icon;
  private hStackGroupButton: HStack;
  private btnWallet: Button;

  private contractAddress: string;
  private _data: IDisperseConfigUI = {
    defaultChainId: 0,
    wallets: [],
    networks: []
  };
  tag: any = {};
  defaultEdit: boolean = true;
  private rpcWalletEvents: IEventBusRegistry[] = [];
  private clientEvents: any[] = [];

  private getData() {
    return this._data;
  }

  private async setData(data: IDisperseConfigUI) {
    this._data = data;

    const rpcWalletId = initRpcWallet(this.defaultChainId);
    const rpcWallet = getRpcWallet();
    const event = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
      this.updateContractAddress();
      this.onWalletConnect(isClientWalletConnected());
    });
    this.rpcWalletEvents.push(event);

    const containerData = {
      defaultChainId: this.defaultChainId,
      wallets: this.wallets,
      networks: this.networks,
      showHeader: this.showHeader,
      rpcWalletId: rpcWallet.instanceId
    }
    if (this.dappContainer?.setData) this.dappContainer.setData(containerData);

    if (!this.mdToken.isConnected) await this.mdToken.ready();
    if (this.mdToken.rpcWalletId !== rpcWallet.instanceId) {
      this.mdToken.rpcWalletId = rpcWallet.instanceId;
    }
    await this.refreshUI();
  }

  private updateTag(type: 'light' | 'dark', value: any) {
    this.tag[type] = this.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.tag[type][prop] = value[prop];
    }
  }

  private async setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        if (prop === 'light' || prop === 'dark')
          this.updateTag(prop, newValue[prop]);
        else
          this.tag[prop] = newValue[prop];
      }
    }
    if (this.dappContainer) this.dappContainer.setTag(this.tag);
    this.updateTheme();
  }

  private async getTag() {
    return this.tag;
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.style.setProperty(name, value) :
      this.style.removeProperty(name);
  }

  private updateTheme() {
    const themeVar = this.dappContainer?.theme || 'light';
    this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
    this.updateStyle('--input-font_color', this.tag[themeVar]?.inputFontColor);
    this.updateStyle('--input-background', this.tag[themeVar]?.inputBackgroundColor);
    // this.updateStyle('--colors-primary-main', this.tag[themeVar]?.buttonBackgroundColor);
    // this.updateStyle('--colors-primary-contrast_text', this.tag[themeVar]?.buttonFontColor);
    this.updateStyle('--colors-secondary-main', this.tag[themeVar]?.secondaryColor);
    this.updateStyle('--colors-secondary-contrast_text', this.tag[themeVar]?.secondaryFontColor);
  }

  private getActions(category?: string) {
    const self = this;
    const actions: any = [
      {
        name: 'Commissions',
        icon: 'dollar-sign',
        command: (builder: any, userInputData: any) => {
          let _oldData: IDisperseConfigUI = {
            defaultChainId: 0,
            wallets: [],
            networks: []
          }
          return {
            execute: async () => {
              _oldData = { ...this._data };
              if (userInputData.commissions) this._data.commissions = userInputData.commissions;
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            undo: () => {
              this._data = { ..._oldData };
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        customUI: {
          render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => {
            const vstack = new VStack();
            const config = new ScomCommissionFeeSetup(null, {
              commissions: self._data.commissions,
              fee: getEmbedderCommissionFee(),
              networks: self._data.networks
            });
            const hstack = new HStack(null, {
              verticalAlignment: 'center',
            });
            const button = new Button(hstack, {
              caption: 'Confirm',
              width: '100%',
              height: 40,
              font: { color: Theme.colors.primary.contrastText }
            });
            vstack.append(config);
            vstack.append(hstack);
            button.onClick = async () => {
              const commissions = config.commissions;
              if (onConfirm) onConfirm(true, { commissions });
            }
            return vstack;
          }
        }
      }
    ];
    if (category && category !== 'offers') {
      // actions.push(
      // {
      //   name: 'Settings',
      //   icon: 'cog',
      //   command: (builder: any, userInputData: any) => {
      //     let _oldData: IDisperseConfigUI = {
      //       defaultChainId: 0,
      //       wallets: [],
      //       networks: []
      //     };
      //     return {
      //       execute: async () => {
      //         _oldData = { ...this._data };
      //         this.refreshUI();
      //       },
      //       undo: () => {
      //         this._data = { ..._oldData };
      //         this.refreshUI();
      //       },
      //       redo: () => { }
      //     }
      //   },
      //   userInputDataSchema: formSchema.general.dataSchema
      // }
      // )

      actions.push(
        {
          name: 'Theme Settings',
          icon: 'palette',
          command: (builder: any, userInputData: any) => {
            let oldTag = {};
            return {
              execute: async () => {
                if (!userInputData) return;
                oldTag = JSON.parse(JSON.stringify(this.tag));
                if (builder) builder.setTag(userInputData);
                else this.setTag(userInputData);
                if (this.dappContainer) this.dappContainer.setTag(userInputData);
              },
              undo: () => {
                if (!userInputData) return;
                this.tag = JSON.parse(JSON.stringify(oldTag));
                if (builder) builder.setTag(this.tag);
                else this.setTag(this.tag);
                if (this.dappContainer) this.dappContainer.setTag(this.tag);
              },
              redo: () => { }
            }
          },
          userInputDataSchema: formSchema.theme.dataSchema
        }
      );
    }

    return actions
  }

  getConfigurators() {
    let self = this;
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: (category?: string) => {
          return this.getActions(category);
        },
        getData: this.getData.bind(this),
        setData: async (data: IDisperseConfigUI) => {
          const defaultData = configData.defaultBuilderData;
          await this.setData({ ...defaultData, ...data });
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        elementName: 'i-scom-disperse-config',
        getLinkParams: () => {
          const commissions = this._data.commissions || [];
          return {
            data: window.btoa(JSON.stringify(commissions))
          }
        },
        setLinkParams: async (params: any) => {
          if (params.data) {
            const decodedString = window.atob(params.data);
            const commissions = JSON.parse(decodedString);
            let resultingData = {
              ...self._data,
              commissions
            };
            await this.setData(resultingData);
          }
        },
        bindOnChanged: (element: ScomCommissionFeeSetup, callback: (data: any) => Promise<void>) => {
          element.onChanged = async (data: any) => {
            let resultingData = {
              ...self._data,
              ...data
            };
            await this.setData(resultingData);
            await callback(data);
          }
        },
        getData: () => {
          const fee = getEmbedderCommissionFee();
          return { ...this.getData(), fee }
        },
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private DummyDisperseData(): DisperseData[] {
    return [
      {
        address: dummyAddressList[0],
        amount: new BigNumber(100.1)
      },
      {
        address: dummyAddressList[1],
        amount: new BigNumber(5.8)
      },
      {
        address: dummyAddressList[2],
        amount: new BigNumber(333)
      }
    ]
  }

  private async refreshUI() {
    this.onLoad();
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    setDataFromSCConfig(configData);
    this.$eventBus = application.EventBus;
    this.registerEvent();
  };

  onHide() {
    this.dappContainer.onHide();
    const rpcWallet = getRpcWallet();
    for (let event of this.rpcWalletEvents) {
      rpcWallet.unregisterWalletEvent(event);
    }
    this.rpcWalletEvents = [];
    for (let event of this.clientEvents) {
      event.unregister();
    }
    this.clientEvents = [];
  }

  private registerEvent = () => {
    this.clientEvents.push(this.$eventBus.register(this, EventId.chainChanged, this.onChainChanged));
  }

  private onWalletConnect = async (connected: boolean) => {
    this.updateButtons();
    const rpcWallet = getRpcWallet();
    if (connected && rpcWallet.address) await tokenStore.updateAllTokenBalances(rpcWallet);
    this.checkStepStatus(connected);
  }

  private onChainChanged = async () => {
    this.resetData(false);
    await this.onWalletConnect(isClientWalletConnected());
  }

  private updateButtons() {
    if (!this.hStackGroupButton) return;
    const isClientConnected = isClientWalletConnected();
    if (!isClientConnected || !isRpcWalletConnected()) {
      this.btnWallet.visible = true;
      this.btnWallet.caption = !isClientConnected ? 'Connect Wallet' : 'Switch Network';
      this.hStackGroupButton.visible = false;
      return;
    }
    this.btnWallet.visible = false;
    this.hStackGroupButton.visible = true;
  }

  get listAddresses() {
    if (this.inputBatch.value) {
      return toDisperseData(this.inputBatch.value);
    }
    return [];
  }

  get hasAddress() {
    return !!this.listAddresses?.length;
  }

  get balance() {
    if (this.token) {
      return tokenStore.getTokenBalance(this.token);
    }
    return '0';
  }

  get total() {
    const _total = this.listAddresses.reduce((pv, cv) => pv.plus(cv.amount), new BigNumber('0'));
    const commissionsAmount = getCommissionAmount(this.commissions, _total);
    return _total.plus(commissionsAmount);
  }

  get remaining() {
    return new BigNumber(this.balance).minus(this.total);
  }

  get defaultChainId() {
    return this._data.defaultChainId;
  }

  set defaultChainId(value: number) {
    this._data.defaultChainId = value;
  }

  get wallets() {
    return this._data.wallets ?? [];
  }

  set wallets(value: IWalletPlugin[]) {
    this._data.wallets = value;
  }

  get networks() {
    return this._data.networks ?? [];
  }

  set networks(value: INetworkConfig[]) {
    this._data.networks = value;
  }

  get showHeader() {
    return this._data.showHeader ?? true;
  }

  set showHeader(value: boolean) {
    this._data.showHeader = value;
  }

  get commissions() {
    return this._data.commissions ?? [];
  }

  set commissions(value: ICommissionInfo[]) {
    this._data.commissions = value;
  }

  private checkStepStatus = (connected: boolean) => {
    this.firstStepElm.enabled = connected;
    this.tokenElm.enabled = connected;
    if (!connected) {
      this.mdToken.token = undefined;
      this.onSelectToken(null);
    }
    this.setThirdStatus(!!this.token);
    this.updateCommissionsTooltip();
    this.updateContractAddress();
  }

  private setThirdStatus = (enabled: boolean) => {
    this.secondStepElm.enabled = enabled;
    this.inputBatch.enabled = enabled;
    this.btnImport.enabled = enabled;
    this.setFourthStatus();
  }

  private setFourthStatus = async () => {
    if (isClientWalletConnected() && this.hasAddress) {
      this.btnDownload.enabled = true;
      this.containerElm.minHeight = '1000px';
      this.thirdStepElm.visible = true;
      const symbol = this.token?.symbol || '';
      this.addressesElm.clearInnerHTML();
      let countInvalid = 0;
      for (const item of this.listAddresses) {
        const valid = await isAddressValid(item.address);
        if (!valid) {
          ++countInvalid;
        }
        this.addressesElm.appendChild(
          <i-hstack width="100%" verticalAlignment="center" gap={30}>
            <i-vstack width={450}>
              <i-label caption={item.address} opacity={0.75} font={{ size: '16px', color: valid ? Theme.text.primary : '#F05E61', name: 'Montserrat Medium' }} />
            </i-vstack>
            <i-label caption={`${item.amount.toFixed()} ${symbol}`} opacity={0.75} font={{ size: '16px', name: 'Montserrat Medium' }} class="text-right" />
          </i-hstack>
        );
      };

      this.totalElm.caption = `${formatNumber(this.total)} ${symbol}`;
      this.balanceElm.caption = `${formatNumber(this.balance)} ${symbol}`;
      this.remainingElm.caption = `${formatNumber(this.remaining)} ${symbol}`;
      if (countInvalid) {
        this.invalidElm.caption = `There ${countInvalid === 1 ? 'is' : 'are'} ${countInvalid} invalid ${countInvalid === 1 ? 'address' : 'addresses'}!`;
        this.invalidElm.visible = true;
        this.btnApprove.caption = 'Approve';
        this.btnApprove.enabled = false;
        this.btnDisperse.enabled = false;
      } else {
        this.invalidElm.visible = false;
        this.getApprovalStatus();
      }
    } else {
      this.containerElm.minHeight = '600px';
      this.thirdStepElm.visible = false;
      this.btnDownload.enabled = false;
    }
  }

  private onSelectToken = (token: ITokenObject | null) => {
    this.token = token;
    this.tokenInfoElm.clearInnerHTML();
    if (token) {
      const img = tokenAssets.tokenPath(token, getChainId());
      this.tokenInfoElm.appendChild(<i-hstack gap="16px" verticalAlignment="center">
        <i-image width={40} height={40} minWidth={30} url={img} fallbackUrl={Assets.fullPath('img/tokens/token-placeholder.svg')} />
        <i-label caption={`$${token.symbol}`} font={{ size: '20px', name: 'Montserrat Medium' }} />
        <i-label caption={token.address || token.symbol} font={{ size: '16px', name: 'Montserrat Medium' }} class="break-word" />
      </i-hstack>);
    } else {
      this.tokenInfoElm.appendChild(<i-label caption="Please Select Token" font={{ size: '16px', name: 'Montserrat Medium' }} opacity={0.75} />)
    }
    this.setThirdStatus(!!token);
  }

  private onDisperseAgain = () => {
    this.containerElm.visible = true;
    this.resultElm.visible = false;
    const parent = this.parentNode?.parentNode?.parentElement;
    if (parent) {
      parent.scrollTop = 0;
    }
  }

  private onDownloadReport = (data: DownloadReportData) => {
    const doc = new window.jsPDF();
    const logo = Assets.fullPath('./img/sc-header.png');
    const totalAmount = this.resultAddresses.reduce((pv, cv) => pv.plus(cv.amount), new BigNumber('0'));
    const rows = this.resultAddresses.map(item => [item.address, formatNumber(item.amount)]);
    rows.push(['Total', formatNumber(totalAmount)]);
    // doc.addImage(logo, 'png', 15, 10, 20, 24);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('Disperse Result', 42, 26.5);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Transaction Hash: ${data.receipt}`, 15, 42);
    doc.text(`Timestamp: ${data.timestamp}`, 15, 50);
    doc.text(`From Address: ${data.address}`, 15, 58);
    doc.text(`Total Amount: ${formatNumber(totalAmount)} ${data.symbol}`, 15, 66);
    const cols = ['TRANSFER TO', 'TRANSFER AMOUNT'];
    const table = [cols, ...rows]
    let y = 75;
    for (let i = 0; i < table.length; i++) {
      let row = table[i];
      let x = 15;
      for (let j = 0; j < cols.length; j++) {
        const data = row[j];
        doc.text(`${data}`, x, y);
        x += 120;
      }
      y += 8;
    }
    // doc.autoTable({
    //   head: [['TRANSFER TO', 'TRANSFER AMOUNT']],
    //   body: rows,
    //   headStyles: { textColor: '#000', fillColor: '#fff', lineWidth: 0.1 },
    //   theme: 'grid',
    //   startY: 75,
    // });
    doc.save('report.pdf');
  }

  private onDownloadFile = (isResult?: boolean) => {
    let content = '';
    const arr = isResult ? this.resultAddresses : this.listAddresses;
    arr.forEach((item) => {
      content += `${item.address},${item.amount.toFixed()}\r\n`;
    });
    downloadCSVFile(content, 'disperse.csv');
  }

  private onImportFile = () => {
    (this.importFileElm.firstChild?.firstChild as HTMLElement)?.click();
  }

  private onInputBatch = () => {
    this.setFourthStatus();
  }

  private convertCSVToText = (result: any) => {
    if (!result) this.showImportCSVError(ImportFileWarning.Broken);
    const arr = toDisperseData(result.replace(/"/g, ''));
    if (arr.length > 0) {
      let text = arr.reduce((prev, next, idx) => prev += `${idx ? '\n' : ''}${next.address}, ${next.amount.toFixed()}`, "");
      this.inputBatch.value = text;
    } else {
      this.showImportCSVError(ImportFileWarning.Empty);
    }
    this.setFourthStatus();
  }

  private showImportCSVError(message: string) {
    this.messageModal.visible = true;
    this.messageModal.title = "Import CSV Error";
    this.messageElm.caption = message;
  }

  private initInputFile = () => {
    this.importFileElm.caption = '<input type="file" accept=".csv, .txt" />';
    const inputElm = this.importFileElm.firstChild?.firstChild as HTMLElement;
    if (inputElm) {
      inputElm.onchange = (event: any) => {
        const reader = new FileReader();
        const files = event.target.files;
        if (!files.length) {
          return;
        }
        const file = files[0];
        // const fileName = file.name;
        // const lastDot = fileName.lastIndexOf('.');
        // const ext = fileName.substring(lastDot + 1);
        // if (ext.toLowerCase() !== 'csv') { //no need to check file ext
        //   return;
        // }
        reader.readAsBinaryString(file);
        reader.onload = (event) => {
          const { loaded, total } = event;
          const isCompleted = loaded === total;
          this.btnImport.enabled = isCompleted;
          this.btnImport.rightIcon.visible = !isCompleted;
          this.btnImport.caption = !isCompleted ? 'Importing' : 'Import CSV';
          if (isCompleted) {
            this.initInputFile();
            this.convertCSVToText(reader.result);
          }
        }
      }
    }
  }

  private resetData = async (updateBalance?: boolean) => {
    this.updateButtons();
    const rpcWallet = getRpcWallet();
    tokenStore.updateTokenMapData(getChainId());
    if (updateBalance && rpcWallet.address) await tokenStore.updateAllTokenBalances(rpcWallet);
    this.setEnabledStatus(true);
    this.btnApprove.rightIcon.visible = false;
    this.btnApprove.caption = 'Approve';
    this.btnApprove.enabled = false;
    this.btnDisperse.rightIcon.visible = false;
    this.btnDisperse.caption = 'Disperse';
    this.btnDisperse.enabled = false;
    this.inputBatch.value = '';
    this.invalidElm.visible = false;
    this.onSelectToken(null);
    this.checkStepStatus(isClientWalletConnected());
  }

  private showMessage = (status: 'warning' | 'success' | 'error', content: string | Error) => {
    this.txStatusModal.message = {
      status,
      content,
    }
    this.txStatusModal.showModal();
  }

  private setEnabledStatus = (enabled: boolean) => {
    this.tokenElm.onClick = () => enabled ? this.mdToken.showModal() : {};
    this.tokenElm.enabled = enabled;
    this.btnImport.enabled = enabled;
    this.inputBatch.enabled = enabled;
  }

  private updateCommissionsTooltip = () => {
    const commissionFee = new BigNumber(getEmbedderCommissionFee());
    if (commissionFee.gt(0) && getCurrentCommissions(this.commissions).length) {
      this.iconTotal.visible = true;
      this.iconTotal.tooltip.content = `A commission fee of ${commissionFee.times(100)}% will be applied to the total amount you input.`;
    } else {
      this.iconTotal.visible = false;
    }
  }

  private updateContractAddress = () => {
    if (getCurrentCommissions(this.commissions).length) {
      this.contractAddress = getProxyAddress();
    } else {
      this.contractAddress = getDisperseAddress();
    }
  }

  private getApprovalStatus = async () => {
    if (!this.token) return;
    if (this.remaining.lt(0) || !isRpcWalletConnected()) {
      this.btnApprove.caption = 'Approve';
      this.btnApprove.enabled = false;
      this.btnDisperse.enabled = false;
      return;
    }
    if (this.token.isNative) {
      this.btnApprove.enabled = false;
      this.btnDisperse.enabled = true;
    } else {
      await this.initWallet();
      const allowance = await onCheckAllowance(this.token, this.contractAddress);
      if (allowance === null) return;
      const inputVal = new BigNumber(this.total);
      const isApproved = !inputVal.gt(0) || inputVal.lte(allowance);
      if (!isApproved) {
        this.btnApprove.caption = 'Approve';
      }
      this.btnApprove.enabled = !isApproved;
      this.btnDisperse.enabled = isApproved;
    }
  }

  private initWallet = async () => {
    try {
      await Wallet.getClientInstance().init();
			const rpcWallet = getRpcWallet();
			await rpcWallet.init();
    } catch { }
  }

  private handleApprove = async () => {
    if (!this.token) return;
    this.showMessage('warning', 'Approving');

    const callBackActions = async (err: Error | null, receipt?: string) => {
      if (err) {
        this.showMessage('error', err);
      } else if (receipt) {
        this.showMessage('success', receipt);
        this.btnApprove.rightIcon.visible = true;
        this.btnApprove.caption = 'Approving';
        this.setEnabledStatus(false);
      }
    };

    const confirmationCallBackActions = async () => {
      this.btnApprove.rightIcon.visible = false;
      await this.getApprovalStatus();
      this.btnApprove.caption = this.btnApprove.enabled ? 'Approve' : 'Approved';
      this.btnDisperse.enabled = !this.btnApprove.enabled && this.remaining.gte(0);
      this.setEnabledStatus(true);
    };

    registerSendTxEvents({
      transactionHash: callBackActions,
      confirmation: confirmationCallBackActions
    });

    onApproveToken(this.token, this.contractAddress);
  }

  private handleDisperse = async () => {
    const token = { ...this.token } as ITokenObject;
    if (!token) return;

    this.resultAddresses = [...this.listAddresses];
    let receipt = '';
    let timestamp = '';
    const address = Wallet.getClientInstance().address;
    this.showMessage('warning', 'Dispersing');

    const callBackActions = async (err: Error, _receipt?: string) => {
      if (err) {
        this.showMessage('error', err);
      } else if (_receipt) {
        timestamp = formatUTCDate(moment());
        receipt = _receipt;
        this.btnDisperse.rightIcon.visible = true;
        this.btnDisperse.caption = 'Dispersing';
        this.setEnabledStatus(false);
        this.showMessage('success', _receipt);
      }
    };

    const confirmationCallBackActions = async () => {
      this.txStatusModal.closeModal();
      this.renderResult(token, { receipt, address, timestamp });
      this.resetData(true);
    };

    registerSendTxEvents({
      transactionHash: callBackActions,
      confirmation: confirmationCallBackActions
    });

    const { error } = await onDisperse({ token, data: this.listAddresses, commissions: this.commissions });
    if (error) {
      this.showMessage('error', error);
    }
  }

  private connectWallet = async () => {
    if (!isClientWalletConnected()) {
      if (this.mdWallet) {
        await application.loadPackage('@scom/scom-wallet-modal', '*');
        this.mdWallet.networks = this.networks;
        this.mdWallet.wallets = this.wallets;
        this.mdWallet.showModal();
      }
      return;
    }
    if (!isRpcWalletConnected()) {
      const chainId = getChainId();
      const clientWallet = Wallet.getClientInstance();
      await clientWallet.switchNetwork(chainId);
    }
  }

  private loadLib() {
    if (!window.jsPDF) {
      RequireJS.require([`${moduleDir}/lib/jspdf.js`], () => { });
    }
  }

  private renderResult = (token: ITokenObject, data: RenderResultData) => {
    const img = tokenAssets.tokenPath(token, getChainId());
    const chainId = Wallet.getClientInstance().chainId;
    this.resultElm.clearInnerHTML();
    this.resultElm.appendChild(
      <i-vstack gap={50} horizontalAlignment="center">
        <i-label caption="🎉 Disperse Successful! 🎉" class="text-center" font={{ size: '48px', name: 'Montserrat', bold: true }} />
        <i-vstack gap={16} width={750} maxWidth="100%" horizontalAlignment="center">
          <i-label caption="Token" font={{ size: '24px', name: 'Montserrat Medium' }} />
          <i-hstack width="100%" verticalAlignment="center" horizontalAlignment="center" gap={16} padding={{ top: 20, bottom: 20, left: 60, right: 60 }} border={{ radius: 15, style: 'solid', width: 4 }}>
            <i-image width={40} height={40} minWidth={30} url={img} fallbackUrl={Assets.fullPath('img/tokens/token-placeholder.svg')} />
            <i-label caption={`$${token.symbol}`} font={{ size: '20px', name: 'Montserrat Medium' }} />
            <i-label class="text-overflow" caption={token.address || token.symbol} font={{ size: '16px', name: 'Montserrat Medium' }} />
          </i-hstack>
        </i-vstack>
        <i-vstack gap={8} width={750} maxWidth="100%" horizontalAlignment="center">
          <i-label caption="Explorer" font={{ size: '24px', name: 'Montserrat Medium' }} />
          <i-hstack class="pointer" wrap="nowrap" width="100%" minHeight={88} verticalAlignment="center" horizontalAlignment="center" gap={16} padding={{ top: 20, bottom: 20, left: 20, right: 20 }} border={{ radius: 15, style: 'solid', width: 4 }} onClick={() => viewOnExplorerByTxHash(chainId, data.receipt)}>
            <i-label class="text-overflow" caption={data.receipt} font={{ size: '16px', name: 'Montserrat Medium' }} />
            <i-icon class="link-icon" name="external-link-alt" width={20} height={20} fill={Theme.text.primary} />
          </i-hstack>
        </i-vstack>
        <i-hstack gap={30} maxWidth="100%" horizontalAlignment="center" verticalAlignment="center" wrap="wrap">
          <i-button caption="DOWNLOAD CSV" background={{ color: "#34343A" }} width={270} border={{ radius: 12 }} padding={{ top: 12, bottom: 12 }} onClick={() => this.onDownloadFile(true)} />
          <i-button caption="DOWNLOAD REPORT" background={{ color: 'transparent linear-gradient(270deg, #FF9900 0%, #FC7428 100%) 0% 0% no-repeat padding-box' }} width={270} border={{ radius: 12 }} padding={{ top: 12, bottom: 12 }} onClick={() => this.onDownloadReport({ symbol: token.symbol, ...data })} />
          <i-button caption="DISPERSE AGAIN" background={{ color: 'linear-gradient(90deg, #456ED7 0%, #67BBBB 99.97%)' }} width={270} border={{ radius: 12 }} padding={{ top: 12, bottom: 12 }} onClick={this.onDisperseAgain} />
        </i-hstack>
      </i-vstack>
    );
    this.containerElm.visible = false;
    this.resultElm.visible = true;
  }

  onLoad = () => {
    this.containerElm.visible = true;
    this.resultElm.visible = false;
    this.resetData(true);
  }

  async init() {
    this.isReadyCallbackQueued = true;
    super.init();
    this.loadLib();
    this.classList.add(disperseLayout);
    this.checkStepStatus(isClientWalletConnected());
    this.mdToken.onSelectToken = this.onSelectToken;
    this.tokenElm.onClick = () => this.mdToken.showModal();
    this.initInputFile();

    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      const commissions = this.getAttribute('commissions', true, []);
      const defaultChainId = this.getAttribute('defaultChainId', true);
      const networks = this.getAttribute('networks', true);
      const wallets = this.getAttribute('wallets', true);
      const showHeader = this.getAttribute('showHeader', true);
      await this.setData({ commissions, defaultChainId, networks, wallets, showHeader });
    }
    this.isReadyCallbackQueued = false;
    this.executeReadyCallback();
  }

  render() {
    return (
      <i-scom-dapp-container id="dappContainer">
        <i-panel class={`template-layout ${disperseStyle}`}>
          <i-modal id="messageModal" class="bg-modal">
            <i-label id="messageElm" />
          </i-modal>
          <i-panel class="container-layout">
            <i-vstack id="containerElm" position="relative" minHeight={600}>
              <i-hstack id="firstStepElm" class="step-elm" minHeight={200} margin={{ top: 40 }} padding={{ left: 50, right: 50, top: 10, bottom: 10 }} border={{ radius: 30 }} verticalAlignment="center" horizontalAlignment="space-between" background={{ color: Theme.colors.secondary.main }}>
                <i-hstack class="step-1" verticalAlignment="center" wrap="wrap" gap={15} margin={{ right: 100 }}>
                  <i-label caption="STEP 1" font={{ size: '20px', name: 'Montserrat SemiBold', color: Theme.colors.secondary.contrastText }} />
                  <i-label caption="Enter Token to Disperse" font={{ size: '20px', name: 'Montserrat SemiBold' }} />
                </i-hstack>
                <i-hstack class="step-1">
                  <i-hstack id="tokenElm" width="100%" wrap="nowrap" verticalAlignment="center" horizontalAlignment="space-between" padding={{ top: 20, bottom: 20, left: 60, right: 60 }} border={{ radius: 15, style: 'solid', width: 4 }}>
                    <i-hstack id="tokenInfoElm">
                      <i-label caption="Please Select Token" opacity={0.75} font={{ size: '16px', name: 'Montserrat Medium' }} />
                    </i-hstack>
                    <i-icon name="caret-down" fill={Theme.text.primary} width={24} height={24} />
                  </i-hstack>
                  <i-scom-token-modal
                    id="mdToken"
                    isCommonShown={false}
                    class={tokenModalStyle}
                  />
                </i-hstack>
              </i-hstack>
              <i-vstack id="secondStepElm" class="step-elm" minHeight={300} margin={{ top: 40 }} padding={{ left: 50, right: 50, top: 10, bottom: 10 }} border={{ radius: 30 }} verticalAlignment="center" background={{ color: Theme.colors.secondary.main }}>
                <i-hstack width="100%" verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap" gap={15}>
                  <i-hstack verticalAlignment="center" wrap="wrap" gap={15} margin={{ right: 15 }}>
                    <i-label caption="STEP 2" font={{ size: '20px', name: 'Montserrat SemiBold', color: Theme.colors.secondary.contrastText }} />
                    <i-label caption="Enter Recipients and Amounts" font={{ size: '20px', name: 'Montserrat SemiBold' }} margin={{ right: 60 }} />
                    <i-label caption="Enter one address and amount on each line. Supports any format." font={{ size: '13px', name: 'Montserrat Medium' }} maxWidth="280px" class="break-word" />
                  </i-hstack>
                  <i-hstack verticalAlignment="center" wrap="wrap" class="ml-auto" horizontalAlignment="end" gap={15}>
                    <i-button id="btnDownload" caption="Download CSV" enabled={false} class="csv-button" onClick={() => this.onDownloadFile()} />
                    <i-button id="btnImport" caption="Import CSV" enabled={false} class="csv-button" onClick={this.onImportFile} />
                    <i-label id="importFileElm" visible={false} />
                  </i-hstack>
                </i-hstack>
                <i-input id="inputBatch" height="auto" enabled={false} placeholder={disperseDataToString(this.DummyDisperseData())} class="input-batch custom-scroll" width="100%" inputType="textarea" rows={4} margin={{ top: 30 }} onChanged={this.onInputBatch} />
              </i-vstack>
              <i-hstack id="thirdStepElm" class="step-elm" minHeight={240} margin={{ top: 40 }}>
                <i-vstack width="100%">
                  <i-hstack verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap" background={{ color: Theme.input.background }} border={{ radius: 30 }}>
                    <i-vstack class="step-3" background={{ color: Theme.colors.secondary.main }} width={800} padding={{ top: 50, bottom: 21, left: 50, right: 50 }} gap={15} border={{ radius: 30 }}>
                      <i-hstack width="100%" verticalAlignment="center" gap={15}>
                        <i-label caption="STEP 3" font={{ size: '20px', name: 'Montserrat SemiBold', color: Theme.colors.secondary.contrastText }} />
                        <i-label caption="Confirm Disperse" font={{ size: '20px', name: 'Montserrat SemiBold' }} />
                      </i-hstack>
                      <i-vstack width="100%" verticalAlignment="center" gap={10} class="custom-scroll">
                        <i-label id="invalidElm" font={{ size: '18px', color: '#F05E61' }} />
                        <i-vstack gap={10} class="address-elm">
                          <i-hstack width="100%" verticalAlignment="center" gap={30}>
                            <i-vstack width={450}>
                              <i-label caption="Addresses" font={{ size: '16px', name: 'Montserrat Medium' }} />
                            </i-vstack>
                            <i-label caption="Amount" font={{ size: '16px', name: 'Montserrat Medium' }} />
                          </i-hstack>
                          <i-vstack width="100%" height={100} class="overflow-auto" padding={{ right: 5 }}>
                            <i-vstack id="addressesElm" width="100%" height="100%" verticalAlignment="start" gap={4} />
                          </i-vstack>
                        </i-vstack>
                      </i-vstack>
                    </i-vstack>
                    <i-vstack class="step-3" width={500} maxWidth="100%" verticalAlignment="center" gap={20} padding={{ left: 30, right: 50 }}>
                      <i-hstack gap={10} verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
                        <i-hstack gap={4} verticalAlignment="center">
                          <i-label caption="Total" font={{ size: '20px', name: 'Montserrat SemiBold', color: Theme.input.fontColor }} />
                          <i-icon id="iconTotal" name="question-circle" fill={Theme.input.fontColor} width={20} height={20} visible={false} />
                        </i-hstack>
                        <i-label id="totalElm" class="text-right ml-auto" font={{ size: '20px', name: 'Montserrat SemiBold', color: Theme.input.fontColor }} opacity={0.75} />
                      </i-hstack>
                      <i-hstack gap={10} verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
                        <i-label caption="Your Balance" font={{ size: '20px', name: 'Montserrat SemiBold', color: Theme.input.fontColor }} />
                        <i-label id="balanceElm" class="text-right ml-auto" font={{ size: '20px', name: 'Montserrat SemiBold', color: Theme.input.fontColor }} opacity={0.75} />
                      </i-hstack>
                      <i-hstack gap={10} verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
                        <i-label caption="Remaining" font={{ size: '20px', name: 'Montserrat SemiBold', color: Theme.input.fontColor }} />
                        <i-label id="remainingElm" class="text-right ml-auto" font={{ size: '20px', name: 'Montserrat SemiBold', color: Theme.input.fontColor }} opacity={0.75} />
                      </i-hstack>
                    </i-vstack>
                  </i-hstack>
                  <i-hstack id="hStackGroupButton" verticalAlignment="center" horizontalAlignment="center" margin={{ top: 40, bottom: 20 }} gap={30}>
                    <i-button
                      id="btnApprove"
                      caption="Approve"
                      class="btn-os"
                      width={300}
                      maxWidth="100%"
                      enabled={false}
                      rightIcon={{ spin: true, visible: false }}
                      border={{ radius: 12 }}
                      padding={{ top: 12, bottom: 12 }}
                      onClick={this.handleApprove}
                    />
                    <i-button
                      id="btnDisperse"
                      caption="Disperse"
                      class="btn-os"
                      width={300}
                      maxWidth="100%"
                      enabled={false}
                      rightIcon={{ spin: true, visible: false }}
                      border={{ radius: 12 }}
                      padding={{ top: 12, bottom: 12 }}
                      onClick={this.handleDisperse}
                    />
                  </i-hstack>
                  <i-button
                    id="btnWallet"
                    caption="Connect Wallet"
                    class="btn-os"
                    width={300}
                    maxWidth="100%"
                    visible={false}
                    margin={{ top: 40, bottom: 20, left: 'auto', right: 'auto' }}
                    border={{ radius: 12 }}
                    padding={{ top: 12, bottom: 12 }}
                    onClick={this.connectWallet}
                  />
                </i-vstack>
              </i-hstack>
            </i-vstack>
            <i-panel id="resultElm" visible={false} margin={{ top: 75, bottom: 100 }} />
          </i-panel>
          <i-scom-tx-status-modal id="txStatusModal" />
          <i-scom-commission-fee-setup visible={false} />
          <i-scom-wallet-modal id="mdWallet" wallets={[]} />
        </i-panel>
      </i-scom-dapp-container>
    )
  }
}
