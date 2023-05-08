import {
  customElements,
  Module,
  Control,
  ControlElement,
  Button,
  Modal,
  Label,
  application,
  IEventBus,
  Container,
  VStack,
  GridLayout
} from '@ijstech/components';
import { Wallet } from '@ijstech/eth-wallet';
import { EventId, SITE_ENV } from '../global/index';
import {
  connectWallet,
  switchNetwork,
  listsNetworkShow,
  getWalletProvider,
  tokenStore,
  isWalletConnected,
  getWalletPluginProvider,
  initWalletPlugins,
  WalletPlugin,
  getWalletPluginMap
} from '../store/index';
import { walletModalStyle } from './wallet.css';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["disperse-wallet"]: ControlElement;
    }
  }
};

@customElements('disperse-wallet')
export class DisperseWallet extends Module {
  private switchModal: Modal;
  private connectModal: Modal;
  private wallet: Wallet;
  private walletConnectButton: Button;
  private networkGroup: GridLayout;
  private walletListElm: GridLayout;
  private $eventBus: IEventBus;
  private noteNetworkLabel: Label;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.$eventBus = application.EventBus;
    this.registerEvent();
  };

  registerEvent() {
    this.$eventBus.register(this, EventId.ConnectWallet, this.openConnectModal)
    this.$eventBus.register(this, EventId.ChangeNetwork, () => this.showModal('switchModal'))
    this.$eventBus.register(this, EventId.IsWalletConnected, async (connected: boolean) => {
      this.updateList(connected);
    })
    this.$eventBus.register(this, EventId.IsWalletDisconnected, async (connected: boolean) => {
      this.updateList(connected);
    })
    this.$eventBus.register(this, EventId.chainChanged, async (chainId: number) => {
      this.onChainChanged(chainId);
    })
  }

  onChainChanged = async (chainId: number) => {
    let wallet = Wallet.getClientInstance();
    const isConnected = wallet.isConnected;
    this.updateList(isConnected);
    if (!isConnected) {
      const acivedElm = this.networkGroup.querySelector('.is-actived');
      acivedElm && acivedElm.classList.remove('is-actived');
      const connectingElm = this.networkGroup.querySelector(`[data-key="${chainId}"]`);
      connectingElm && connectingElm.classList.add('is-actived');
    }
  };

  async requestAccounts() {
    try {
      await this.wallet.web3.eth.requestAccounts();
    } catch (error) {
      console.error(error);
    }
  }

  async initData() {
    const selectedProvider = localStorage.getItem('walletProvider') as WalletPlugin;
    const isValidProvider = Object.values(WalletPlugin).includes(selectedProvider);
    if (isValidProvider) {
      this.wallet = await connectWallet(selectedProvider);
    }
  }

  showModal(name: string, title: string = '') {
    const modalELm = this[name as 'switchModal' | 'connectModal'];
    title && (modalELm.title = title);
    if (name === 'switchModal') {
      this.updateListNetworkUI();
    }
    modalELm.visible = true;
  }

  isLive(walletPlugin: WalletPlugin) {
    const provider = getWalletPluginProvider(walletPlugin);
    return provider ? provider.installed() && Wallet.getClientInstance().clientSideProvider?.name === walletPlugin : false;
  }

  isNetworkLive(chainId: number) {
    return Wallet.getClientInstance().chainId === chainId;
  }

  async switchNetwork(chainId: number) {
    if (!chainId) return;
    await switchNetwork(chainId);
    this.switchModal.visible = false;
  }

  async connectToProviderFunc(walletPlugin: WalletPlugin) {
    const provider = getWalletPluginProvider(walletPlugin);
    if (provider?.installed()) {
      await connectWallet(walletPlugin);
    }
    else {
      const homepage = provider.homepage;
      window.open(homepage, '_blank');
    }
    this.connectModal.visible = false;
  };

  async renderWalletButton() {
    const modalElm = await Modal.create({
      maxWidth: '200px',
      showBackdrop: false,
      height: 'auto',
      popupPlacement: 'bottomRight'
    })
    modalElm.classList.add("account-dropdown");

    const vstack = await VStack.create({
      gap: '15px'
    });
    const itemCaptions = ["Switch wallet"];
    const itemFunctions = [
      () => this.showModal('connectModal', 'Switch wallet')
    ];

    itemCaptions.forEach(async (caption, i) => {
      const buttonItem = await Button.create({
        caption,
        width: '100%',
        height: 'auto',
        padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }
      });
      buttonItem.onClick = (source: Control, event: Event): boolean => {
        event.stopPropagation();
        modalElm.visible = false;
        itemFunctions[i]();
        return true;
      }
      vstack.appendChild(buttonItem);
      modalElm.item = vstack;
    })

    this.walletConnectButton = await Button.create({
      caption: 'Connect Wallet',
      margin: { left: 8 }
    });
    this.walletConnectButton.classList.add('btn', 'btn-os', 'btn-connect');
    this.walletConnectButton.onClick = this.openConnectModal;
  }

  renderNetworks() {
    this.networkGroup.clearInnerHTML();
    const networksList = listsNetworkShow();
    this.networkGroup.append(...networksList.map((network) => {
      return (
        <i-hstack
          onClick={() => this.switchNetwork(network.chainId)}
          class={this.isNetworkLive(network.chainId) ? 'is-actived list-item' : 'list-item'}
          data-key={network.chainId}
          verticalAlignment="center"
          gap={10}
        >
          <i-image url={network.image} width={32} height={32} display="inline-block" margin={{ left: 12 }} />
          <i-label caption={network.chainName} />
        </i-hstack>
      )
    }));
  }

  openConnectModal = () => {
    this.showModal('connectModal', 'Connect Wallet');
  }

  renderWalletList() {
    let accountsChangedEventHandler = async (account: string) => {
      tokenStore.updateTokenMapData();
    }
    let chainChangedEventHandler = async (hexChainId: number) => {
      tokenStore.updateTokenMapData();
    }
    initWalletPlugins({
      'accountsChanged': accountsChangedEventHandler,
      'chainChanged': chainChangedEventHandler
    });
    this.walletListElm.clearInnerHTML();
    let wallets: any[] = [];
    let walletsDisabled: any[] = [];
    const walletPluginMap = getWalletPluginMap();
    for (let pluginName in walletPluginMap) {
      const walletPlugin = walletPluginMap[pluginName];
      let walletEnabled = this.isWalletEnabled(walletPlugin.name);
      let walletJSX = (
        <i-hstack
          onClick={() => this.connectToProviderFunc(walletPlugin.name)}
          class={this.isLive(walletPlugin.name) ? 'is-actived list-item' : 'list-item'}
          data-key={walletPlugin.name}
          enabled={walletEnabled}
          verticalAlignment="center"
          gap={10}
        >
          <i-image url={walletPlugin.image} width={32} height={32} class="inline-block custom-img" />
          <i-label caption={walletPlugin.displayName} />
        </i-hstack>
      )
      walletEnabled ? wallets.push(walletJSX) : walletsDisabled.push(walletJSX);
    }
    this.walletListElm.append(...wallets);
    this.walletListElm.append(...walletsDisabled);
  }

  updateDot(parent: HTMLElement, connected: boolean, type: 'network' | 'wallet') {
    const acivedElm = parent.querySelector('.is-actived');
    acivedElm && acivedElm.classList.remove('is-actived');

    if (connected) {
      const wallet = Wallet.getClientInstance();
      const connectingVal = type === 'network' ? wallet.chainId : wallet.clientSideProvider?.name;
      const connectingElm = parent.querySelector(`[data-key="${connectingVal}"]`);
      connectingElm && connectingElm.classList.add('is-actived');
    }
  }

  isWalletEnabled(walletName: WalletPlugin) {
    // switch (getSiteEnv()) {
    //   case SITE_ENV.TESTNET: {
    //     switch (walletName) {
    //       case WalletPlugin.ONTOWallet:
    //       case WalletPlugin.Coin98:
    //       case WalletPlugin.TrustWallet:
    //         return false;
    //     }
    //     break;
    //   }
    //   case SITE_ENV.MAINNET: {

    //     break;
    //   }
    //   case SITE_ENV.DEV: {

    //     break;
    //   }
    // }
    return true;
  }

  updateListNetworkUI() {
    const listElm = this.networkGroup?.querySelectorAll('.list-item') || [];
    const isConnected = isWalletConnected();
    const isMetaMask = getWalletProvider() === WalletPlugin.MetaMask;
    for (const elm of listElm) {
      if (isMetaMask || !isConnected) {
        elm.classList.remove('disabled-network-selection');
      } else {
        elm.classList.add('disabled-network-selection');
      }
    }
  }

  updateList(connected: boolean) {
    if (connected) {
      this.noteNetworkLabel.caption = getWalletProvider() === WalletPlugin.MetaMask ?
        'OpenSwap supports the following networks, please click to connect.' :
        'OpenSwap supports the following networks, please switch network in the connected wallet.'
    } else {
      this.noteNetworkLabel.caption = 'OpenSwap supports the following networks, please click to connect.';
    }
    this.updateDot(this.walletListElm, connected, 'wallet');
    this.updateDot(this.networkGroup, connected, 'network');
  }

  connectedCallback() {
    super.connectedCallback();
  }

  getElementProperty(name: string) {
    let value;
    if (this.attrs[name] && this.attrs[name].__target) {
      value = this.getAttributeValue(this.attrs[name].__target, this.attrs[name].__path);
    }
    return value;
  }

  async init() {
    this.classList.add(walletModalStyle);
    super.init();
    await this.renderWalletButton();
    this.renderNetworks();
    this.renderWalletList();
    await this.initData();
  }

  async render() {
    return (
      <i-panel>
        <i-modal
          id="switchModal" title="Supported Network"
          closeIcon={{ name: 'times' }}
          class="os-modal"
        >
          <i-vstack height="100%" class="i-modal_content">
            <i-label id="noteNetworkLabel" class="mt-1 small-label" caption="OpenSwap supports the following networks, please click to connect." />
            <i-panel class="flex networkSection" height="100%">
              <i-grid-layout id="networkGroup" class="list-view networks" columnsPerRow={1} templateRows={['max-content']} />
            </i-panel>
          </i-vstack>
        </i-modal>
        <i-modal
          id="connectModal"
          title="Connect Wallet"
          class="os-modal connect-modal"
          closeIcon={{ name: 'times', fill: '#FF8800' }}
        >
          <i-panel class="i-modal_content">
            <i-label class="mt-1 small-label" caption="Recommended wallet for Chrome" />
            <i-panel padding={{ bottom: 16 }}>
              <i-grid-layout id="walletListElm" class="list-view wallets" columnsPerRow={1} templateRows={['max-content']} />
            </i-panel>
          </i-panel>
        </i-modal>
      </i-panel>
    )
  }
};