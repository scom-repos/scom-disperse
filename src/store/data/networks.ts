import Assets from '../../assets';
import { INetwork } from '../../global/index';
const InfuraId = "adc596bf88b648e2a8902bc9093930c5"
const Networks: { [key: number]: INetwork } = {
  1: {
    chainId: 1,
    name: "Ethereum",
    label: "Ethereum",
    icon: "ethereumNetwork.svg",
    rpc: `https://mainnet.infura.io/v3/${InfuraId}`,
  },
  25: {
    chainId: 25,
    name: "Cronos",
    label: "Cronos Mainnet",
    icon: "cronosMainnet.svg", //notadded,
    isDisabled: true
  },
  42: {
    chainId: 42,
    name: "Kovan",
    label: 'Kovan Test Network',
    icon: "ethereumNetwork.svg",
    rpc: `https://kovan.infura.io/v3/${InfuraId}`,
  },
  56: {
    chainId: 56,
    name: "Binance",
    label: "Binance Smart Chain",
    icon: "bscMainnet.svg",
    rpc: 'https://bsc-dataseed.binance.org/',
  },
  137: {
    label: 'Polygon',
    name: 'Polygon',
    chainId: 137,
    icon: 'polygon.svg',
  },
  250: {
    label: 'Fantom Opera',
    name: 'Fantom',
    chainId: 250,
    icon: 'fantom-ftm-logo.svg',
    rpc: 'https://rpc.ftm.tools/',
  },
  97: {
    label: 'BSC Testnet',
    name: 'BSC Testnet',
    chainId: 97,
    icon: 'bscMainnet.svg',
    rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  },
  338: {
    label: 'Cronos Testnet',
    name: 'Cronos Testnet',
    chainId: 338,
    icon: 'cronosTestnet.svg', //not added
    isDisabled: true
  },
  31337: {
    chainId: 31337,
    name: "Amino",
    label: 'Amino Testnet',
    icon: 'animoTestnet.svg',
    isDisabled: true
  },
  80001: {
    chainId: 80001,
    name: "Mumbai",
    label: 'Mumbai',
    icon: 'polygon.svg',
    rpc: 'https://matic-mumbai.chainstacklabs.com',
  },
  43113: {
    chainId: 43113,
    name: "Fuji",
    label: 'Avalanche FUJI C-Chain',
    icon: 'avax.svg',
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
  },
  43114: {
    chainId: 43114,
    name: "Avalanche",
    label: 'Avalanche Mainnet C-Chain',
    icon: 'avax.svg',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
  },
  4002: {
    chainId: 4002,
    name: "Fantom Testnet",
    label: 'Fantom Testnet',
    icon: 'fantom-ftm-logo.svg',
    rpc: 'https://rpc.testnet.fantom.network/',
    isDisabled: true
  },
  13370: {
    chainId: 13370,
    name: 'AminoX Testnet',
    label: 'AminoX Testnet',
    icon: 'aminoXTestnet.svg',
    isDisabled: true
  }
}
const Mainnets = {
  binance: Networks[56],
  ethereum: Networks[1],
  avalanche: Networks[43114],
  cronos: Networks[25],
  fantom: Networks[250],
  polygon: Networks[137]
};
const Testnets = {
  binance: Networks[97],
  cronos: Networks[338],
  kovan: Networks[42],
  avalanche: Networks[43113],
  fantom: Networks[4002],
  polygon: Networks[80001],
  aminox: Networks[13370],
};
const getNetworkType = (chainId: number) => {
  if ([Mainnets.binance.chainId, Testnets.binance.chainId].includes(chainId)) {
    return 'BSCScan';
  }
  if ([Mainnets.ethereum.chainId, Testnets.kovan.chainId].includes(chainId)) {
    return 'Etherscan';
  }
  if ([Mainnets.avalanche.chainId, Testnets.avalanche.chainId].includes(chainId)) {
    return 'SnowTrace';
  }
  if ([Mainnets.polygon.chainId, Testnets.polygon.chainId].includes(chainId)) {
    return 'PolygonScan';
  }
  if ([Mainnets.fantom.chainId, Testnets.fantom.chainId].includes(chainId)) {
    return 'FTMScan';
  }
  if ([Testnets.aminox.chainId].includes(chainId)) {
    return 'AminoX Explorer'
  }
  return 'Unknown';
}

