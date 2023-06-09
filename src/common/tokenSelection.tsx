import { customElements, Module, Control, ControlElement, Modal, Input, Icon, Panel, Button, Image, observable, application, IEventBus, Container, Styles, GridLayout } from '@ijstech/components';
import {
  getChainId,
  getTokenObject,
  hasUserToken,
  setUserTokens,
  hasMetaMask,
  getRpcWallet,
} from '../store/index';
import { formatNumber, EventId } from '../global/index';
import Assets from '../assets';
import './tokenSelection.css';
import { ImportToken } from '../common/importToken';
import { ChainNativeTokenByChainId, tokenStore, assets as tokenAssets, ITokenObject, isWalletConnected } from '@scom/scom-token-list';

const Theme = Styles.Theme.ThemeVars;

interface TokenSelectionElement extends ControlElement {
  disableSelect?: boolean,
  disabledMaxBtn?: boolean
}

declare const window: any;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['token-selection']: TokenSelectionElement;
    }
  }
};

@customElements('token-selection')
export class TokenSelection extends Module {
  private _isTokenShown: boolean = true;
  private _token?: ITokenObject;
  private _tokenDataListProp: Array<ITokenObject>;
  private _onSelectToken: any;
  private _isCommonShown: boolean;
  private _isSortBalanceShown: boolean = true;
  private _isBtnMaxShown: boolean = true;
  private _onSetMaxBalance: any;
  private tokenSelectionElm: Panel;
  private tokenSelectionModal: Modal;
  private tokenBalancesMap: any;
  private btnToken: Button;
  private btnMax: Button;
  private tokenList: GridLayout;
  private commonTokenList: GridLayout;
  private commonTokenPanel: Panel;
  private sortBalancePanel: Panel;
  private importTokenModal: ImportToken;
  @observable()
  private sortValue: boolean | undefined;
  private iconSortUp: Icon;
  private iconSortDown: Icon;
  private tokenSearch: Input;
  @observable()
  private filterValue: string;
  private checkHasMetaMask: boolean;
  private $eventBus: IEventBus;
  private _disableSelect: boolean;
  private _disabledMaxBtn: boolean;
  private defaultUrl: string = Assets.fullPath('img/tokens/token-placeholder.svg');

  get token() {
    return this._token;
  }

  set token(value: ITokenObject | undefined) {
    this._token = value;
    this.updateButton(value);
  }

  get isTokenShown() {
    return this._isTokenShown;
  }

  set isTokenShown(value: boolean) {
    this._isTokenShown = value;
    if (this.tokenSelectionElm) {
      this.tokenSelectionElm.visible = value;
    }
  }

  get tokenDataListProp(): Array<ITokenObject> {
    return this._tokenDataListProp;
  }

  set tokenDataListProp(value: Array<ITokenObject>) {
    this._tokenDataListProp = value;
    this.renderTokenItems();
    this.updateButton();
  }

  get onSelectToken(): any {
    return this._onSelectToken;
  }

  set onSelectToken(callback: any) {
    this._onSelectToken = callback;
  }

  get isCommonShown(): boolean {
    return this._isCommonShown;
  }

  set isCommonShown(value: boolean) {
    this._isCommonShown = value;
    this.renderCommonItems();
  }

  get isSortBalanceShown(): boolean {
    return this._isSortBalanceShown;
  }

  set isSortBalanceShown(value: boolean) {
    this._isSortBalanceShown = value;
    if (value) {
      this.sortBalancePanel.classList.remove('hidden');
    } else {
      this.sortBalancePanel.classList.add('hidden');
    }
  }

  get isBtnMaxShown(): boolean {
    return this._isBtnMaxShown;
  }

  set isBtnMaxShown(value: boolean) {
    this._isBtnMaxShown = value;
    if (!this.btnMax) return;
    if (value) {
      this.btnMax.classList.remove('hidden');
    } else {
      this.btnMax.classList.add('hidden');
    }
  }

  get onSetMaxBalance(): any {
    return this._onSetMaxBalance;
  }

  set onSetMaxBalance(callback: any) {
    this._onSetMaxBalance = callback;
  }

  get chainId(): number {
    return getChainId();
  }

  get disableSelect(): boolean {
    return this._disableSelect;
  }

  set disableSelect(value: boolean) {
    this._disableSelect = value;
    this.btnToken.enabled = !value;
    // this.btnToken.rightIcon.name = value ? '' : 'caret-down';
    this.btnToken.rightIcon.visible = !value;
  }

  get disabledMaxBtn(): boolean {
    return this._disabledMaxBtn;
  }

