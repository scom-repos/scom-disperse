export default {
  "name": "@scom-disperse/main",
  "version": "0.1.0",
  "env": "",
  "moduleDir": "src",
  "main": "@scom-disperse/main",
  "modules": {
    "@scom-disperse/main": {
      "path": "main"
    },
    "@scom-disperse/assets": {
      "path": "assets"
    },
    "@scom-disperse/global": {
      "path": "global"
    },
    "@scom-disperse/store": {
      "path": "store"
    },
    "@scom-disperse/common": {
      "path": "common"
    },
    "@scom-disperse/disperse-utils": {
      "path": "disperse-utils"
    }
  },
  "dependencies": {
    "@ijstech/eth-wallet-web3modal": "*",
    "@ijstech/eth-contract": "*",
    "@ijstech/eth-wallet": "*",
    "@scom/scom-network-list": "*",
    "@scom/scom-multicall": "*"
  },
  "infuraId": "adc596bf88b648e2a8902bc9093930c5",
  "networks": [
    {
      "chainId": 1,
      "explorerName": "Etherscan",
      "explorerTxUrl": "https://etherscan.io/tx/",
      "explorerAddressUrl": "https://etherscan.io/address/"
    },
    {
      "chainId": 25,
      "isDisabled": true
    },    
    {
      "chainId": 56,
      "shortName": "BSC",
      "isMainChain": true,
      "isCrossChainSupported": true,
      "explorerName": "BSCScan",
      "explorerTxUrl": "https://bscscan.com/tx/",
      "explorerAddressUrl": "https://bscscan.com/address/"
    },
    {
      "chainId": 137,
      "explorerName": "PolygonScan",
      "explorerTxUrl": "https://polygonscan.com/tx/",
      "explorerAddressUrl": "https://polygonscan.com/address/"
    },    
    {
      "chainId": 250,
      "explorerName": "FTMScan",
      "explorerTxUrl": "https://ftmscan.com/tx/",
      "explorerAddressUrl": "https://ftmscan.com/address/"
    },    
    {
      "chainId": 97,
      "isMainChain": true,
      "isCrossChainSupported": true,
      "explorerName": "BSCScan",
      "explorerTxUrl": "https://testnet.bscscan.com/tx/",
      "explorerAddressUrl": "https://testnet.bscscan.com/address/",
      "isTestnet": true
    },
    {
      "chainId": 338,
      "isDisabled": true
    },  
    {
      "chainId": 80001,
      "explorerName": "PolygonScan",
      "explorerTxUrl": "https://mumbai.polygonscan.com/tx/",
      "explorerAddressUrl": "https://mumbai.polygonscan.com/address/",
      "isTestnet": true
    },    
    {
      "chainId": 43113,
      "shortName": "AVAX Testnet",
      "isCrossChainSupported": true,
      "explorerName": "SnowTrace",
      "explorerTxUrl": "https://testnet.snowtrace.io/tx/",
      "explorerAddressUrl": "https://testnet.snowtrace.io/address/",
      "isTestnet": true
    },    
    {
      "chainId": 43114,
      "shortName": "AVAX",
      "isCrossChainSupported": true,
      "explorerName": "SnowTrace",
      "explorerTxUrl": "https://snowtrace.io/tx/",
      "explorerAddressUrl": "https://snowtrace.io/address/"
    },
    {
      "chainId": 4002,
      "explorerName": "FTMScan",
      "explorerTxUrl": "https://testnet.ftmscan.com/tx/",
      "explorerAddressUrl": "https://testnet.ftmscan.com/address/",
      "isDisabled": true,
      "isTestnet": true
    },
    {
      "chainId": 13370,
      "isDisabled": true,
      "explorerName": "AminoX Explorer",
      "explorerTxUrl": "https://aminoxtestnet.blockscout.alphacarbon.network/tx/",
      "explorerAddressUrl": "https://aminoxtestnet.blockscout.alphacarbon.network/address/",
      "isTestnet": true
    },
    {
      "chainId": 421613,
      "explorerName": "ArbiScan",
      "explorerTxUrl": "https://goerli.arbiscan.io/tx/",
      "explorerAddressUrl": "https://goerli.arbiscan.io/address/",
      "isTestnet": true
    },
    {
      "chainId": 42161,
      "explorerName": "ArbiScan",
      "explorerTxUrl": "https://arbiscan.io/tx/",
      "explorerAddressUrl": "https://arbiscan.io/address/"
    }
  ]
}
