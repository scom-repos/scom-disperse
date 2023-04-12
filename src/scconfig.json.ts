export default {
  "name": "@scom-disperse/main",
  "env": "mainnet",
  "version": "0.1.0",
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
    "@scom/oswap-openswap-contract": "*",
    "@scom/scom-binance-chain-wallet": "*",
    "@scom/scom-bit-keep-wallet": "*",
    "@scom/scom-coin98-wallet": "*",
    "@scom/scom-frontier-wallet": "*",
    "@scom/scom-onto-wallet": "*",
    "@scom/scom-trust-wallet": "*"
  },
  "InfuraId": "adc596bf88b648e2a8902bc9093930c5"
}