  set disabledMaxBtn(value: boolean) {
    this._disabledMaxBtn = value;
    this.btnMax.enabled = !value;
  }

  async initData() {
    if (isWalletConnected()) {
      this.tokenBalancesMap = tokenStore.tokenBalances;
    }
    this.renderTokenItems();
  }

  private async updateDataByChain() {
    const rpcWallet = getRpcWallet();
    this.tokenBalancesMap = await tokenStore.updateAllTokenBalances(rpcWallet);
    this.renderTokenItems();
    this.updateButton();
  }

  private async updateDataByNewToken() {
    this.tokenBalancesMap = tokenStore.tokenBalances;
    this.renderTokenItems();
  }

  private async onWalletConnect() {
    this.checkHasMetaMask = hasMetaMask();
    await this.initData();
    this.updateStatusButton();
  }

  private async onWalletDisconnect() {
    await this.initData();
  }

  private async onPaid() {
    await this.updateDataByChain();
    await this.initData();
  }

  private registerEvent() {
    // this.$eventBus.register(this, EventId.IsWalletConnected, this.onWalletConnect);
    // this.$eventBus.register(this, EventId.IsWalletDisconnected, this.onWalletDisconnect);
    this.$eventBus.register(this, EventId.Paid, this.onPaid);
    this.$eventBus.register(this, EventId.EmitNewToken, this.updateDataByNewToken);
  }

  private get tokenDataList(): ITokenObject[] {
    let tokenList: ITokenObject[] = [];
    if (this.tokenDataListProp && this.tokenDataListProp.length) {
      tokenList = this.tokenDataListProp;
    } else {
      tokenList = tokenStore.getTokenList(this.chainId);
    }
    return tokenList.map((token: ITokenObject) => {
      const tokenObject = { ...token };
      const nativeToken = ChainNativeTokenByChainId[this.chainId];
      if (nativeToken?.symbol && token.symbol === nativeToken.symbol) {
        Object.assign(tokenObject, { isNative: true })
      }
      if (!isWalletConnected()) {
        Object.assign(tokenObject, {
          balance: 0,
        })
      }
      else if (this.tokenBalancesMap) {
        Object.assign(tokenObject, {
          balance: this.tokenBalancesMap[token.address?.toLowerCase() || token.symbol] || 0,
        })
      }
      return tokenObject;
    }).sort(this.sortToken);
  }

  private get commonTokenDataList(): ITokenObject[] {
    const tokenList: ITokenObject[] = this.tokenDataList;
    if (!tokenList) return [];
    return tokenList.filter((token: ITokenObject) => token.isCommon || token.isNative);
  }

  private get tokenDataListFiltered(): ITokenObject[] {
    let tokenList: ITokenObject[] = this.tokenDataList || [];
    if (tokenList.length) {
      if (this.filterValue) {
        tokenList = tokenList.filter((token: ITokenObject) => {
          return token.symbol.toUpperCase().includes(this.filterValue) ||
            token.name.toUpperCase().includes(this.filterValue) ||
            token.address?.toUpperCase() === this.filterValue;
        });
      }
      if (this.sortValue !== undefined) {
        tokenList = tokenList.sort((a: ITokenObject, b: ITokenObject) => {
          return this.sortToken(a, b, this.sortValue);
        });
        const allBalanceZero = !tokenList.some((token: ITokenObject) => token.balance && token.balance !== '0');
        if (allBalanceZero && !this.sortValue) {
          tokenList = tokenList.reverse();
        }
      }
    }
    return tokenList;
  }

  private sortToken = (a: any, b: any, asc?: boolean) => {
    if (a.balance != b.balance) {
      return asc ? (a.balance - b.balance) : (b.balance - a.balance);
    }
    if (a.symbol.toLowerCase() < b.symbol.toLowerCase()) {
      return -1;
    }
    if (a.symbol.toLowerCase() > b.symbol.toLowerCase()) {
      return 1;
    }
    return 0;
  }

  private sortBalance() {
    this.sortValue = !this.sortValue;
    if (this.sortValue) {
      this.iconSortUp.classList.add('icon-sorted');
      this.iconSortDown.classList.remove('icon-sorted');
    } else {
      this.iconSortUp.classList.remove('icon-sorted');
      this.iconSortDown.classList.add('icon-sorted');
    }
    this.renderTokenItems();
  }

  private filterSearch(source: Control, event: Event) {
    this.filterValue = (source as Input).value.toUpperCase();
    this.renderTokenItems();
  }