enum ChainNetwork {
  BSCMainnet = 56,
  BSCTestnet = 97,
  EthMainnet = 1,
  Polygon = 137,
  KovanTestnet = 42,
  AminoTestnet = 31337,
  Mumbai = 80001,
  Fuji = 43113,
  Avalanche = 43114,
  Fantom = 250,
  FantomTestnet = 4002,
  CronosMainnet = 25,
  CronosTestnet = 338,
  AminoXTestnet = 13370
}

const listNetworks = [
  {
    label: 'Binance Smart Chain',
    value: 'binance',
    chainId: ChainNetwork.BSCMainnet,
    img: 'bscMainnet.svg'
  },
  {
    label: 'BSC Testnet',
    value: 'testnet',
    chainId: ChainNetwork.BSCTestnet,
    img: 'bscMainnet.svg'
  },
  {
    label: 'Ethereum',
    value: 'ethereum',
    chainId: ChainNetwork.EthMainnet,
    img: 'ethereumNetwork.svg'
  },
  {
    label: 'Kovan Test Network',
    value: 'kovan',
    chainId: ChainNetwork.KovanTestnet,
    img: 'ethereumNetwork.svg'
  },
  {
    label: 'Amino Testnet',
    value: 'amino',
    chainId: ChainNetwork.AminoTestnet,
    img: 'animoTestnet.svg'
  },
  {
    label: 'Avalanche Mainnet C-Chain',
    value: 'avalanche',
    chainId: ChainNetwork.Avalanche,
    img: 'avax.svg'
  },
  {
    label: 'Avalanche FUJI C-Chain',
    value: 'fuji',
    chainId: ChainNetwork.Fuji,
    img: 'avax.svg'
  },
  {
    label: 'Polygon',
    value: 'polygon',
    chainId: ChainNetwork.Polygon,
    img: 'polygon.svg'
  },
  {
    label: 'Mumbai',
    value: 'mumbai',
    chainId: ChainNetwork.Mumbai,
    img: 'polygon.svg'
  },
  {
    label: 'Fantom Opera',
    value: 'fantom',
    chainId: ChainNetwork.Fantom,
    img: 'fantom-ftm-logo.svg'
  },
  {
    label: 'Fantom Testnet',
    value: 'fantomTestnet',
    chainId: ChainNetwork.FantomTestnet,
    img: 'fantom-ftm-logo.svg'
  },
  {
    label: 'Cronos Mainnet',
    value: 'Cronos',
    chainId: ChainNetwork.CronosMainnet,
    img: 'cronosMainnet.svg'
  },
  {
    label: 'Cronos Testnet',
    value: 'cronosTestnet',
    chainId: ChainNetwork.CronosTestnet,
    img: 'cronosTestnet.svg'
  },
  {
    label: 'AminoX Testnet',
    value: 'aminoXTestnet',
    chainId: ChainNetwork.AminoXTestnet,
    img: 'aminoXTestnet.svg'
  },
];

const getNetworkImg = (chainId: number) => {
  try {
    const network = listNetworks.find((f: any) => f.chainId == chainId);
    if (network) {
      return Assets.fullPath(`img/network/${network.img}`);
    }
  } catch { }
  return Assets.fullPath('img/tokens/token-placeholder.svg');
}

export {
  InfuraId,
  Networks,
  Mainnets,
  Testnets,
  getNetworkType,
  ChainNetwork,
  listNetworks,
  getNetworkImg
}