const InfuraId = "adc596bf88b648e2a8902bc9093930c5";

export default {
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
}