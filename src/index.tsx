import { application, moment, Button, Container, customModule, EventBus, HStack, Image, Input, Label, Module, Panel, VStack, Modal, ControlElement, customElements, RequireJS, IDataSchema } from '@ijstech/components'
import { TokenSelection, Result } from './common/index';
import { EventId, ITokenObject, toDisperseData, downloadCSVFile, formatNumber, viewOnExplorerByTxHash, isAddressValid, DisperseData, disperseDataToString, registerSendTxEvents, formatUTCDate, IDisperseConfigUI, INetworkConfig } from './global/index';
import { dummyAddressList, ImportFileWarning, isWalletConnected, setDataFromSCConfig } from './store/index';
import { BigNumber, Wallet } from '@ijstech/eth-wallet';
import { onApproveToken, onCheckAllowance, onDisperse, getDisperseAddress } from './disperse-utils/index';
import Assets from './assets';
import { disperseStyle } from './disperse.css';
import { disperseLayout } from './index.css';
import { RenderResultData, DownloadReportData } from './disperse.type';
import { tokenStore, assets as tokenAssets } from '@scom/scom-token-list';
import Config from './config/index';
import configData from './data.json';
import ScomWalletModal, { IWalletPlugin } from '@scom/scom-wallet-modal';
import ScomDappContainer from '@scom/scom-dapp-container';
const moduleDir = application.currentModuleDir;
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';

declare const window: any;

interface ScomDisperseElement extends ControlElement {
  defaultChainId: number;
  networks: INetworkConfig[];
  wallets: IWalletPlugin[];
  showHeader?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-disperse"]: ScomDisperseElement;
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
  private importWarning: Label;
  private inputBatch: Input;
  private tokenElm: HStack;
  private tokenInfoElm: Label;
  private tokenSelection: TokenSelection;
  private token: ITokenObject | null;
  private addressesElm: VStack;
  private totalElm: Label;
  private balanceElm: Label;
  private remainingElm: Label;
  private btnApprove: Button;
  private btnDisperse: Button;
  private disperseResult: Result;
  private resultAddresses: DisperseData[] = [];
  private invalidElm: Label;
  private messageModal: Modal;
  private messageElm: Label;
  private configDApp: Config;
  private mdWallet: ScomWalletModal;
  private dappContainer: ScomDappContainer;

  private _oldData: IDisperseConfigUI = {
    defaultChainId: 0,
    wallets: [],
    networks: []
  };
  private _data: IDisperseConfigUI = {
    defaultChainId: 0,
    wallets: [],
    networks: []
  };
  private oldTag: any = {};
  tag: any = {};
  defaultEdit: boolean = true;
  readonly onConfirm: () => Promise<void>;
  readonly onDiscard: () => Promise<void>;
  readonly onEdit: () => Promise<void>;

  private getData() {
    return this._data;
  }

  private async setData(data: IDisperseConfigUI) {
    this._data = data;
    this.configDApp.data = data;
    this._data = data;
    await this.refreshUI();
    if (this.mdWallet) {
      this.mdWallet.networks = data.networks;
      this.mdWallet.wallets = data.wallets;
    }
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
    if (newValue.light) this.updateTag('light', newValue.light);
    if (newValue.dark) this.updateTag('dark', newValue.dark);
    if (this.dappContainer)
      this.dappContainer.setTag(this.tag);
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
  }

