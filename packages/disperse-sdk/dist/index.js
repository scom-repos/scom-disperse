define('@validapp/disperse-sdk', (require, exports)=>{
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/index.ts
__export(exports, {
  Contracts: () => contracts_exports,
  DisperseActions: () => disperse_exports
});

// src/contracts/index.ts
var contracts_exports = {};
__export(contracts_exports, {
  Disperse: () => Disperse
});

// src/contracts/Disperse.ts
var import_eth_wallet = __toModule(require("@ijstech/eth-wallet"));

// src/contracts/Disperse.json.ts
var Disperse_json_default = {
  "abi": [
    { "inputs": [{ "internalType": "address[]", "name": "recipients", "type": "address[]" }, { "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "disperseEther", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "address[]", "name": "recipients", "type": "address[]" }, { "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "disperseToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "address[]", "name": "recipients", "type": "address[]" }, { "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "disperseTokenSimple", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
  ],
  "bytecode": "608060405234801561001057600080fd5b50610759806100206000396000f3fe6080604052600436106100345760003560e01c806351ba162c14610039578063c73a2d601461005b578063e63d38ed1461007b575b600080fd5b34801561004557600080fd5b506100596100543660046105cc565b61008e565b005b34801561006757600080fd5b506100596100763660046105cc565b6101c6565b61005961008936600461053e565b6103f0565b60005b838110156101be578573ffffffffffffffffffffffffffffffffffffffff166323b872dd338787858181106100c8576100c86106cf565b90506020020160208101906100dd919061051a565b8686868181106100ef576100ef6106cf565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e088901b16815273ffffffffffffffffffffffffffffffffffffffff958616600482015294909316602485015250602090910201356044820152606401602060405180830381600087803b15801561016b57600080fd5b505af115801561017f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101a391906105aa565b6101ac57600080fd5b806101b681610667565b915050610091565b505050505050565b6000805b8481101561020a578383828181106101e4576101e46106cf565b90506020020135826101f6919061064f565b91508061020281610667565b9150506101ca565b506040517f23b872dd0000000000000000000000000000000000000000000000000000000081523360048201523060248201526044810182905273ffffffffffffffffffffffffffffffffffffffff8716906323b872dd90606401602060405180830381600087803b15801561027f57600080fd5b505af1158015610293573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102b791906105aa565b6102c057600080fd5b60005b848110156103e7578673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8787848181106102f9576102f96106cf565b905060200201602081019061030e919061051a565b868685818110610320576103206106cf565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e087901b16815273ffffffffffffffffffffffffffffffffffffffff90941660048501526020029190910135602483015250604401602060405180830381600087803b15801561039457600080fd5b505af11580156103a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103cc91906105aa565b6103d557600080fd5b806103df81610667565b9150506102c3565b50505050505050565b60005b838110156104925784848281811061040d5761040d6106cf565b9050602002016020810190610422919061051a565b73ffffffffffffffffffffffffffffffffffffffff166108fc84848481811061044d5761044d6106cf565b905060200201359081150290604051600060405180830381858888f1935050505015801561047f573d6000803e3d6000fd5b508061048a81610667565b9150506103f3565b504780156104c757604051339082156108fc029083906000818181858888f193505050501580156101be573d6000803e3d6000fd5b5050505050565b60008083601f8401126104e057600080fd5b50813567ffffffffffffffff8111156104f857600080fd5b6020830191508360208260051b850101111561051357600080fd5b9250929050565b60006020828403121561052c57600080fd5b8135610537816106fe565b9392505050565b6000806000806040858703121561055457600080fd5b843567ffffffffffffffff8082111561056c57600080fd5b610578888389016104ce565b9096509450602087013591508082111561059157600080fd5b5061059e878288016104ce565b95989497509550505050565b6000602082840312156105bc57600080fd5b8151801515811461053757600080fd5b6000806000806000606086880312156105e457600080fd5b85356105ef816106fe565b9450602086013567ffffffffffffffff8082111561060c57600080fd5b61061889838a016104ce565b9096509450604088013591508082111561063157600080fd5b5061063e888289016104ce565b969995985093965092949392505050565b60008219821115610662576106626106a0565b500190565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415610699576106996106a0565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b73ffffffffffffffffffffffffffffffffffffffff8116811461072057600080fd5b5056fea2646970667358221220ad5b3def8ca91434d856fb6f359d846f5066b7f550a8c713f80c8460324c1cf464736f6c63430008070033"
};

// src/contracts/Disperse.ts
var Disperse = class extends import_eth_wallet.Contract {
  constructor(wallet, address) {
    super(wallet, address, Disperse_json_default.abi, Disperse_json_default.bytecode);
    this.assign();
  }
  deploy() {
    return this.__deploy();
  }
  assign() {
    let disperseEtherParams = (params) => [params.recipients, import_eth_wallet.Utils.toString(params.values)];
    let disperseEther_send = async (params, _value) => {
      let result = await this.send("disperseEther", disperseEtherParams(params), { value: _value });
      return result;
    };
    let disperseEther_call = async (params, _value) => {
      let result = await this.call("disperseEther", disperseEtherParams(params), { value: _value });
      return;
    };
    this.disperseEther = Object.assign(disperseEther_send, {
      call: disperseEther_call
    });
    let disperseTokenParams = (params) => [params.token, params.recipients, import_eth_wallet.Utils.toString(params.values)];
    let disperseToken_send = async (params) => {
      let result = await this.send("disperseToken", disperseTokenParams(params));
      return result;
    };
    let disperseToken_call = async (params) => {
      let result = await this.call("disperseToken", disperseTokenParams(params));
      return;
    };
    this.disperseToken = Object.assign(disperseToken_send, {
      call: disperseToken_call
    });
    let disperseTokenSimpleParams = (params) => [params.token, params.recipients, import_eth_wallet.Utils.toString(params.values)];
    let disperseTokenSimple_send = async (params) => {
      let result = await this.send("disperseTokenSimple", disperseTokenSimpleParams(params));
      return result;
    };
    let disperseTokenSimple_call = async (params) => {
      let result = await this.call("disperseTokenSimple", disperseTokenSimpleParams(params));
      return;
    };
    this.disperseTokenSimple = Object.assign(disperseTokenSimple_send, {
      call: disperseTokenSimple_call
    });
  }
};

// src/disperse.ts
var disperse_exports = {};
__export(disperse_exports, {
  doDisperse: () => doDisperse
});
async function doDisperse(wallet, contractAddress, tokenAddress, tokenDecimals, data) {
  let recipients = data.map((d) => d.address);
  let values = data.map((d) => d.amount.shiftedBy(tokenDecimals || 18));
  const disperse = new Disperse(wallet, contractAddress);
  let receipt = tokenAddress ? await disperse.disperseToken({ token: tokenAddress, recipients, values }) : await disperse.disperseEther({ recipients, values }, values.reduce((p, n) => p.plus(n)));
  return receipt;
}

})