  private async renderCommonItems() {
    if (!this.commonTokenList) return;
    this.commonTokenList.innerHTML = '';
    if (this.isCommonShown && this.commonTokenDataList) {
      this.commonTokenPanel.classList.remove('hidden');
      this.commonTokenDataList.forEach((token: ITokenObject) => {
        const logoAddress = tokenAssets.tokenPath(token, this.chainId);

        this.commonTokenList.appendChild(
          <i-hstack
            onClick={() => this.onSelect(token)}
            tooltip={{ content: token.name }}
            verticalAlignment="center"
            class="grid-item"
            wrap="nowrap"
          >
            <i-image width={24} height={24} url={logoAddress} fallbackUrl={this.defaultUrl} />
            <i-label caption={token.symbol}></i-label>
          </i-hstack>
        )
      })
    } else {
      this.commonTokenPanel.classList.add('hidden');
    }
  }

  private renderToken(token: ITokenObject) {
    const logoAddress = tokenAssets.tokenPath(token, this.chainId);
    return (
      <i-hstack
        width="100%"
        verticalAlignment="center"
        class="token-item"
        onClick={() => this.onSelect(token)}
      >
        <i-vstack width="100%">
          <i-hstack verticalAlignment="center">
            <i-hstack>
              <i-image width={36} height={36} url={logoAddress} fallbackUrl={this.defaultUrl} />
              <i-panel class="token-info">
                <i-label caption={token.symbol} />
                <i-hstack class="token-name" verticalAlignment="center">
                  <i-label caption={token.name} />
                  {token.address && !token.isNative ?
                    <i-icon
                      name="copy"
                      width="14px"
                      height="14px"
                      fill={Theme.text.primary}
                      margin={{ right: 8 }}
                      tooltip={{ content: `${token.symbol} has been copied`, trigger: 'click' }}
                      onClick={() => application.copyToClipboard(token.address || '')}
                      class="inline-flex pointer"
                    ></i-icon>
                    : []
                  }
                  {token.address && this.checkHasMetaMask ?
                    <i-image
                      display="flex"
                      width={16}
                      height={16}
                      url={Assets.fullPath('img/wallet/metamask.png')}
                      tooltip={{ content: 'Add to MetaMask' }}
                      onClick={(target: Control, event: Event) => this.addToMetamask(event, token)}
                    ></i-image>
                    : []
                  }
                </i-hstack>
              </i-panel>
            </i-hstack>
            <i-label class="ml-auto" caption={formatNumber(token.balance, 4)} />
          </i-hstack>
          {
            token.isNew ? (
              <i-hstack horizontalAlignment="center">
                <i-button caption="Import"
                  class="btn-os"
                  border={{ radius: 5 }}
                  padding={{ top: 4, bottom: 4, left: 20, right: 20 }}
                  font={{ size: '16px', color: Theme.text.primary }}
                  margin={{ top: 10 }} height={34}
                  onClick={(source: Control, event: Event) => this.showImportTokenModal(event, token)}
                />
              </i-hstack>
            ) : []
          }
        </i-vstack>
      </i-hstack>
    )
  }

  private async renderTokenItems() {
    if (!this.tokenList) return;
    this.renderCommonItems();
    this.tokenList.innerHTML = '';
    if (this.tokenDataListFiltered.length) {
      const tokenItems = this.tokenDataListFiltered.map((token: ITokenObject) => this.renderToken(token));
      this.tokenList.append(...tokenItems);
    } else {
      try {
        const tokenObj = await getTokenObject(this.filterValue, true);
        if (!tokenObj) throw new Error('Token is invalid');
        this.tokenList.innerHTML = '';
        this.tokenList.appendChild(this.renderToken({ ...tokenObj, isNew: true, chainId: this.chainId }));
      } catch (err) {
        this.tokenList.innerHTML = '';
        this.tokenList.append(
          <i-label class="text-center mt-1 mb-1" caption="No tokens found" />
        )
      }
    }
  }

