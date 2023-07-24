import { moment } from "@ijstech/components";
import { BigNumber } from "@ijstech/eth-wallet";

export const explorerTxUrlsByChainId: { [key: number]: string } = {
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
}

export const explorerAddressUrlsByChainId: { [key: number]: string } = {
  1: 'https://etherscan.io/address/',
  4: 'https://rinkeby.etherscan.io/address/',
  42: 'https://kovan.etherscan.io/address/',
  97: 'https://testnet.bscscan.com/address/',
  56: 'https://bscscan.com/address/',
  43113: 'https://testnet.snowtrace.io/address/',
  43114: 'https://snowtrace.io/address/',
  137: 'https://polygonscan.com/address/',
  80001: 'https://mumbai.polygonscan.com/address/',
  250: 'https://ftmscan.com/address/',
  4002: 'https://testnet.ftmscan.com/address/',
  13370: 'https://aminoxtestnet.blockscout.alphacarbon.network/address/',
  421613: 'https://goerli.arbiscan.io/address/'
}

export const DefaultDateFormat = 'YYYY/MM/DD HH:mm:ss';

export const formatUTCDate = (date: any, formatType = DefaultDateFormat) => {
  const formatted = moment(date).format(formatType);
  return `${formatted} (UTC+${moment().utcOffset() / 60})`;
}

export const formatNumber = (value: any, decimals?: number) => {
  let val = value;
  const minValue = '0.0000001';
  if (typeof value === 'string') {
    val = new BigNumber(value).toNumber();
  } else if (typeof value === 'object') {
    val = value.toNumber();
  }
  if (val != 0 && new BigNumber(val).lt(minValue)) {
    return `<${minValue}`;
  }
  return formatNumberWithSeparators(val, decimals || 4);
};

export const formatNumberWithSeparators = (value: number, precision?: number) => {
  if (!value) value = 0;
  if (precision) {
    let outputStr = '';
    if (value >= 1) {
      const unit = Math.pow(10, precision);
      const rounded = Math.floor(value * unit) / unit;
      outputStr = rounded.toLocaleString('en-US', { maximumFractionDigits: precision });
    } else {
      outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
    }
    if (outputStr.length > 18) {
      outputStr = outputStr.substring(0, 18) + '...';
    }
    return outputStr;
  }
  return value.toLocaleString('en-US');
}

export const viewOnExplorerByTxHash = (chainId: number, txHash: string) => {
  if (explorerTxUrlsByChainId[chainId]) {
    let url = `${explorerTxUrlsByChainId[chainId]}${txHash}`;
    window.open(url);
  }
}

export const viewOnExplorerByAddress = (chainId: number, address: string) => {
  if (explorerAddressUrlsByChainId[chainId]) {
    let url = `${explorerAddressUrlsByChainId[chainId]}${address}`;
    window.open(url);
  }
}

const delimiters: string[] = [",", ":", "=", " "];
const newline = "[\\r\\n]+"; // one or more of "\r" or "\n" or "\r\n" will be iditified
const addressReg = /^0x/;

export interface DisperseData {
  address: string,
  amount: BigNumber,
}

export interface DisperseCheckedData extends DisperseData {
  isAddressOk: boolean
  AddressErrorMessage: string
  isAmountOk: boolean
  AmountErrorMessage: string
}

function isAddress(text: string) {
  return addressReg.test(text);
}

function isAmount(text: string) {
  return !new BigNumber(text).isNaN();
}

export function disperseDataToString(data: DisperseData[]): string {// using ","
  try {
    return data.reduce((prev, next) => prev += `${next.address},${next.amount.toFixed()}\n`, "");
  } catch (error) {
    console.log(data);
    console.log("disperseDataToString", error);
    return "";
  }
}

export const toDisperseData = (inputText: string): DisperseData[] => {
  let allSep = delimiters.concat(newline);
  const separatorReg = new RegExp(allSep.join('|'));
  let textList = inputText.split(separatorReg).filter(x => x.length);
  let data: DisperseData[] = [];

  enum TextType { Address, Amount, Other, None, }

  function toTextType(text: string): TextType {
    if (isAddress(text)) return TextType.Address;
    if (isAmount(text)) return TextType.Amount;
    return TextType.Other;
  }

  let lastText: TextType;
  let savedAddress: string | null = null;
  for (let i = 0; i < textList.length; i++) {
    let thisText = toTextType(textList[i]);
    switch (thisText) {
      case TextType.Address: {
        if (savedAddress) data.push({
          address: savedAddress,
          amount: new BigNumber("0")
        });
        savedAddress = textList[i];
        break;
      }
      case TextType.Amount: {
        if (savedAddress) {
          data.push({
            address: savedAddress,
            amount: new BigNumber(textList[i])
          });
        } else {
          data.push({
            address: "0x",
            amount: new BigNumber(textList[i])
          })
        }
        savedAddress = null;
        break;
      }
      case TextType.Other:
      default:
        if (savedAddress) data.push({
          address: savedAddress,
          amount: new BigNumber("0")
        })
        savedAddress = null;
        break;
    }
    lastText = thisText;
  }
  if (savedAddress) data.push({
    address: savedAddress,
    amount: new BigNumber("0")
  })
  return data;
}

export const downloadCSVFile = (content: string, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  const csvContent = `data:text/csv;charset=utf-8,${content}`;
  const encodedUri = encodeURI(csvContent);
  link.href = encodedUri;
  link.click();
}
