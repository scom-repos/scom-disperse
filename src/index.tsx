import { application, moment, Button, Container, customModule, EventBus, HStack, Image, Input, Label, Module, Panel, VStack, Modal, ControlElement, customElements, RequireJS } from '@ijstech/components'
import { TokenSelection, Result } from './common/index';
import { EventId, ITokenObject, toDisperseData, downloadCSVFile, formatNumber, viewOnExplorerByTxHash, isAddressValid, DisperseData, disperseDataToString, registerSendTxEvents, formatUTCDate } from './global/index';
import { getTokenIconPath, Networks, dummyAddressList, ImportFileWarning, isWalletConnected, tokenStore, setDataFromSCConfig, setTokenStore } from './store/index';
import { BigNumber, Wallet } from '@ijstech/eth-wallet';
import { onApproveToken, onCheckAllowance, onDisperse, getDisperseAddress } from './disperse-utils/index';
import Assets from './assets';
import { disperseStyle } from './disperse.css';
import { disperseLayout } from './index.css';
import { RenderResultData, DownloadReportData } from './disperse.type';
import scconfig from './scconfig.json';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-disperse"]: ControlElement;
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
  private secondStepElm: HStack;
  private thirdStepElm: VStack;
  private fourthStepElm: HStack;
  private btnNetwork: Button;
  private btnDownload: Button;
  private btnImport: Button;
  private importFileElm: Label;
  private importWarning: Label;
  private inputBatch: Input;
  private containerUserInfo: VStack;
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

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    setDataFromSCConfig(scconfig);
    setTokenStore();
    this.$eventBus = application.EventBus;
    this.registerEvent();
  };

  private registerEvent = () => {
    this.$eventBus.register(this, EventId.IsWalletConnected, this.onWalletConnect);
    this.$eventBus.register(this, EventId.IsWalletDisconnected, this.onWalletConnect);
    this.$eventBus.register(this, EventId.chainChanged, this.onChainChanged);
  }

  private onWalletConnect = (connected: boolean) => {
    this.checkStepStatus(connected);
    this.updateNetworkBtn(connected);
    this.updateUserInfo(connected);
  }

  private onChainChanged = () => {
    this.resetData();
    this.onWalletConnect(isWalletConnected());
  }

  private connectWallet = () => {
    this.$eventBus.dispatch(EventId.ConnectWallet);
  }

  private changeNetwork = () => {
    this.$eventBus.dispatch(EventId.ChangeNetwork);
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

  private checkStepStatus = (connected: boolean) => {
    this.secondStepElm.enabled = connected;
    this.tokenSelection.enabled = connected;
    this.tokenElm.enabled = connected;
    if (!connected) {
      this.tokenSelection.token = undefined;
      this.onSelectToken(null);
    }
    this.setThirdStatus(!!this.token);
  }

  private setThirdStatus = (enabled: boolean) => {
    this.thirdStepElm.enabled = enabled;
    this.inputBatch.enabled = enabled;
    this.btnImport.enabled = enabled;
    this.setFourthStatus();
  }

  private setFourthStatus = async () => {
    if (isWalletConnected() && this.hasAddress) {
      this.btnDownload.enabled = true;
      this.containerElm.minHeight = '1200px';
      this.fourthStepElm.visible = true;
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
      this.containerElm.minHeight = '800px';
      this.fourthStepElm.visible = false;
      this.btnDownload.enabled = false;
    }
  }

  private updateNetworkBtn = async (connected: boolean) => {
    if (!connected) {
      this.btnNetwork.clearInnerHTML();
      this.btnNetwork.onClick = () => { };
      this.btnNetwork.visible = false;
      return;
    }
    const network = Networks[Wallet.getClientInstance().chainId];
    const hStack = await HStack.create({
      verticalAlignment: 'center',
      padding: { top: 12, bottom: 12, left: 24, right: 24 },
    });
    if (network?.icon) {
      const image = await Image.create({
        width: '24px',
        height: '24px',
        url: Assets.fullPath(`img/network/${network.icon}`),
        class: 'inline-block',
      });
      hStack.appendChild(image);
    }
    const label = await Label.create({
      caption: network?.label || 'Unsupported Network',
      font: { size: '15px' },
      margin: { left: 4 },
    });
    hStack.appendChild(label);
    this.btnNetwork.clearInnerHTML();
    this.btnNetwork.appendChild(hStack);
    this.btnNetwork.onClick = this.changeNetwork;
    this.btnNetwork.visible = true;
  }

  private updateUserInfo = async (connected: boolean) => {
    this.containerUserInfo.clearInnerHTML();
    if (!connected) {
      this.containerUserInfo.appendChild(<i-button
        class="btn-os"
        caption="Connect"
        width={250}
        maxWidth="100%"
        border={{ radius: 12 }}
        padding={{ top: 12, bottom: 12 }}
        onClick={this.connectWallet}
      />);
    } else {
      this.containerUserInfo.appendChild(
        <i-vstack gap={16}>
          <i-label caption="LOGGED IN AS" font={{ size: '16px', name: 'Montserrat', bold: true }} />
          <i-label display="block" caption={Wallet.getInstance().address} font={{ size: '16px', name: 'Montserrat Medium' }} class="break-word" />
        </i-vstack>
      );
    }
  }

  private onSelectToken = (token: ITokenObject | null) => {
    this.token = token;
    this.tokenInfoElm.clearInnerHTML();
    if (token) {
      const img = Assets.fullPath(getTokenIconPath(token, Wallet.getInstance().chainId));
      this.tokenInfoElm.appendChild(<i-hstack gap="16px" verticalAlignment="center">
        <i-image width={40} height={40} url={img} />
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
    // const doc = new jsPDF();
    // const logo = Assets.fullPath('./img/sc-header.png');
    // const totalAmount = this.resultAddresses.reduce((pv, cv) => pv.plus(cv.amount), new BigNumber('0'));
    // const rows = this.resultAddresses.map(item => [item.address, formatNumber(item.amount)]);
    // rows.push(['Total', formatNumber(totalAmount)]);
    // doc.addImage(logo, 'png', 15, 10, 20, 24);
    // doc.setFontSize(36);
    // doc.setFont('helvetica', 'bold');
    // doc.text('Disperse Result', 42, 26.5);
    // doc.setFontSize(11);
    // doc.setFont('helvetica', 'normal');
    // doc.text(`Transaction Hash: ${data.receipt}`, 15, 42);
    // doc.text(`Timestamp: ${data.timestamp}`, 15, 50);
    // doc.text(`From Address: ${data.address}`, 15, 58);
    // doc.text(`Total Amount: ${formatNumber(totalAmount)} ${data.symbol}`, 15, 66);
    // doc.autoTable({
    //   head: [['TRANSFER TO', 'TRANSFER AMOUNT']],
    //   body: rows,
    //   headStyles: { textColor: '#000', fillColor: '#fff', lineWidth: 0.1 },
    //   theme: 'grid',
    //   startY: 75,
    // });
    // doc.save('report.pdf');
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
      this.btnApprove.enabled = false;
      this.btnApprove.caption = 'Approved';
      this.btnDisperse.enabled = this.remaining.gte(0);
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

  private renderResult = (token: ITokenObject, data: RenderResultData) => {
    const img = Assets.fullPath(getTokenIconPath(token, Wallet.getInstance().chainId));
    const chainId = Wallet.getInstance().chainId;
    this.resultElm.clearInnerHTML();
    this.resultElm.appendChild(
      <i-vstack gap={50} horizontalAlignment="center">
        <i-label caption="🎉 Disperse Successful! 🎉" font={{ size: '48px', name: 'Montserrat', bold: true }} />
        <i-vstack gap={16} width={750} maxWidth="100%" horizontalAlignment="center">
          <i-label caption="Token" font={{ size: '24px', name: 'Montserrat Medium' }} />
          <i-hstack width="100%" verticalAlignment="center" horizontalAlignment="center" gap={16} padding={{ top: 20, bottom: 20, left: 60, right: 60 }} border={{ radius: 15, style: 'solid', width: 4, color: '#9C9C9C' }}>
            <i-image width={40} height={40} url={img} />
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
        <i-hstack gap={30} maxWidth="100%" horizontalAlignment="center" verticalAlignment="center">
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

  init() {
    super.init();
    this.classList.add(disperseLayout);
    const connected = isWalletConnected();
    this.checkStepStatus(connected);
    this.updateNetworkBtn(connected);
    this.updateUserInfo(connected);
    this.tokenSelection.isTokenShown = false;
    this.tokenSelection.isCommonShown = true;
    this.tokenSelection.onSelectToken = this.onSelectToken;
    this.tokenElm.onClick = () => this.tokenSelection.showModal();
    this.initInputFile();
  }

  render() {
    return (
      <i-panel class={`template-layout ${disperseStyle}`}>
        <i-modal id="messageModal" class="bg-modal">
          <i-label id="messageElm" />
        </i-modal>
        <i-panel class="container-layout">
          <i-image url={Assets.fullPath('img/disperse-banner.png')} />
          <i-vstack id="containerElm" position="relative" margin={{ top: 50 }} minHeight={800}>
            <i-hstack id="firstStepElm" class="step-elm" minHeight={200} padding={{ left: 50, right: 50 }} border={{ radius: 30 }} verticalAlignment="center" horizontalAlignment="space-between" background={{ color: '#000' }}>
              <i-hstack verticalAlignment="center" gap={15} margin={{ right: 100 }}>
                <i-label caption="STEP 1" font={{ size: '20px', name: 'Montserrat SemiBold', color: '#F29224' }} />
                <i-label caption="Connect Wallet" font={{ size: '20px', name: 'Montserrat SemiBold' }} />
              </i-hstack>
              <i-button
                visible={false}
                id="btnNetwork"
                background={{ color: '#222237' }}
                border={{ radius: 12, width: 2, style: 'solid', color: '#FFB82F' }}
                margin={{ right: 100 }}
              />
              <i-vstack id="containerUserInfo" />
            </i-hstack>
            <i-hstack id="secondStepElm" class="step-elm" minHeight={200} margin={{ top: 40 }} padding={{ left: 50, right: 50 }} border={{ radius: 30 }} verticalAlignment="center" horizontalAlignment="space-between" background={{ color: '#000' }}>
              <i-hstack class="step-2" verticalAlignment="center" gap={15} margin={{ right: 100 }}>
                <i-label caption="STEP 2" font={{ size: '20px', name: 'Montserrat SemiBold', color: '#F29224' }} />
                <i-label caption="Enter Token to Disperse" font={{ size: '20px', name: 'Montserrat SemiBold' }} />
              </i-hstack>
              <i-hstack class="step-2" width="calc(100% - 470px)">
                <i-hstack id="tokenElm" width="100%" wrap="nowrap" verticalAlignment="center" horizontalAlignment="space-between" padding={{ top: 20, bottom: 20, left: 60, right: 60 }} border={{ radius: 15, style: 'solid', width: 4 }}>
                  <i-hstack id="tokenInfoElm">
                    <i-label caption="Please Select Token" font={{ size: '16px', color: '#A8A8A8', name: 'Montserrat Medium' }} />
                  </i-hstack>
                  <i-icon name="caret-down" fill={'#F29224'} width={24} height={24} />
                </i-hstack>
                <token-selection id="tokenSelection" />
              </i-hstack>
            </i-hstack>
            <i-vstack id="thirdStepElm" class="step-elm" minHeight={300} margin={{ top: 40 }} padding={{ left: 50, right: 50 }} border={{ radius: 30 }} verticalAlignment="center" background={{ color: '#000' }}>
              <i-hstack width="100%" verticalAlignment="center" horizontalAlignment="space-between" gap={15}>
                <i-hstack verticalAlignment="center" gap={15} margin={{ right: 15 }}>
                  <i-label caption="STEP 3" font={{ size: '20px', name: 'Montserrat SemiBold', color: '#F29224' }} />
                  <i-label caption="Enter Recipients and Amounts" font={{ size: '20px', name: 'Montserrat SemiBold' }} margin={{ right: 60 }} />
                  <i-label caption="Enter one address and amount on each line. Supports any format." font={{ size: '13px', name: 'Montserrat Medium' }} maxWidth="280px" class="break-word" />
                </i-hstack>
                <i-hstack verticalAlignment="center" class="ml-auto" gap={15}>
                  <i-button id="btnDownload" caption="Download CSV" enabled={false} class="csv-button" onClick={() => this.onDownloadFile()} />
                  <i-button id="btnImport" caption="Import CSV" enabled={false} class="csv-button" onClick={this.onImportFile} />
                  <i-label id="importFileElm" visible={false} />
                </i-hstack>
              </i-hstack>
              <i-label id="importWarning" caption="" font={{ size: '13px', name: 'Montserrat Medium' }} />
              <i-input id="inputBatch" height="auto" enabled={false} placeholder={disperseDataToString(this.DummyDisperseData())} class="input-batch custom-scroll" width="100%" inputType="textarea" rows={4} margin={{ top: 30 }} onChanged={this.onInputBatch} />
            </i-vstack>
            <i-hstack id="fourthStepElm" class="step-elm" minHeight={240} margin={{ top: 40 }}>
              <i-vstack width="100%">
                <i-hstack verticalAlignment="center" horizontalAlignment="space-between" background={{ color: "#34343A" }} border={{ radius: 30 }}>
                  <i-vstack class="step-4" background={{ color: '#000' }} width={800} height="100%" padding={{ top: 50, bottom: 21, left: 50, right: 50 }} gap={15} border={{ radius: 30 }}>
                    <i-hstack width="100%" verticalAlignment="center" gap={15}>
                      <i-label caption="STEP 4" font={{ size: '20px', name: 'Montserrat SemiBold', color: '#F29224' }} />
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
                  <i-vstack class="step-4" width={500} height="100%" verticalAlignment="center" gap={20} padding={{ left: 30, right: 50 }}>
                    <i-hstack verticalAlignment="center" horizontalAlignment="space-between">
                      <i-label caption="Total" font={{ size: '20px', name: 'Montserrat SemiBold' }} />
                      <i-label id="totalElm" class="text-right ml-auto" font={{ size: '20px', name: 'Montserrat SemiBold', color: '#C7C7C7' }} />
                    </i-hstack>
                    <i-hstack verticalAlignment="center" horizontalAlignment="space-between">
                      <i-label caption="Your Balance" font={{ size: '20px', name: 'Montserrat SemiBold' }} />
                      <i-label id="balanceElm" class="text-right ml-auto" font={{ size: '20px', name: 'Montserrat SemiBold', color: '#C7C7C7' }} />
                    </i-hstack>
                    <i-hstack verticalAlignment="center" horizontalAlignment="space-between">
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
        <disperse-wallet />
      </i-panel>
    )
  }
}