  private addToMetamask(event: Event, token: ITokenObject) {
    event.stopPropagation();
    const img = `${window.location.origin}${tokenAssets.getTokenIconPath(token, this.chainId).substring(1)}`;
    window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: img
        },
      },
    });
  }

  async showModal() {
    if (!this.enabled) return;
    this.tokenSearch.value = '';
    this.filterValue = '';
    this.sortValue = undefined;
    this.iconSortUp.classList.remove('icon-sorted');
    this.iconSortDown.classList.remove('icon-sorted');
    if (!this.tokenList.hasChildNodes()) {
      tokenStore.updateTokenMapData(getChainId());
      this.initData();
    }
    this.tokenSelectionModal.visible = true;
  }

  private updateStatusButton() {
    const status = isWalletConnected();
    if (this.btnToken) {
      this.btnToken.enabled = !this.disableSelect && status;
    }
    if (this.btnMax) {
      this.btnMax.enabled = !this.disabledMaxBtn && status;
    }
  }

  private updateButton(token?: ITokenObject) {
    const btnToken = this.btnToken;
    if (!btnToken) return;
    try {
      let image: Image = btnToken.querySelector('i-image') as Image;
      if (!token) {
        token = this.tokenDataList?.find((v: ITokenObject) => (v.address && v.address == this.token?.address) || (v.symbol == this.token?.symbol))
      }
      if (!token) {
        btnToken.caption = 'Select a token';
        btnToken.classList.remove('has-token');
        this.btnMax.classList.add('hidden');
        if (image) {
          btnToken.removeChild(image);
        }
      } else {
        btnToken.caption = token.symbol;
        btnToken.classList.add('has-token');
        if (this.isBtnMaxShown) {
          this.btnMax.classList.remove('hidden');
        }
        const logoAddress = tokenAssets.tokenPath(token, this.chainId);
        if (!image) {
          image = new Image(btnToken, {
            width: 20,
            height: 20,
            fallbackUrl: this.defaultUrl
          });
          btnToken.prepend(image);
        }
        image.url = logoAddress;
      }
    } catch { }
  }

  private async onSelect(token: ITokenObject, isNew: boolean = false) {
    this.token = token;
    // The token has been not imported
    if (!isNew && token.isNew && !hasUserToken(token.address || '', this.chainId)) {
      setUserTokens(token, this.chainId);
      const rpcWallet = getRpcWallet();
      tokenStore.updateTokenMapData(this.chainId);
      await tokenStore.updateAllTokenBalances(rpcWallet);
      this.$eventBus.dispatch(EventId.EmitNewToken, token);
      isNew = true;
    }
    this.onSelectToken({ ...token, isNew });
    this.tokenSelectionModal.visible = false;
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.$eventBus = application.EventBus;
    this.registerEvent();
  };

  async init() {
    super.init();
    this.disableSelect = this.getAttribute("disableSelect", true);
    this.disabledMaxBtn = this.getAttribute("disabledMaxBtn", true);
    this.updateStatusButton();
    this.updateButton(this._token);
    if (!isWalletConnected())
      this.disableSelect = false;
  }

  showImportTokenModal(event: Event, token: ITokenObject) {
    event.stopPropagation();
    this.importTokenModal.token = token;
    this.importTokenModal.showModal();
    this.importTokenModal.onUpdate = this.onImportToken.bind(this);
  }

  onImportToken(token: ITokenObject) {
    this.onSelect(token, true);
  }

  onCloseModal() {
    this.filterValue = '';
    this.renderTokenItems();
  }

  render() {
    return (
      <i-panel class="token-selection">
        <i-panel id="tokenSelectionElm" visible={this.isTokenShown} class="flex">
          <i-button id="btnMax" margin={{ right: 4 }} enabled={false} class="custom-btn hidden" caption="Max" onClick={() => this.onSetMaxBalance()} />
          <i-button id="btnToken" enabled={false} class="custom-btn" rightIcon={{ name: "caret-down" }} caption="Select a token" onClick={() => this.showModal()} />
        </i-panel>
        <i-modal id="tokenSelectionModal" class="bg-modal" title="Select Token" closeIcon={{ name: 'times' }} onClose={() => this.onCloseModal()}>
          <i-panel class="search">
            <i-icon width={16} height={16} name="search" fill={Theme.input.fontColor} />
            <i-input id="tokenSearch" placeholder="Search name or paste address" width="100%" height="auto" border={{ width: 2, style: 'solid', color: '#9C9C9C', radius: 10 }} onKeyUp={this.filterSearch.bind(this)} />
          </i-panel>
          <i-panel id="commonTokenPanel" margin={{ bottom: 16 }} class="common-token">
            <i-label caption="Common Tokens" />
            <i-grid-layout
              id="commonTokenList"
              columnsPerRow={3}
              gap={{ row: '1rem', column: '1rem' }}
              class="common-list" verticalAlignment="center"
            />
          </i-panel>
          <i-panel id="sortBalancePanel" class="token-header">
            <i-label caption="Token" />
            <i-panel class="token-section ml-auto" onClick={() => this.sortBalance()}>
              <i-label class="mr-1" caption="Balance" />
              <i-icon id="iconSortUp" class="icon-sort-up" name="sort-up" />
              <i-icon id="iconSortDown" class="icon-sort-down" name="sort-down" />
            </i-panel>
          </i-panel>
          <i-grid-layout id="tokenList" class="token-list" columnsPerRow={1} />
        </i-modal>
        <import-token id="importTokenModal" />
      </i-panel>
    )
  }
};