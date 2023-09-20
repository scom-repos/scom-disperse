var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-disperse/global/utils/helper.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet"], function (require, exports, components_1, eth_wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.downloadCSVFile = exports.toDisperseData = exports.disperseDataToString = exports.viewOnExplorerByTxHash = exports.formatNumber = exports.formatUTCDate = exports.DefaultDateFormat = exports.explorerTxUrlsByChainId = void 0;
    exports.explorerTxUrlsByChainId = {
        1: 'https://etherscan.io/tx/',
        4: 'https://rinkeby.etherscan.io/tx/',
        42: 'https://kovan.etherscan.io/tx/',
        56: 'https://bscscan.com/tx/',
        97: 'https://testnet.bscscan.com/tx/',
        43113: 'https://testnet.snowtrace.io/tx/',
        43114: 'https://snowtrace.io/tx/',
        137: 'https://polygonscan.com/tx/',
        80001: 'https://mumbai.polygonscan.com/tx/',
        250: 'https://ftmscan.com/tx/',
        4002: 'https://testnet.ftmscan.com/tx/',
        13370: 'https://aminoxtestnet.blockscout.alphacarbon.network/tx/',
        421613: 'https://goerli.arbiscan.io/tx/'
    };
    exports.DefaultDateFormat = 'YYYY/MM/DD HH:mm:ss';
    const formatUTCDate = (date, formatType = exports.DefaultDateFormat) => {
        const formatted = (0, components_1.moment)(date).format(formatType);
        return `${formatted} (UTC+${(0, components_1.moment)().utcOffset() / 60})`;
    };
    exports.formatUTCDate = formatUTCDate;
    const formatNumber = (value, decimalFigures) => {
        if (typeof value === 'object') {
            value = value.toString();
        }
        const minValue = '0.0000001';
        return components_1.FormatUtils.formatNumber(value, { decimalFigures: decimalFigures || 4, minValue });
    };
    exports.formatNumber = formatNumber;
    const viewOnExplorerByTxHash = (chainId, txHash) => {
        if (exports.explorerTxUrlsByChainId[chainId]) {
            let url = `${exports.explorerTxUrlsByChainId[chainId]}${txHash}`;
            window.open(url);
        }
    };
    exports.viewOnExplorerByTxHash = viewOnExplorerByTxHash;
    const delimiters = [",", ":", "=", " "];
    const newline = "[\\r\\n]+"; // one or more of "\r" or "\n" or "\r\n" will be iditified
    const addressReg = /^0x/;
    function isAddress(text) {
        return addressReg.test(text);
    }
    function isAmount(text) {
        return !new eth_wallet_1.BigNumber(text).isNaN();
    }
    function disperseDataToString(data) {
        try {
            return data.reduce((prev, next) => prev += `${next.address},${next.amount.toFixed()}\n`, "");
        }
        catch (error) {
            console.log(data);
            console.log("disperseDataToString", error);
            return "";
        }
    }
    exports.disperseDataToString = disperseDataToString;
    const toDisperseData = (inputText) => {
        let allSep = delimiters.concat(newline);
        const separatorReg = new RegExp(allSep.join('|'));
        let textList = inputText.split(separatorReg).filter(x => x.length);
        let data = [];
        let TextType;
        (function (TextType) {
            TextType[TextType["Address"] = 0] = "Address";
            TextType[TextType["Amount"] = 1] = "Amount";
            TextType[TextType["Other"] = 2] = "Other";
            TextType[TextType["None"] = 3] = "None";
        })(TextType || (TextType = {}));
        function toTextType(text) {
            if (isAddress(text))
                return TextType.Address;
            if (isAmount(text))
                return TextType.Amount;
            return TextType.Other;
        }
        let lastText;
        let savedAddress = null;
        for (let i = 0; i < textList.length; i++) {
            let thisText = toTextType(textList[i]);
            switch (thisText) {
                case TextType.Address: {
                    if (savedAddress)
                        data.push({
                            address: savedAddress,
                            amount: new eth_wallet_1.BigNumber("0")
                        });
                    savedAddress = textList[i];
                    break;
                }
                case TextType.Amount: {
                    if (savedAddress) {
                        data.push({
                            address: savedAddress,
                            amount: new eth_wallet_1.BigNumber(textList[i])
                        });
                    }
                    else {
                        data.push({
                            address: "0x",
                            amount: new eth_wallet_1.BigNumber(textList[i])
                        });
                    }
                    savedAddress = null;
                    break;
                }
                case TextType.Other:
                default:
                    if (savedAddress)
                        data.push({
                            address: savedAddress,
                            amount: new eth_wallet_1.BigNumber("0")
                        });
                    savedAddress = null;
                    break;
            }
            lastText = thisText;
        }
        if (savedAddress)
            data.push({
                address: savedAddress,
                amount: new eth_wallet_1.BigNumber("0")
            });
        return data;
    };
    exports.toDisperseData = toDisperseData;
    const downloadCSVFile = (content, name) => {
        const link = document.createElement("a");
        link.download = name;
        const csvContent = `data:text/csv;charset=utf-8,${content}`;
        const encodedUri = encodeURI(csvContent);
        link.href = encodedUri;
        link.click();
    };
    exports.downloadCSVFile = downloadCSVFile;
});
define("@scom/scom-disperse/global/utils/common.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAddressValid = exports.registerSendTxEvents = void 0;
    const registerSendTxEvents = (sendTxEventHandlers) => {
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        wallet.registerSendTxEvents({
            transactionHash: (error, receipt) => {
                if (sendTxEventHandlers.transactionHash) {
                    sendTxEventHandlers.transactionHash(error, receipt);
                }
            },
            confirmation: (receipt) => {
                if (sendTxEventHandlers.confirmation) {
                    sendTxEventHandlers.confirmation(receipt);
                }
            }
        });
    };
    exports.registerSendTxEvents = registerSendTxEvents;
    const isAddressValid = async (address) => {
        const isValid = window.Web3.utils.isAddress(address);
        return isValid;
    };
    exports.isAddressValid = isAddressValid;
});
define("@scom/scom-disperse/global/utils/index.ts", ["require", "exports", "@scom/scom-disperse/global/utils/helper.ts", "@scom/scom-disperse/global/utils/common.ts"], function (require, exports, helper_1, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-disperse/global/utils/index.ts'/> 
    __exportStar(helper_1, exports);
    __exportStar(common_1, exports);
});
define("@scom/scom-disperse/global/index.ts", ["require", "exports", "@scom/scom-disperse/global/utils/index.ts"], function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(index_1, exports);
});
define("@scom/scom-disperse/store/data/core.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CoreContractAddressesByChainId = void 0;
    ///<amd-module name='@scom/scom-disperse/store/data/core.ts'/> 
    exports.CoreContractAddressesByChainId = {
        1: {
            "Disperse": "",
        },
        4: {
            "Disperse": "",
        },
        42: {
            "Disperse": "",
        },
        56: {
            "Disperse": "",
        },
        97: {
            "Disperse": "0x4DA441Ef3685C5f2eE05c5d2362634e682Cf7100",
        },
        137: {
            "Disperse": "",
        },
        1287: {
            "Disperse": "",
        },
        1337: {
            "Disperse": "",
        },
        31337: {
            "Disperse": "",
        },
        80001: {
            "Disperse": "",
        },
        43114: {
            "Disperse": "0x84DD0bde1A040989dfC5C23C9644a691505880D3",
        },
        43113: {
            "Disperse": "0xf0eFF12AAB1b32385Ec700b9E561FbAAD60F3a44",
        },
        250: {
            "Disperse": "",
        },
        4002: {
            "Disperse": "",
        },
        13370: {
            "Disperse": "",
        }
    };
});
define("@scom/scom-disperse/store/data/dummy.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dummyAddressList = void 0;
    ///<amd-module name='@scom/scom-disperse/store/data/dummy.ts'/> 
    exports.dummyAddressList = [
        "0xFa8e00000001234567899876543210000000Fa8e",
        "0xFa8e11111111234567899876543211111111Fa8e",
        "0xFa8e22222221234567899876543212222222Fa8e"
    ];
});
define("@scom/scom-disperse/store/data/warning.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImportFileWarning = void 0;
    ///<amd-module name='@scom/scom-disperse/store/data/warning.ts'/> 
    var ImportFileWarning;
    (function (ImportFileWarning) {
        ImportFileWarning["Empty"] = "No data found in the imported file.";
        ImportFileWarning["Broken"] = "Data is corrupted. No data were recovered.";
        ImportFileWarning["Corrupted"] = "Data is corrupted. Please double check the recovered data below.";
        ImportFileWarning["Ok"] = "Import Successful. No errors found.";
    })(ImportFileWarning = exports.ImportFileWarning || (exports.ImportFileWarning = {}));
});
define("@scom/scom-disperse/store/data/index.ts", ["require", "exports", "@scom/scom-disperse/store/data/core.ts", "@scom/scom-disperse/store/data/dummy.ts", "@scom/scom-disperse/store/data/warning.ts"], function (require, exports, core_1, dummy_1, warning_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImportFileWarning = exports.dummyAddressList = exports.CoreContractAddressesByChainId = void 0;
    Object.defineProperty(exports, "CoreContractAddressesByChainId", { enumerable: true, get: function () { return core_1.CoreContractAddressesByChainId; } });
    Object.defineProperty(exports, "dummyAddressList", { enumerable: true, get: function () { return dummy_1.dummyAddressList; } });
    Object.defineProperty(exports, "ImportFileWarning", { enumerable: true, get: function () { return warning_1.ImportFileWarning; } });
});
define("@scom/scom-disperse/store/utils.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-disperse/store/data/index.ts", "@ijstech/components", "@scom/scom-network-list", "@scom/scom-disperse/store/data/index.ts"], function (require, exports, eth_wallet_3, index_2, components_2, scom_network_list_1, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isClientWalletConnected = exports.State = void 0;
    __exportStar(index_3, exports);
    const Disperse = "Disperse";
    class State {
        constructor(options) {
            this.networkMap = {};
            this.infuraId = '';
            this.proxyAddresses = {};
            this.embedderCommissionFee = '0';
            this.rpcWalletId = '';
            this.getCommissionAmount = (commissions, amount) => {
                const _commissions = (commissions || []).filter(v => v.chainId == this.getChainId()).map(v => {
                    return {
                        to: v.walletAddress,
                        amount: amount.times(v.share)
                    };
                });
                const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new eth_wallet_3.BigNumber(0);
                return commissionsAmount;
            };
            this.networkMap = (0, scom_network_list_1.default)();
            this.initData(options);
        }
        initRpcWallet(defaultChainId) {
            var _a, _b, _c;
            if (this.rpcWalletId) {
                return this.rpcWalletId;
            }
            const clientWallet = eth_wallet_3.Wallet.getClientInstance();
            const networkList = Object.values(((_a = components_2.application.store) === null || _a === void 0 ? void 0 : _a.networkMap) || []);
            const instanceId = clientWallet.initRpcWallet({
                networks: networkList,
                defaultChainId,
                infuraId: (_b = components_2.application.store) === null || _b === void 0 ? void 0 : _b.infuraId,
                multicalls: (_c = components_2.application.store) === null || _c === void 0 ? void 0 : _c.multicalls
            });
            this.rpcWalletId = instanceId;
            if (clientWallet.address) {
                const rpcWallet = eth_wallet_3.Wallet.getRpcWalletInstance(instanceId);
                rpcWallet.address = clientWallet.address;
            }
            return instanceId;
        }
        initData(options) {
            if (options.infuraId) {
                this.infuraId = options.infuraId;
            }
            if (options.networks) {
                this.setNetworkList(options.networks, options.infuraId);
            }
            if (options.proxyAddresses) {
                this.proxyAddresses = options.proxyAddresses;
            }
            if (options.embedderCommissionFee) {
                this.embedderCommissionFee = options.embedderCommissionFee;
            }
        }
        setNetworkList(networkList, infuraId) {
            const wallet = eth_wallet_3.Wallet.getClientInstance();
            this.networkMap = {};
            const defaultNetworkList = (0, scom_network_list_1.default)();
            const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
                acc[cur.chainId] = cur;
                return acc;
            }, {});
            for (let network of networkList) {
                const networkInfo = defaultNetworkMap[network.chainId];
                if (!networkInfo)
                    continue;
                if (infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
                    for (let i = 0; i < network.rpcUrls.length; i++) {
                        network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, infuraId);
                    }
                }
                this.networkMap[network.chainId] = Object.assign(Object.assign({}, networkInfo), network);
                wallet.setNetworkInfo(this.networkMap[network.chainId]);
            }
        }
        getProxyAddress(chainId) {
            const _chainId = chainId || eth_wallet_3.Wallet.getInstance().chainId;
            const proxyAddresses = this.proxyAddresses;
            if (proxyAddresses) {
                return proxyAddresses[_chainId];
            }
            return null;
        }
        getRpcWallet() {
            return this.rpcWalletId ? eth_wallet_3.Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
        }
        isRpcWalletConnected() {
            const wallet = this.getRpcWallet();
            return wallet === null || wallet === void 0 ? void 0 : wallet.isConnected;
        }
        getChainId() {
            const rpcWallet = this.getRpcWallet();
            return rpcWallet === null || rpcWallet === void 0 ? void 0 : rpcWallet.chainId;
        }
        getDisperseAddress(chainId) {
            const address = index_2.CoreContractAddressesByChainId[chainId || this.getChainId()];
            return address ? address[Disperse] : null;
        }
        getCurrentCommissions(commissions) {
            return (commissions || []).filter(v => v.chainId == this.getChainId());
        }
        async setApprovalModelAction(options) {
            const approvalOptions = Object.assign(Object.assign({}, options), { spenderAddress: '' });
            let wallet = this.getRpcWallet();
            this.approvalModel = new eth_wallet_3.ERC20ApprovalModel(wallet, approvalOptions);
            let approvalModelAction = this.approvalModel.getAction();
            return approvalModelAction;
        }
    }
    exports.State = State;
    function isClientWalletConnected() {
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        return wallet.isConnected;
    }
    exports.isClientWalletConnected = isClientWalletConnected;
});
define("@scom/scom-disperse/store/index.ts", ["require", "exports", "@scom/scom-disperse/store/utils.ts"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-disperse/store/index.ts'/> 
    __exportStar(utils_1, exports);
});
define("@scom/scom-disperse/disperse-utils/index.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-commission-proxy-contract", "@scom/scom-disperse-contract"], function (require, exports, eth_wallet_4, scom_commission_proxy_contract_1, scom_disperse_contract_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onDisperse = void 0;
    const onDisperse = async (state, disperseData) => {
        const { token, data, commissions } = disperseData;
        const wallet = eth_wallet_4.Wallet.getClientInstance();
        const disperseAddress = state.getDisperseAddress();
        const disperseContract = new scom_disperse_contract_1.Contracts.Disperse(wallet, disperseAddress);
        const amount = eth_wallet_4.Utils.toDecimals(data.reduce((pv, cv) => pv.plus(cv.amount), new eth_wallet_4.BigNumber('0'))).dp(0);
        const _commissions = (commissions || []).filter(v => v.chainId == state.getChainId()).map(v => {
            return {
                to: v.walletAddress,
                amount: amount.times(v.share).dp(0)
            };
        });
        const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)).dp(0) : new eth_wallet_4.BigNumber(0);
        const tokenDecimals = token.decimals || 18;
        const recipients = data.map(d => d.address);
        const values = data.map(d => d.amount.shiftedBy(tokenDecimals));
        let receipt;
        try {
            if (_commissions.length) {
                const proxyAddress = state.getProxyAddress();
                const proxy = new scom_commission_proxy_contract_1.Contracts.Proxy(wallet, proxyAddress);
                const tokensIn = {
                    token: token.address || eth_wallet_4.Utils.nullAddress,
                    amount: amount.plus(commissionsAmount),
                    directTransfer: false,
                    commissions: _commissions
                };
                let txData;
                if (token === null || token === void 0 ? void 0 : token.address) {
                    txData = await disperseContract.disperseToken.txData({ token: token.address, recipients, values });
                }
                else {
                    txData = await disperseContract.disperseEther.txData({ recipients, values }, values.reduce((p, n) => p.plus(n)));
                }
                receipt = await proxy.proxyCall({
                    target: disperseAddress,
                    tokensIn: [
                        tokensIn
                    ],
                    data: txData,
                    to: wallet.address,
                    tokensOut: []
                }, tokensIn.amount);
            }
            else {
                if (token === null || token === void 0 ? void 0 : token.address) {
                    receipt = await disperseContract.disperseToken({ token: token.address, recipients, values });
                }
                else {
                    receipt = await disperseContract.disperseEther({ recipients, values }, values.reduce((p, n) => p.plus(n)));
                }
            }
        }
        catch (err) {
            return { receipt: null, error: err };
        }
        return { receipt };
    };
    exports.onDisperse = onDisperse;
});
define("@scom/scom-disperse/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tokenModalStyle = exports.disperseStyle = exports.disperseLayout = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    const colorVar = {
        primaryButton: 'transparent linear-gradient(270deg, #FF9900 0%, #FC7428 100%) 0% 0% no-repeat padding-box',
        primaryGradient: 'linear-gradient(270deg, #FF9900 0%, #FC7428 100%)',
        darkBg: '#181E3E 0% 0% no-repeat padding-box',
        primaryDisabled: 'transparent linear-gradient(270deg, #7B7B7B 0%, #929292 100%) 0% 0% no-repeat padding-box'
    };
    exports.disperseLayout = components_3.Styles.style({
        background: Theme.background.main,
        marginInline: 'auto',
        $nest: {
            'i-button': {
                color: '#fff',
                $nest: {
                    'i-icon.is-spin': {
                        fill: '#fff !important'
                    },
                    'svg': {
                        fill: '#fff !important'
                    }
                }
            },
            '.template-layout': {
                maxWidth: '1200px',
                marginInline: 'auto',
            },
            '.container-layout': {
                width: '100%',
                padding: '0 10px',
            },
            '.btn-os': {
                background: colorVar.primaryButton,
                height: 'auto !important',
                color: '#fff',
                transition: 'background .3s ease',
                fontSize: '1rem',
                $nest: {
                    'i-icon.loading-icon': {
                        marginInline: '0.25rem',
                        width: '16px !important',
                        height: '16px !important',
                    },
                },
            },
            '.btn-os:not(.disabled):not(.is-spinning):hover, .btn-os:not(.disabled):not(.is-spinning):focus': {
                background: colorVar.primaryGradient,
                backgroundColor: 'transparent',
                boxShadow: 'none',
                opacity: 0.9
            },
            '.btn-os:not(.disabled):not(.is-spinning):focus': {
                boxShadow: '0 0 0 0.2rem rgb(0 123 255 / 25%)'
            },
            '.btn-os.disabled, .btn-os.is-spinning': {
                background: colorVar.primaryDisabled,
                opacity: 0.9,
                $nest: {
                    '&:hover': {
                        background: `${colorVar.primaryDisabled} !important`,
                    }
                }
            },
            '.break-word': {
                wordBreak: 'break-word',
            },
            '.text-right': {
                textAlign: 'right',
            },
            'i-modal': {
                $nest: {
                    '.modal': {
                        background: Theme.background.modal
                    },
                    '.i-modal_header': {
                        marginBottom: '1rem',
                        paddingBlock: '0.5rem',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        $nest: {
                            'span': {
                                fontWeight: 700,
                                fontSize: '1rem',
                                color: Theme.colors.primary.main
                            }
                        },
                    },
                },
            },
            '.hidden': {
                display: 'none !important'
            }
        }
    });
    exports.disperseStyle = components_3.Styles.style({
        $nest: {
            'i-hstack.disabled': {
                opacity: '0.5',
            },
            '.link-icon > svg': {
                width: '20px',
            },
            '.text-overflow': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
            '#tokenElm': {
                cursor: 'pointer',
                borderColor: '#9C9C9C',
                padding: '15px 10px !important',
                $nest: {
                    '&.disabled': {
                        cursor: 'default',
                        borderColor: '#F29224'
                    },
                    'i-icon svg': {
                        fill: Theme.text.primary
                    }
                }
            },
            '.csv-button': {
                background: '#34343A',
                height: 45,
                width: 170,
                cursor: 'pointer',
                $nest: {
                    '*': {
                        fontSize: 18,
                        fontWeight: 'bold',
                    },
                    '&:hover': {
                        background: '#505050 !important',
                    },
                    '&.disabled': {
                        cursor: 'default',
                        background: 'linear-gradient(270deg, #7B7B7B 0%, #929292 100%)',
                        opacity: 0.9,
                    },
                },
            },
            '.input-batch': {
                $nest: {
                    'textarea': {
                        background: Theme.input.background,
                        color: Theme.input.fontColor,
                        padding: '0.5rem 0.75rem',
                        borderRadius: '10px',
                        border: 'none',
                        height: '170px !important',
                        resize: 'none',
                        outline: 'none',
                        $nest: {
                            '&::placeholder': {
                                color: Theme.input.fontColor,
                                opacity: 0.8
                            },
                            '&:focus::placeholder': {
                                opacity: 0
                            },
                        },
                    },
                },
            },
            '.custom-scroll': {
                $nest: {
                    '::-webkit-scrollbar-track': {
                        background: '#FFB82F',
                    },
                    '::-webkit-scrollbar': {
                        width: '5px',
                    },
                    '::-webkit-scrollbar-thumb': {
                        background: '#FF8800',
                        borderRadius: '5px',
                    },
                },
            },
            '.bg-modal': {
                $nest: {
                    '.modal': {
                        background: Theme.background.modal,
                        width: 420,
                        maxWidth: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '1rem',
                        color: Theme.text.primary
                    },
                }
            },
            '.ml-auto': {
                marginLeft: 'auto',
            },
            '.step-elm': {
                flexWrap: 'wrap',
                gap: '10px',
                padding: '15px 10px !important',
                $nest: {
                    '&#thirdStepElm': {
                        paddingInline: '0 !important'
                    }
                }
            },
            '#containerUserInfo > i-vstack': {
                gap: '8px !important'
            },
            '#secondStepElm > i-hstack': {
                flexWrap: 'wrap',
            },
            '#thirdStepElm > i-vstack': {
                maxWidth: '100%',
                width: '100% !important',
                flexWrap: 'wrap',
                $nest: {
                    '&> i-hstack': {
                        flexWrap: 'wrap',
                        width: '100%',
                    },
                    '.custom-scroll': {
                        overflow: 'auto',
                        $nest: {
                            '&::-webkit-scrollbar-track': {
                                background: '#FFB82F',
                            },
                            '&::-webkit-scrollbar': {
                                height: '8px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#FF8800',
                                borderRadius: '3px',
                            }
                        }
                    },
                    '.address-elm': {
                        minWidth: '650px',
                    },
                    '.step-3': {
                        height: 'auto !important',
                        width: '100% !important',
                        padding: '20px !important',
                    }
                }
            }
        },
    });
    exports.tokenModalStyle = components_3.Styles.style({
        $nest: {
            '.i-modal_header': {
                display: 'none'
            },
            '#gridTokenList': {
                maxHeight: '50vh',
                overflow: 'auto',
                $nest: {
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar': {
                        width: '5px',
                        height: '5px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#FF8800',
                        borderRadius: '5px'
                    }
                }
            },
            '#pnlSortBalance': {
                $nest: {
                    '.icon-sort-up': {
                        top: 1
                    },
                    '.icon-sort-down': {
                        bottom: 1
                    },
                    'i-icon svg': {
                        fill: 'inherit'
                    }
                }
            }
        }
    });
});
define("@scom/scom-disperse/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-disperse/data.json.ts'/> 
    const InfuraId = "adc596bf88b648e2a8902bc9093930c5";
    exports.default = {
        "infuraId": InfuraId,
        "networks": [
            {
                "chainId": 97,
                "explorerName": "BSCScan",
                "explorerTxUrl": "https://testnet.bscscan.com/tx/",
                "explorerAddressUrl": "https://testnet.bscscan.com/address/",
            },
            {
                "chainId": 43113,
                "explorerName": "SnowTrace",
                "explorerTxUrl": "https://testnet.snowtrace.io/tx/",
                "explorerAddressUrl": "https://testnet.snowtrace.io/address/",
            }
        ],
        "proxyAddresses": {
            "97": "0x9602cB9A782babc72b1b6C96E050273F631a6870",
            "43113": "0x7f1EAB0db83c02263539E3bFf99b638E61916B96"
        },
        "embedderCommissionFee": "0.01",
        "defaultBuilderData": {
            "defaultChainId": 43113,
            "networks": [
                {
                    "chainId": 43113
                },
                {
                    "chainId": 97
                }
            ],
            "wallets": [
                {
                    "name": "metamask"
                }
            ]
        }
    };
});
define("@scom/scom-disperse/formSchema.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-disperse/formSchema.json.ts'/> 
    const theme = {
        backgroundColor: {
            type: 'string',
            format: 'color'
        },
        fontColor: {
            type: 'string',
            format: 'color'
        },
        secondaryColor: {
            type: 'string',
            title: 'Block Background Color',
            format: 'color'
        },
        secondaryFontColor: {
            type: 'string',
            title: 'Step Font Color',
            format: 'color'
        },
        inputBackgroundColor: {
            type: 'string',
            format: 'color'
        },
        inputFontColor: {
            type: 'string',
            format: 'color'
        },
        // buttonBackgroundColor: {
        // 	type: 'string',
        // 	format: 'color'
        // },
        // buttonFontColor: {
        // 	type: 'string',
        // 	format: 'color'
        // }
    };
    exports.default = {
        general: {
            dataSchema: {
                type: 'object',
                properties: {}
            }
        },
        theme: {
            dataSchema: {
                type: 'object',
                properties: {
                    "dark": {
                        type: 'object',
                        properties: theme
                    },
                    "light": {
                        type: 'object',
                        properties: theme
                    }
                }
            }
        }
    };
});
define("@scom/scom-disperse/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let moduleDir = components_4.application.currentModuleDir;
    function fullPath(path) {
        if (path.indexOf('://') > 0)
            return path;
        return `${moduleDir}/${path}`;
    }
    exports.default = {
        fullPath
    };
});
define("@scom/scom-disperse", ["require", "exports", "@ijstech/components", "@scom/scom-disperse/global/index.ts", "@scom/scom-disperse/store/index.ts", "@ijstech/eth-wallet", "@scom/scom-disperse/disperse-utils/index.ts", "@scom/scom-disperse/index.css.ts", "@scom/scom-token-list", "@scom/scom-commission-fee-setup", "@scom/scom-disperse/data.json.ts", "@scom/scom-disperse/formSchema.json.ts", "@scom/scom-disperse/assets.ts"], function (require, exports, components_5, index_4, index_5, eth_wallet_5, index_6, index_css_1, scom_token_list_1, scom_commission_fee_setup_1, data_json_1, formSchema_json_1, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_5.application.currentModuleDir;
    // import { jsPDF } from 'jspdf';
    // import autoTable from 'jspdf-autotable';
    const Theme = components_5.Styles.Theme.ThemeVars;
    let ScomDisperse = class ScomDisperse extends components_5.Module {
        getData() {
            return this._data;
        }
        async resetRpcWallet() {
            var _a;
            this.removeRpcWalletEvents();
            const rpcWalletId = await this.state.initRpcWallet(this.defaultChainId);
            const rpcWallet = this.rpcWallet;
            const chainChangedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_5.Constants.RpcWalletEvent.ChainChanged, async (chainId) => {
                this.onChainChanged();
            });
            const connectedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_5.Constants.RpcWalletEvent.Connected, async (connected) => {
                this.updateContractAddress();
                this.onWalletConnect((0, index_5.isClientWalletConnected)());
            });
            this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
            const data = {
                defaultChainId: this.defaultChainId,
                wallets: this.wallets,
                networks: this.networks,
                showHeader: this.showHeader,
                rpcWalletId: rpcWallet.instanceId
            };
            if ((_a = this.dappContainer) === null || _a === void 0 ? void 0 : _a.setData)
                this.dappContainer.setData(data);
        }
        async setData(data) {
            this._data = data;
            await this.resetRpcWallet();
            await this.updateTokenModal();
            await this.refreshUI();
        }
        updateTag(type, value) {
            var _a;
            this.tag[type] = (_a = this.tag[type]) !== null && _a !== void 0 ? _a : {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.tag[type][prop] = value[prop];
            }
        }
        async setTag(value) {
            const newValue = value || {};
            for (let prop in newValue) {
                if (newValue.hasOwnProperty(prop)) {
                    if (prop === 'light' || prop === 'dark')
                        this.updateTag(prop, newValue[prop]);
                    else
                        this.tag[prop] = newValue[prop];
                }
            }
            if (this.dappContainer)
                this.dappContainer.setTag(this.tag);
            this.updateTheme();
        }
        async getTag() {
            return this.tag;
        }
        updateStyle(name, value) {
            value ?
                this.style.setProperty(name, value) :
                this.style.removeProperty(name);
        }
        updateTheme() {
            var _a, _b, _c, _d, _e, _f, _g;
            const themeVar = ((_a = this.dappContainer) === null || _a === void 0 ? void 0 : _a.theme) || 'light';
            this.updateStyle('--text-primary', (_b = this.tag[themeVar]) === null || _b === void 0 ? void 0 : _b.fontColor);
            this.updateStyle('--background-main', (_c = this.tag[themeVar]) === null || _c === void 0 ? void 0 : _c.backgroundColor);
            this.updateStyle('--input-font_color', (_d = this.tag[themeVar]) === null || _d === void 0 ? void 0 : _d.inputFontColor);
            this.updateStyle('--input-background', (_e = this.tag[themeVar]) === null || _e === void 0 ? void 0 : _e.inputBackgroundColor);
            // this.updateStyle('--colors-primary-main', this.tag[themeVar]?.buttonBackgroundColor);
            // this.updateStyle('--colors-primary-contrast_text', this.tag[themeVar]?.buttonFontColor);
            this.updateStyle('--colors-secondary-main', (_f = this.tag[themeVar]) === null || _f === void 0 ? void 0 : _f.secondaryColor);
            this.updateStyle('--colors-secondary-contrast_text', (_g = this.tag[themeVar]) === null || _g === void 0 ? void 0 : _g.secondaryFontColor);
        }
        getActions(category) {
            const self = this;
            const actions = [
                {
                    name: 'Commissions',
                    icon: 'dollar-sign',
                    command: (builder, userInputData) => {
                        let _oldData = {
                            defaultChainId: 0,
                            wallets: [],
                            networks: []
                        };
                        return {
                            execute: async () => {
                                _oldData = Object.assign({}, this._data);
                                if (userInputData.commissions)
                                    this._data.commissions = userInputData.commissions;
                                this.refreshUI();
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this._data);
                            },
                            undo: () => {
                                this._data = Object.assign({}, _oldData);
                                this.refreshUI();
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this._data);
                            },
                            redo: () => { }
                        };
                    },
                    customUI: {
                        render: (data, onConfirm) => {
                            const vstack = new components_5.VStack();
                            const config = new scom_commission_fee_setup_1.default(null, {
                                commissions: self._data.commissions,
                                fee: this.state.embedderCommissionFee,
                                networks: self._data.networks
                            });
                            const hstack = new components_5.HStack(null, {
                                verticalAlignment: 'center',
                            });
                            const button = new components_5.Button(hstack, {
                                caption: 'Confirm',
                                width: '100%',
                                height: 40,
                                font: { color: Theme.colors.primary.contrastText }
                            });
                            vstack.append(config);
                            vstack.append(hstack);
                            button.onClick = async () => {
                                const commissions = config.commissions;
                                if (onConfirm)
                                    onConfirm(true, { commissions });
                            };
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
                //         await this.resetRpcWallet();
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
                actions.push({
                    name: 'Theme Settings',
                    icon: 'palette',
                    command: (builder, userInputData) => {
                        let oldTag = {};
                        return {
                            execute: async () => {
                                if (!userInputData)
                                    return;
                                oldTag = JSON.parse(JSON.stringify(this.tag));
                                if (builder)
                                    builder.setTag(userInputData);
                                else
                                    this.setTag(userInputData);
                                if (this.dappContainer)
                                    this.dappContainer.setTag(userInputData);
                            },
                            undo: () => {
                                if (!userInputData)
                                    return;
                                this.tag = JSON.parse(JSON.stringify(oldTag));
                                if (builder)
                                    builder.setTag(this.tag);
                                else
                                    this.setTag(this.tag);
                                if (this.dappContainer)
                                    this.dappContainer.setTag(this.tag);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: formSchema_json_1.default.theme.dataSchema
                });
            }
            return actions;
        }
        getConfigurators() {
            let self = this;
            return [
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: (category) => {
                        return this.getActions(category);
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        const defaultData = data_json_1.default.defaultBuilderData;
                        await this.setData(Object.assign(Object.assign({}, defaultData), data));
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
                        };
                    },
                    setLinkParams: async (params) => {
                        if (params.data) {
                            const decodedString = window.atob(params.data);
                            const commissions = JSON.parse(decodedString);
                            let resultingData = Object.assign(Object.assign({}, self._data), { commissions });
                            await this.setData(resultingData);
                        }
                    },
                    bindOnChanged: (element, callback) => {
                        element.onChanged = async (data) => {
                            let resultingData = Object.assign(Object.assign({}, self._data), data);
                            await this.setData(resultingData);
                            await callback(data);
                        };
                    },
                    getData: () => {
                        const fee = this.state.embedderCommissionFee;
                        return Object.assign(Object.assign({}, this.getData()), { fee });
                    },
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        DummyDisperseData() {
            return [
                {
                    address: index_5.dummyAddressList[0],
                    amount: new eth_wallet_5.BigNumber(100.1)
                },
                {
                    address: index_5.dummyAddressList[1],
                    amount: new eth_wallet_5.BigNumber(5.8)
                },
                {
                    address: index_5.dummyAddressList[2],
                    amount: new eth_wallet_5.BigNumber(333)
                }
            ];
        }
        async refreshUI() {
            this.onLoad();
        }
        constructor(parent, options) {
            super(parent, options);
            this.resultAddresses = [];
            this._data = {
                defaultChainId: 0,
                wallets: [],
                networks: []
            };
            this.tag = {};
            this.defaultEdit = true;
            this.rpcWalletEvents = [];
            this.onWalletConnect = async (connected) => {
                this.updateButtons();
                const rpcWallet = this.rpcWallet;
                if (connected && rpcWallet.address) {
                    await this.updateTokenModal();
                    await scom_token_list_1.tokenStore.updateAllTokenBalances(rpcWallet);
                }
                await this.checkStepStatus(connected);
            };
            this.onChainChanged = async () => {
                this.resetData(false);
                await this.onWalletConnect((0, index_5.isClientWalletConnected)());
            };
            this.updateTokenModal = async () => {
                const rpcWallet = this.rpcWallet;
                if (!this.mdToken.isConnected)
                    await this.mdToken.ready();
                if (this.mdToken.rpcWalletId !== rpcWallet.instanceId) {
                    this.mdToken.rpcWalletId = rpcWallet.instanceId;
                }
            };
            this.checkStepStatus = async (connected) => {
                this.firstStepElm.enabled = connected;
                this.tokenElm.enabled = connected;
                if (!connected) {
                    this.mdToken.token = undefined;
                    this.onSelectToken(null);
                }
                this.setThirdStatus(!!this.token);
                this.updateCommissionsTooltip();
                await this.initWallet();
                if (this.state.isRpcWalletConnected()) {
                    await this.initApprovalModelAction();
                }
                this.updateContractAddress();
            };
            this.setThirdStatus = (enabled) => {
                this.secondStepElm.enabled = enabled;
                this.inputBatch.enabled = enabled;
                this.btnImport.enabled = enabled;
                this.setFourthStatus();
            };
            this.setFourthStatus = async () => {
                var _a;
                if ((0, index_5.isClientWalletConnected)() && this.hasAddress) {
                    this.btnDownload.enabled = true;
                    this.containerElm.minHeight = '1000px';
                    this.thirdStepElm.visible = true;
                    const symbol = ((_a = this.token) === null || _a === void 0 ? void 0 : _a.symbol) || '';
                    this.addressesElm.clearInnerHTML();
                    let countInvalid = 0;
                    for (const item of this.listAddresses) {
                        const valid = await (0, index_4.isAddressValid)(item.address);
                        if (!valid) {
                            ++countInvalid;
                        }
                        this.addressesElm.appendChild(this.$render("i-hstack", { width: "100%", verticalAlignment: "center", gap: 30 },
                            this.$render("i-vstack", { width: 450 },
                                this.$render("i-label", { caption: item.address, opacity: 0.75, font: { size: '16px', color: valid ? Theme.text.primary : '#F05E61' } })),
                            this.$render("i-label", { caption: `${item.amount.toFixed()} ${symbol}`, opacity: 0.75, font: { size: '16px' }, class: "text-right" })));
                    }
                    ;
                    this.totalElm.caption = `${(0, index_4.formatNumber)(this.total)} ${symbol}`;
                    this.balanceElm.caption = `${(0, index_4.formatNumber)(this.balance)} ${symbol}`;
                    this.remainingElm.caption = `${(0, index_4.formatNumber)(this.remaining)} ${symbol}`;
                    if (countInvalid) {
                        this.invalidElm.caption = `There ${countInvalid === 1 ? 'is' : 'are'} ${countInvalid} invalid ${countInvalid === 1 ? 'address' : 'addresses'}!`;
                        this.invalidElm.visible = true;
                        this.btnApprove.caption = 'Approve';
                        this.btnApprove.enabled = false;
                        this.btnDisperse.enabled = false;
                    }
                    else {
                        this.invalidElm.visible = false;
                        this.checkAllowance();
                    }
                }
                else {
                    this.containerElm.minHeight = '600px';
                    this.thirdStepElm.visible = false;
                    this.btnDownload.enabled = false;
                }
            };
            this.onSelectToken = (token) => {
                this.token = token;
                this.tokenInfoElm.clearInnerHTML();
                if (token) {
                    const img = scom_token_list_1.assets.tokenPath(token, this.chainId);
                    this.tokenInfoElm.appendChild(this.$render("i-hstack", { gap: "16px", verticalAlignment: "center" },
                        this.$render("i-image", { width: 40, height: 40, minWidth: 30, url: img, fallbackUrl: assets_1.default.fullPath('img/token-placeholder.svg') }),
                        this.$render("i-label", { caption: `$${token.symbol}`, font: { size: '20px' } }),
                        this.$render("i-label", { caption: token.address || token.symbol, font: { size: '16px' }, class: "break-word" })));
                }
                else {
                    this.tokenInfoElm.appendChild(this.$render("i-label", { caption: "Please Select Token", font: { size: '16px' }, opacity: 0.75 }));
                }
                this.setThirdStatus(!!token);
            };
            this.onDisperseAgain = () => {
                var _a, _b;
                this.containerElm.visible = true;
                this.resultElm.visible = false;
                const parent = (_b = (_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentElement;
                if (parent) {
                    parent.scrollTop = 0;
                }
            };
            this.onDownloadReport = (data) => {
                const doc = new window.jsPDF();
                const logo = assets_1.default.fullPath('./img/sc-header.png');
                const totalAmount = this.resultAddresses.reduce((pv, cv) => pv.plus(cv.amount), new eth_wallet_5.BigNumber('0'));
                const rows = this.resultAddresses.map(item => [item.address, (0, index_4.formatNumber)(item.amount)]);
                rows.push(['Total', (0, index_4.formatNumber)(totalAmount)]);
                // doc.addImage(logo, 'png', 15, 10, 20, 24);
                doc.setFontSize(36);
                doc.setFont('helvetica', 'bold');
                doc.text('Disperse Result', 42, 26.5);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                doc.text(`Transaction Hash: ${data.receipt}`, 15, 42);
                doc.text(`Timestamp: ${data.timestamp}`, 15, 50);
                doc.text(`From Address: ${data.address}`, 15, 58);
                doc.text(`Total Amount: ${(0, index_4.formatNumber)(totalAmount)} ${data.symbol}`, 15, 66);
                const cols = ['TRANSFER TO', 'TRANSFER AMOUNT'];
                const table = [cols, ...rows];
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
            };
            this.onDownloadFile = (isResult) => {
                let content = '';
                const arr = isResult ? this.resultAddresses : this.listAddresses;
                arr.forEach((item) => {
                    content += `${item.address},${item.amount.toFixed()}\r\n`;
                });
                (0, index_4.downloadCSVFile)(content, 'disperse.csv');
            };
            this.onImportFile = () => {
                var _a, _b;
                (_b = (_a = this.importFileElm.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild) === null || _b === void 0 ? void 0 : _b.click();
            };
            this.onInputBatch = () => {
                this.setFourthStatus();
            };
            this.convertCSVToText = (result) => {
                if (!result)
                    this.showImportCSVError(index_5.ImportFileWarning.Broken);
                const arr = (0, index_4.toDisperseData)(result.replace(/"/g, ''));
                if (arr.length > 0) {
                    let text = arr.reduce((prev, next, idx) => prev += `${idx ? '\n' : ''}${next.address}, ${next.amount.toFixed()}`, "");
                    this.inputBatch.value = text;
                }
                else {
                    this.showImportCSVError(index_5.ImportFileWarning.Empty);
                }
                this.setFourthStatus();
            };
            this.initInputFile = () => {
                var _a;
                this.importFileElm.caption = '<input type="file" accept=".csv, .txt" />';
                const inputElm = (_a = this.importFileElm.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild;
                if (inputElm) {
                    inputElm.onchange = (event) => {
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
                        };
                    };
                }
            };
            this.resetData = async (updateBalance) => {
                this.updateButtons();
                const rpcWallet = this.rpcWallet;
                scom_token_list_1.tokenStore.updateTokenMapData(this.chainId);
                if (updateBalance && rpcWallet.address)
                    await scom_token_list_1.tokenStore.updateAllTokenBalances(rpcWallet);
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
                await this.checkStepStatus((0, index_5.isClientWalletConnected)());
            };
            this.showMessage = (status, content) => {
                this.txStatusModal.message = {
                    status,
                    content,
                };
                this.txStatusModal.showModal();
            };
            this.setEnabledStatus = (enabled) => {
                this.tokenElm.onClick = () => enabled ? this.mdToken.showModal() : {};
                this.tokenElm.enabled = enabled;
                this.btnImport.enabled = enabled;
                this.inputBatch.enabled = enabled;
            };
            this.updateCommissionsTooltip = () => {
                const commissionFee = new eth_wallet_5.BigNumber(this.state.embedderCommissionFee);
                if (commissionFee.gt(0) && this.state.getCurrentCommissions(this.commissions).length) {
                    this.iconTotal.visible = true;
                    this.iconTotal.tooltip.content = `A commission fee of ${commissionFee.times(100)}% will be applied to the total amount you input.`;
                }
                else {
                    this.iconTotal.visible = false;
                }
            };
            this.updateContractAddress = () => {
                var _a;
                if (this.state.getCurrentCommissions(this.commissions).length) {
                    this.contractAddress = this.state.getProxyAddress();
                }
                else {
                    this.contractAddress = this.state.getDisperseAddress();
                }
                if ((_a = this.state) === null || _a === void 0 ? void 0 : _a.approvalModel) {
                    this.state.approvalModel.spenderAddress = this.contractAddress;
                }
            };
            this.initApprovalModelAction = async () => {
                if (this.approvalModelAction) {
                    this.state.approvalModel.spenderAddress = this.contractAddress;
                    return;
                }
                this.approvalModelAction = await this.state.setApprovalModelAction({
                    sender: this,
                    payAction: async () => {
                        await this.handleDisperse();
                    },
                    onToBeApproved: async (token) => {
                        this.btnApprove.caption = 'Approve';
                        this.btnApprove.enabled = true;
                        this.btnDisperse.enabled = false;
                    },
                    onToBePaid: async (token) => {
                        this.btnApprove.caption = 'Approved';
                        this.btnApprove.enabled = false;
                        this.btnDisperse.enabled = this.remaining.gte(0) && this.total.gt(0);
                    },
                    onApproving: async (token, receipt) => {
                        if (receipt) {
                            this.showMessage('success', receipt);
                            this.btnApprove.rightIcon.visible = true;
                            this.btnApprove.caption = 'Approving';
                            this.setEnabledStatus(false);
                        }
                    },
                    onApproved: async (token) => {
                        this.btnApprove.rightIcon.visible = false;
                        this.btnApprove.caption = this.btnApprove.enabled ? 'Approve' : 'Approved';
                        this.btnDisperse.enabled = !this.btnApprove.enabled && this.remaining.gte(0);
                        this.setEnabledStatus(true);
                    },
                    onApprovingError: async (token, err) => {
                        this.showMessage('error', err);
                    },
                    onPaying: async (receipt) => { },
                    onPaid: async () => { },
                    onPayingError: async (err) => { }
                });
                this.state.approvalModel.spenderAddress = this.contractAddress;
            };
            this.checkAllowance = async () => {
                if (!this.token)
                    return;
                if (this.remaining.lt(0) || !this.state.isRpcWalletConnected()) {
                    this.btnApprove.caption = 'Approve';
                    this.btnApprove.enabled = false;
                    this.btnDisperse.enabled = false;
                    return;
                }
                if (this.token.isNative) {
                    this.btnApprove.enabled = false;
                    this.btnDisperse.enabled = true;
                }
                else {
                    await this.initApprovalModelAction();
                    await this.approvalModelAction.checkAllowance(this.token, this.total.toFixed());
                }
            };
            this.handleApprove = async () => {
                if (!this.token)
                    return;
                this.showMessage('warning', `Approving ${this.token.symbol}`);
                this.approvalModelAction.doApproveAction(this.token, this.total.toFixed());
            };
            this.handleDisperse = async () => {
                const token = Object.assign({}, this.token);
                if (!token)
                    return;
                this.resultAddresses = [...this.listAddresses];
                let receipt = '';
                let timestamp = '';
                const address = eth_wallet_5.Wallet.getClientInstance().address;
                this.showMessage('warning', 'Dispersing');
                const callBackActions = async (err, _receipt) => {
                    if (err) {
                        this.showMessage('error', err);
                    }
                    else if (_receipt) {
                        timestamp = (0, index_4.formatUTCDate)((0, components_5.moment)());
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
                (0, index_4.registerSendTxEvents)({
                    transactionHash: callBackActions,
                    confirmation: confirmationCallBackActions
                });
                const { error } = await (0, index_6.onDisperse)(this.state, { token, data: this.listAddresses, commissions: this.commissions });
                if (error) {
                    this.showMessage('error', error);
                }
            };
            this.initWallet = async () => {
                try {
                    await eth_wallet_5.Wallet.getClientInstance().init();
                    await this.rpcWallet.init();
                }
                catch (_a) { }
            };
            this.connectWallet = async () => {
                if (!(0, index_5.isClientWalletConnected)()) {
                    if (this.mdWallet) {
                        await components_5.application.loadPackage('@scom/scom-wallet-modal', '*');
                        this.mdWallet.networks = this.networks;
                        this.mdWallet.wallets = this.wallets;
                        this.mdWallet.showModal();
                    }
                    return;
                }
                if (!this.state.isRpcWalletConnected()) {
                    const clientWallet = eth_wallet_5.Wallet.getClientInstance();
                    await clientWallet.switchNetwork(this.chainId);
                }
            };
            this.renderResult = (token, data) => {
                const img = scom_token_list_1.assets.tokenPath(token, this.chainId);
                const chainId = eth_wallet_5.Wallet.getClientInstance().chainId;
                this.resultElm.clearInnerHTML();
                this.resultElm.appendChild(this.$render("i-vstack", { gap: 50, horizontalAlignment: "center" },
                    this.$render("i-label", { caption: "\uD83C\uDF89 Disperse Successful! \uD83C\uDF89", class: "text-center", font: { size: '48px', bold: true } }),
                    this.$render("i-vstack", { gap: 16, width: 750, maxWidth: "100%", horizontalAlignment: "center" },
                        this.$render("i-label", { caption: "Token", font: { size: '24px' } }),
                        this.$render("i-hstack", { width: "100%", verticalAlignment: "center", horizontalAlignment: "center", gap: 16, padding: { top: 20, bottom: 20, left: 60, right: 60 }, border: { radius: 15, style: 'solid', width: 4 } },
                            this.$render("i-image", { width: 40, height: 40, minWidth: 30, url: img, fallbackUrl: assets_1.default.fullPath('img/token-placeholder.svg') }),
                            this.$render("i-label", { caption: `$${token.symbol}`, font: { size: '20px' } }),
                            this.$render("i-label", { class: "text-overflow", caption: token.address || token.symbol, font: { size: '16px' } }))),
                    this.$render("i-vstack", { gap: 8, width: 750, maxWidth: "100%", horizontalAlignment: "center" },
                        this.$render("i-label", { caption: "Explorer", font: { size: '24px' } }),
                        this.$render("i-hstack", { class: "pointer", wrap: "nowrap", width: "100%", minHeight: 88, verticalAlignment: "center", horizontalAlignment: "center", gap: 16, padding: { top: 20, bottom: 20, left: 20, right: 20 }, border: { radius: 15, style: 'solid', width: 4 }, onClick: () => (0, index_4.viewOnExplorerByTxHash)(chainId, data.receipt) },
                            this.$render("i-label", { class: "text-overflow", caption: data.receipt, font: { size: '16px' } }),
                            this.$render("i-icon", { class: "link-icon", name: "external-link-alt", width: 20, height: 20, fill: Theme.text.primary }))),
                    this.$render("i-hstack", { gap: 30, maxWidth: "100%", horizontalAlignment: "center", verticalAlignment: "center", wrap: "wrap" },
                        this.$render("i-button", { caption: "DOWNLOAD CSV", background: { color: "#34343A" }, width: 270, border: { radius: 12 }, padding: { top: 12, bottom: 12 }, onClick: () => this.onDownloadFile(true) }),
                        this.$render("i-button", { caption: "DOWNLOAD REPORT", background: { color: 'transparent linear-gradient(270deg, #FF9900 0%, #FC7428 100%) 0% 0% no-repeat padding-box' }, width: 270, border: { radius: 12 }, padding: { top: 12, bottom: 12 }, onClick: () => this.onDownloadReport(Object.assign({ symbol: token.symbol }, data)) }),
                        this.$render("i-button", { caption: "DISPERSE AGAIN", background: { color: 'linear-gradient(90deg, #456ED7 0%, #67BBBB 99.97%)' }, width: 270, border: { radius: 12 }, padding: { top: 12, bottom: 12 }, onClick: this.onDisperseAgain }))));
                this.containerElm.visible = false;
                this.resultElm.visible = true;
            };
            this.onLoad = () => {
                this.containerElm.visible = true;
                this.resultElm.visible = false;
                this.resetData(true);
            };
        }
        removeRpcWalletEvents() {
            const rpcWallet = this.rpcWallet;
            for (let event of this.rpcWalletEvents) {
                rpcWallet.unregisterWalletEvent(event);
            }
            this.rpcWalletEvents = [];
        }
        onHide() {
            this.dappContainer.onHide();
            this.removeRpcWalletEvents();
        }
        updateButtons() {
            if (!this.hStackGroupButton)
                return;
            const isClientConnected = (0, index_5.isClientWalletConnected)();
            if (!isClientConnected || !this.state.isRpcWalletConnected()) {
                this.btnWallet.visible = true;
                this.btnWallet.caption = !isClientConnected ? 'Connect Wallet' : 'Switch Network';
                this.hStackGroupButton.visible = false;
                return;
            }
            this.btnWallet.visible = false;
            this.hStackGroupButton.visible = true;
        }
        get chainId() {
            return this.state.getChainId();
        }
        get rpcWallet() {
            return this.state.getRpcWallet();
        }
        get listAddresses() {
            if (this.inputBatch.value) {
                return (0, index_4.toDisperseData)(this.inputBatch.value);
            }
            return [];
        }
        get hasAddress() {
            var _a;
            return !!((_a = this.listAddresses) === null || _a === void 0 ? void 0 : _a.length);
        }
        get balance() {
            if (this.token) {
                return scom_token_list_1.tokenStore.getTokenBalance(this.token);
            }
            return '0';
        }
        get total() {
            const _total = this.listAddresses.reduce((pv, cv) => pv.plus(cv.amount), new eth_wallet_5.BigNumber('0'));
            const commissionsAmount = this.state.getCommissionAmount(this.commissions, _total);
            return _total.plus(commissionsAmount);
        }
        get remaining() {
            return new eth_wallet_5.BigNumber(this.balance).minus(this.total);
        }
        get defaultChainId() {
            return this._data.defaultChainId;
        }
        set defaultChainId(value) {
            this._data.defaultChainId = value;
        }
        get wallets() {
            var _a;
            return (_a = this._data.wallets) !== null && _a !== void 0 ? _a : [];
        }
        set wallets(value) {
            this._data.wallets = value;
        }
        get networks() {
            var _a;
            return (_a = this._data.networks) !== null && _a !== void 0 ? _a : [];
        }
        set networks(value) {
            this._data.networks = value;
        }
        get showHeader() {
            var _a;
            return (_a = this._data.showHeader) !== null && _a !== void 0 ? _a : true;
        }
        set showHeader(value) {
            this._data.showHeader = value;
        }
        get commissions() {
            var _a;
            return (_a = this._data.commissions) !== null && _a !== void 0 ? _a : [];
        }
        set commissions(value) {
            this._data.commissions = value;
        }
        showImportCSVError(message) {
            this.messageModal.visible = true;
            this.messageModal.title = "Import CSV Error";
            this.messageElm.caption = message;
        }
        loadLib() {
            if (!window.jsPDF) {
                components_5.RequireJS.require([`${moduleDir}/lib/jspdf.js`], () => { });
            }
        }
        async init() {
            this.isReadyCallbackQueued = true;
            super.init();
            this.state = new index_5.State(data_json_1.default);
            this.loadLib();
            this.classList.add(index_css_1.disperseLayout);
            this.checkStepStatus((0, index_5.isClientWalletConnected)());
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
            return (this.$render("i-scom-dapp-container", { id: "dappContainer" },
                this.$render("i-panel", { class: `template-layout ${index_css_1.disperseStyle}` },
                    this.$render("i-modal", { id: "messageModal", class: "bg-modal" },
                        this.$render("i-label", { id: "messageElm" })),
                    this.$render("i-panel", { class: "container-layout" },
                        this.$render("i-vstack", { id: "containerElm", position: "relative", minHeight: 600 },
                            this.$render("i-hstack", { id: "firstStepElm", class: "step-elm", minHeight: 200, margin: { top: 40 }, padding: { left: 50, right: 50, top: 10, bottom: 10 }, border: { radius: 30 }, verticalAlignment: "center", horizontalAlignment: "space-between", background: { color: Theme.colors.secondary.main } },
                                this.$render("i-hstack", { class: "step-1", verticalAlignment: "center", wrap: "wrap", gap: 15, margin: { right: 100 } },
                                    this.$render("i-label", { caption: "STEP 1", font: { size: '20px', bold: true, color: Theme.colors.secondary.contrastText } }),
                                    this.$render("i-label", { caption: "Enter Token to Disperse", font: { size: '20px', bold: true } })),
                                this.$render("i-hstack", { class: "step-1" },
                                    this.$render("i-hstack", { id: "tokenElm", width: "100%", wrap: "nowrap", verticalAlignment: "center", horizontalAlignment: "space-between", padding: { top: 20, bottom: 20, left: 60, right: 60 }, border: { radius: 15, style: 'solid', width: 4 } },
                                        this.$render("i-hstack", { id: "tokenInfoElm" },
                                            this.$render("i-label", { caption: "Please Select Token", opacity: 0.75, font: { size: '16px' } })),
                                        this.$render("i-icon", { name: "caret-down", fill: Theme.text.primary, width: 24, height: 24 })),
                                    this.$render("i-scom-token-modal", { id: "mdToken", isCommonShown: false, class: index_css_1.tokenModalStyle }))),
                            this.$render("i-vstack", { id: "secondStepElm", class: "step-elm", minHeight: 300, margin: { top: 40 }, padding: { left: 50, right: 50, top: 10, bottom: 10 }, border: { radius: 30 }, verticalAlignment: "center", background: { color: Theme.colors.secondary.main } },
                                this.$render("i-hstack", { width: "100%", verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap", gap: 15 },
                                    this.$render("i-hstack", { verticalAlignment: "center", wrap: "wrap", gap: 15, margin: { right: 15 } },
                                        this.$render("i-label", { caption: "STEP 2", font: { size: '20px', bold: true, color: Theme.colors.secondary.contrastText } }),
                                        this.$render("i-label", { caption: "Enter Recipients and Amounts", font: { size: '20px', bold: true }, margin: { right: 60 } }),
                                        this.$render("i-label", { caption: "Enter one address and amount on each line. Supports any format.", font: { size: '13px' }, maxWidth: "280px", class: "break-word" })),
                                    this.$render("i-hstack", { verticalAlignment: "center", wrap: "wrap", class: "ml-auto", horizontalAlignment: "end", gap: 15 },
                                        this.$render("i-button", { id: "btnDownload", caption: "Download CSV", enabled: false, class: "csv-button", onClick: () => this.onDownloadFile() }),
                                        this.$render("i-button", { id: "btnImport", caption: "Import CSV", enabled: false, class: "csv-button", onClick: this.onImportFile }),
                                        this.$render("i-label", { id: "importFileElm", visible: false }))),
                                this.$render("i-input", { id: "inputBatch", height: "auto", enabled: false, placeholder: (0, index_4.disperseDataToString)(this.DummyDisperseData()), class: "input-batch custom-scroll", width: "100%", inputType: "textarea", rows: 4, margin: { top: 30 }, onChanged: this.onInputBatch })),
                            this.$render("i-hstack", { id: "thirdStepElm", class: "step-elm", minHeight: 240, margin: { top: 40 } },
                                this.$render("i-vstack", { width: "100%" },
                                    this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap", background: { color: Theme.input.background }, border: { radius: 30 } },
                                        this.$render("i-vstack", { class: "step-3", background: { color: Theme.colors.secondary.main }, width: 800, padding: { top: 50, bottom: 21, left: 50, right: 50 }, gap: 15, border: { radius: 30 } },
                                            this.$render("i-hstack", { width: "100%", verticalAlignment: "center", gap: 15 },
                                                this.$render("i-label", { caption: "STEP 3", font: { size: '20px', bold: true, color: Theme.colors.secondary.contrastText } }),
                                                this.$render("i-label", { caption: "Confirm Disperse", font: { size: '20px', bold: true } })),
                                            this.$render("i-vstack", { width: "100%", verticalAlignment: "center", gap: 10, class: "custom-scroll" },
                                                this.$render("i-label", { id: "invalidElm", font: { size: '18px', color: '#F05E61' } }),
                                                this.$render("i-vstack", { gap: 10, class: "address-elm" },
                                                    this.$render("i-hstack", { width: "100%", verticalAlignment: "center", gap: 30 },
                                                        this.$render("i-vstack", { width: 450 },
                                                            this.$render("i-label", { caption: "Addresses", font: { size: '16px' } })),
                                                        this.$render("i-label", { caption: "Amount", font: { size: '16px' } })),
                                                    this.$render("i-vstack", { width: "100%", height: 100, overflow: "auto", padding: { right: 5 } },
                                                        this.$render("i-vstack", { id: "addressesElm", width: "100%", height: "100%", verticalAlignment: "start", gap: 4 }))))),
                                        this.$render("i-vstack", { class: "step-3", width: 500, maxWidth: "100%", verticalAlignment: "center", gap: 20, padding: { left: 30, right: 50 } },
                                            this.$render("i-hstack", { gap: 10, verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap" },
                                                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                                                    this.$render("i-label", { caption: "Total", font: { size: '20px', bold: true, color: Theme.input.fontColor } }),
                                                    this.$render("i-icon", { id: "iconTotal", name: "question-circle", fill: Theme.input.fontColor, width: 20, height: 20, visible: false })),
                                                this.$render("i-label", { id: "totalElm", class: "text-right ml-auto", font: { size: '20px', bold: true, color: Theme.input.fontColor }, opacity: 0.75 })),
                                            this.$render("i-hstack", { gap: 10, verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap" },
                                                this.$render("i-label", { caption: "Your Balance", font: { size: '20px', bold: true, color: Theme.input.fontColor } }),
                                                this.$render("i-label", { id: "balanceElm", class: "text-right ml-auto", font: { size: '20px', bold: true, color: Theme.input.fontColor }, opacity: 0.75 })),
                                            this.$render("i-hstack", { gap: 10, verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap" },
                                                this.$render("i-label", { caption: "Remaining", font: { size: '20px', bold: true, color: Theme.input.fontColor } }),
                                                this.$render("i-label", { id: "remainingElm", class: "text-right ml-auto", font: { size: '20px', bold: true, color: Theme.input.fontColor }, opacity: 0.75 })))),
                                    this.$render("i-hstack", { id: "hStackGroupButton", verticalAlignment: "center", horizontalAlignment: "center", margin: { top: 40, bottom: 20 }, gap: 30 },
                                        this.$render("i-button", { id: "btnApprove", caption: "Approve", class: "btn-os", width: 300, maxWidth: "100%", enabled: false, rightIcon: { spin: true, visible: false }, border: { radius: 12 }, padding: { top: 12, bottom: 12 }, onClick: this.handleApprove }),
                                        this.$render("i-button", { id: "btnDisperse", caption: "Disperse", class: "btn-os", width: 300, maxWidth: "100%", enabled: false, rightIcon: { spin: true, visible: false }, border: { radius: 12 }, padding: { top: 12, bottom: 12 }, onClick: this.handleDisperse })),
                                    this.$render("i-button", { id: "btnWallet", caption: "Connect Wallet", class: "btn-os", width: 300, maxWidth: "100%", visible: false, margin: { top: 40, bottom: 20, left: 'auto', right: 'auto' }, border: { radius: 12 }, padding: { top: 12, bottom: 12 }, onClick: this.connectWallet })))),
                        this.$render("i-panel", { id: "resultElm", visible: false, margin: { top: 75, bottom: 100 } })),
                    this.$render("i-scom-tx-status-modal", { id: "txStatusModal" }),
                    this.$render("i-scom-wallet-modal", { id: "mdWallet", wallets: [] }))));
        }
    };
    ScomDisperse = __decorate([
        components_5.customModule,
        (0, components_5.customElements)('i-scom-disperse')
    ], ScomDisperse);
    exports.default = ScomDisperse;
});