  private getActions() {
    const propertiesSchema: IDataSchema = {
      type: "object",
      properties: {}
    }

    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        "dark": {
          type: 'object',
          properties: {
            backgroundColor: {
              type: 'string',
              format: 'color'
            },
            fontColor: {
              type: 'string',
              format: 'color'
            },
            inputBackgroundColor: {
              type: 'string',
              format: 'color'
            },
            inputFontColor: {
              type: 'string',
              format: 'color'
            }
          }
        },
        "light": {
          type: 'object',
          properties: {
            backgroundColor: {
              type: 'string',
              format: 'color'
            },
            fontColor: {
              type: 'string',
              format: 'color'
            },
            inputBackgroundColor: {
              type: 'string',
              format: 'color'
            },
            inputFontColor: {
              type: 'string',
              format: 'color'
            }
          }
        }
      }
    }
    return this._getActions(propertiesSchema, themeSchema);
  }

  private _getActions(propertiesSchema: IDataSchema, themeSchema: IDataSchema) {
    const actions = [
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          return {
            execute: async () => {
              this._oldData = { ...this._data };
              this.configDApp.data = this._data;
              this.refreshUI();
            },
            undo: () => {
              this._data = { ...this._oldData };
              this.configDApp.data = this._data;
              this.refreshUI();
            },
            redo: () => { }
          }
        },
        userInputDataSchema: propertiesSchema
      },
      {
        name: 'Theme Settings',
        icon: 'palette',
        command: (builder: any, userInputData: any) => {
          return {
            execute: async () => {
              if (!userInputData) return;
              this.oldTag = JSON.parse(JSON.stringify(this.tag));
              this.setTag(userInputData);
              if (builder) builder.setTag(userInputData);
            },
            undo: () => {
              if (!userInputData) return;
              this.setTag(this.oldTag);
              if (builder) builder.setTag(this.oldTag);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: themeSchema
      }
    ]
    return actions
  }

  getConfigurators() {
    let self = this;
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: this.getActions.bind(this),
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        elementName: 'i-scom-swap-config',
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
        bindOnChanged: (element: Config, callback: (data: any) => Promise<void>) => {
          element.onCustomCommissionsChanged = async (data: any) => {
            let resultingData = {
              ...self._data,
              ...data
            };
            await this.setData(resultingData);
            await callback(data);
          }
        },
        getData: this.getData.bind(this),
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
    tokenStore.updateTokenMapData();
    this.$eventBus = application.EventBus;
    this.registerEvent();
  };

  private registerEvent = () => {
    this.$eventBus.register(this, EventId.IsWalletConnected, this.onWalletConnect);
    this.$eventBus.register(this, EventId.IsWalletDisconnected, this.onWalletConnect);
    this.$eventBus.register(this, EventId.chainChanged, this.onChainChanged);
  }

  private onWalletConnect = (connected: boolean) => {
    this.setContainerData();
    this.checkStepStatus(connected);
  }

  private onChainChanged = () => {
    this.resetData();
    this.onWalletConnect(isWalletConnected());
  }

  private setContainerData = () => {
    const data: IDisperseConfigUI = {
      defaultChainId: this.defaultChainId,
      wallets: this.wallets,
      networks: this.networks,
      showHeader: this.showHeader
    }
    if (this.dappContainer?.setData) this.dappContainer.setData(data);
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
    return this.listAddresses.reduce((pv, cv) => pv.plus(cv.amount), new BigNumber("0"));
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

  private checkStepStatus = (connected: boolean) => {
    this.firstStepElm.enabled = connected;
    this.tokenSelection.enabled = connected;
    this.tokenElm.enabled = connected;
    if (!connected) {
      this.tokenSelection.token = undefined;
      this.onSelectToken(null);
    }
    this.setThirdStatus(!!this.token);
  }

  private setThirdStatus = (enabled: boolean) => {
    this.secondStepElm.enabled = enabled;
    this.inputBatch.enabled = enabled;
    this.btnImport.enabled = enabled;
    this.setFourthStatus();
  }

  private setFourthStatus = async () => {
    if (isWalletConnected() && this.hasAddress) {
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
              <i-label caption={item.address} font={{ size: '16px', color: valid ? '#A8A8A8' : '#F05E61', name: 'Montserrat Medium' }} />
            </i-vstack>
            <i-label caption={`${item.amount.toFixed()} ${symbol}`} font={{ size: '16px', color: '#A8A8A8', name: 'Montserrat Medium' }} class="text-right" />
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
      const img = tokenAssets.tokenPath(token, Wallet.getClientInstance().chainId);
      this.tokenInfoElm.appendChild(<i-hstack gap="16px" verticalAlignment="center">
        <i-image width={40} height={40} minWidth={30} url={img} />
        <i-label caption={`$${token.symbol}`} font={{ size: '20px', name: 'Montserrat Medium' }} />
        <i-label caption={token.address || token.symbol} font={{ size: '16px', name: 'Montserrat Medium' }} class="break-word" />
      </i-hstack>);
    } else {
      this.tokenInfoElm.appendChild(<i-label caption="Please Select Token" font={{ size: '16px', color: '#A8A8A8', name: 'Montserrat Medium' }} />)
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

  private resetData = () => {
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
    this.checkStepStatus(isWalletConnected());
  }

  private showMessage = (status: 'warning' | 'success' | 'error', content: string | Error) => {
    this.disperseResult.message = {
      status,
      content,
    }
    this.disperseResult.showModal();
  }

  private setEnabledStatus = (enabled: boolean) => {
    this.tokenElm.onClick = () => enabled ? this.tokenSelection.showModal() : {};
    this.tokenElm.enabled = enabled;
    this.btnImport.enabled = enabled;
    this.inputBatch.enabled = enabled;
  }

  private getApprovalStatus = async () => {
    if (!this.token) return;
    if (this.remaining.lt(0)) {
      this.btnApprove.caption = 'Approve';
      this.btnApprove.enabled = false;
      this.btnDisperse.enabled = false;
      return;
    }
    if (this.token.isNative) {
      this.btnApprove.enabled = false;
      this.btnDisperse.enabled = true;
    } else {
      const allowance = await onCheckAllowance(this.token, getDisperseAddress());
      if (allowance === null) return;
      const inputVal = new BigNumber(this.total);
      const isApproved = !inputVal.gt(0) || inputVal.lte(allowance);
      this.btnApprove.enabled = !isApproved;
      this.btnDisperse.enabled = isApproved;
    }
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

    onApproveToken(this.token, getDisperseAddress());
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
      await tokenStore.updateAllTokenBalances();
      this.disperseResult.closeModal();
      this.renderResult(token, { receipt, address, timestamp });
      this.resetData();
    };

    registerSendTxEvents({
      transactionHash: callBackActions,
      confirmation: confirmationCallBackActions
    });

    onDisperse(token, this.listAddresses);
  }

  private loadLib() {
    if (!window.jsPDF) {
      RequireJS.require([`${moduleDir}/lib/jspdf.js`], () => { });
    }
  }

  private renderResult = (token: ITokenObject, data: RenderResultData) => {
    const img = tokenAssets.tokenPath(token, Wallet.getClientInstance().chainId);
    const chainId = Wallet.getClientInstance().chainId;
    this.resultElm.clearInnerHTML();
    this.resultElm.appendChild(
      <i-vstack gap={50} horizontalAlignment="center">
        <i-label caption="🎉 Disperse Successful! 🎉" class="text-center" font={{ size: '48px', name: 'Montserrat', bold: true }} />
        <i-vstack gap={16} width={750} maxWidth="100%" horizontalAlignment="center">
          <i-label caption="Token" font={{ size: '24px', name: 'Montserrat Medium' }} />
          <i-hstack width="100%" verticalAlignment="center" horizontalAlignment="center" gap={16} padding={{ top: 20, bottom: 20, left: 60, right: 60 }} border={{ radius: 15, style: 'solid', width: 4, color: '#9C9C9C' }}>
            <i-image width={40} height={40} minWidth={30} url={img} />
            <i-label caption={`$${token.symbol}`} font={{ size: '20px', name: 'Montserrat Medium' }} />
            <i-label class="text-overflow" caption={token.address || token.symbol} font={{ size: '16px', name: 'Montserrat Medium' }} />
          </i-hstack>
        </i-vstack>
        <i-vstack gap={8} width={750} maxWidth="100%" horizontalAlignment="center">
          <i-label caption="Explorer" font={{ size: '24px', name: 'Montserrat Medium' }} />
          <i-hstack class="pointer" wrap="nowrap" width="100%" minHeight={88} verticalAlignment="center" horizontalAlignment="center" gap={16} padding={{ top: 20, bottom: 20, left: 20, right: 20 }} border={{ radius: 15, style: 'solid', width: 4, color: '#9C9C9C' }} onClick={() => viewOnExplorerByTxHash(chainId, data.receipt)}>
            <i-label class="text-overflow" caption={data.receipt} font={{ size: '16px', name: 'Montserrat Medium' }} />
            <i-icon class="link-icon" name="external-link-alt" width={20} height={20} fill="#fff" />
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
    this.resetData();
  }

  async init() {
    this.isReadyCallbackQueued = true;
    super.init();
    this.loadLib();
    this.classList.add(disperseLayout);
    const connected = isWalletConnected();
    this.checkStepStatus(connected);
    this.tokenSelection.isTokenShown = false;
    this.tokenSelection.isCommonShown = true;
    this.tokenSelection.onSelectToken = this.onSelectToken;
    this.tokenElm.onClick = () => this.tokenSelection.showModal();
    this.initInputFile();
    const commissions = this.getAttribute('commissions', true, []);
    const defaultChainId = this.getAttribute('defaultChainId', true);
    const networks = this.getAttribute('networks', true);
    const wallets = this.getAttribute('wallets', true);
    const showHeader = this.getAttribute('showHeader', true);
    await this.setData({ commissions, defaultChainId, networks, wallets, showHeader });
    if (!isWalletConnected()) {
      this.mdWallet.showModal();
    }
    this.setContainerData();
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
              <i-hstack id="firstStepElm" class="step-elm" minHeight={200} margin={{ top: 40 }} padding={{ left: 50, right: 50, top: 10, bottom: 10 }} border={{ radius: 30 }} verticalAlignment="center" horizontalAlignment="space-between" background={{ color: '#000' }}>
                <i-hstack class="step-1" verticalAlignment="center" wrap="wrap" gap={15} margin={{ right: 100 }}>
                  <i-label caption="STEP 1" font={{ size: '20px', name: 'Montserrat SemiBold', color: '#F29224' }} />
                  <i-label caption="Enter Token to Disperse" font={{ size: '20px', name: 'Montserrat SemiBold' }} />
                </i-hstack>
                <i-hstack class="step-1">
                  <i-hstack id="tokenElm" width="100%" wrap="nowrap" verticalAlignment="center" horizontalAlignment="space-between" padding={{ top: 20, bottom: 20, left: 60, right: 60 }} border={{ radius: 15, style: 'solid', width: 4 }}>
                    <i-hstack id="tokenInfoElm">
                      <i-label caption="Please Select Token" font={{ size: '16px', color: '#A8A8A8', name: 'Montserrat Medium' }} />
                    </i-hstack>
                    <i-icon name="caret-down" fill={'#F29224'} width={24} height={24} />
                  </i-hstack>
                  <token-selection id="tokenSelection" />
                </i-hstack>
              </i-hstack>
              <i-vstack id="secondStepElm" class="step-elm" minHeight={300} margin={{ top: 40 }} padding={{ left: 50, right: 50, top: 10, bottom: 10 }} border={{ radius: 30 }} verticalAlignment="center" background={{ color: '#000' }}>
                <i-hstack width="100%" verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap" gap={15}>
                  <i-hstack verticalAlignment="center" wrap="wrap" gap={15} margin={{ right: 15 }}>
                    <i-label caption="STEP 2" font={{ size: '20px', name: 'Montserrat SemiBold', color: '#F29224' }} />
                    <i-label caption="Enter Recipients and Amounts" font={{ size: '20px', name: 'Montserrat SemiBold' }} margin={{ right: 60 }} />
                    <i-label caption="Enter one address and amount on each line. Supports any format." font={{ size: '13px', name: 'Montserrat Medium' }} maxWidth="280px" class="break-word" />
                  </i-hstack>
                  <i-hstack verticalAlignment="center" wrap="wrap" class="ml-auto" horizontalAlignment="end" gap={15}>
                    <i-button id="btnDownload" caption="Download CSV" enabled={false} class="csv-button" onClick={() => this.onDownloadFile()} />
                    <i-button id="btnImport" caption="Import CSV" enabled={false} class="csv-button" onClick={this.onImportFile} />
                    <i-label id="importFileElm" visible={false} />
                  </i-hstack>
                </i-hstack>
                <i-label id="importWarning" caption="" font={{ size: '13px', name: 'Montserrat Medium' }} />
                <i-input id="inputBatch" height="auto" enabled={false} placeholder={disperseDataToString(this.DummyDisperseData())} class="input-batch custom-scroll" width="100%" inputType="textarea" rows={4} margin={{ top: 30 }} onChanged={this.onInputBatch} />
              </i-vstack>
              <i-hstack id="thirdStepElm" class="step-elm" minHeight={240} margin={{ top: 40 }}>
                <i-vstack width="100%">
                  <i-hstack verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap" background={{ color: "#34343A" }} border={{ radius: 30 }}>
                    <i-vstack class="step-3" background={{ color: '#000' }} width={800} padding={{ top: 50, bottom: 21, left: 50, right: 50 }} gap={15} border={{ radius: 30 }}>
                      <i-hstack width="100%" verticalAlignment="center" gap={15}>
                        <i-label caption="STEP 3" font={{ size: '20px', name: 'Montserrat SemiBold', color: '#F29224' }} />
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
                      <i-hstack verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
                        <i-label caption="Total" font={{ size: '20px', name: 'Montserrat SemiBold' }} />
                        <i-label id="totalElm" class="text-right ml-auto" font={{ size: '20px', name: 'Montserrat SemiBold', color: '#C7C7C7' }} />
                      </i-hstack>
                      <i-hstack verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
                        <i-label caption="Your Balance" font={{ size: '20px', name: 'Montserrat SemiBold' }} />
                        <i-label id="balanceElm" class="text-right ml-auto" font={{ size: '20px', name: 'Montserrat SemiBold', color: '#C7C7C7' }} />
                      </i-hstack>
                      <i-hstack verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
                        <i-label caption="Remaining" font={{ size: '20px', name: 'Montserrat SemiBold' }} />
                        <i-label id="remainingElm" class="text-right ml-auto" font={{ size: '20px', name: 'Montserrat SemiBold', color: '#C7C7C7' }} />
                      </i-hstack>
                    </i-vstack>
                  </i-hstack>
                  <i-hstack verticalAlignment="center" horizontalAlignment="center" margin={{ top: 60 }} gap={30}>
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
                </i-vstack>
              </i-hstack>
            </i-vstack>
            <i-panel id="resultElm" visible={false} margin={{ top: 75, bottom: 100 }} />
          </i-panel>
          <disperse-result id="disperseResult" />
          <i-scom-disperse-config id="configDApp" visible={false} />
          <i-scom-wallet-modal
            id="mdWallet"
            wallets={[]}
          />
        </i-panel>
      </i-scom-dapp-container>
    )
  }
}
