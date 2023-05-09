import { moment } from "@ijstech/components";
import { BigNumber } from "@ijstech/eth-wallet";

export interface ITokenObject {
  address?: string;
  name: string;
  decimals: number;
  symbol: string;
  status?: boolean | null;
  logoURI?: string;
  isCommon?: boolean | null;
  balance?: string | number;
  isNative?: boolean | null;
  isWETH?: boolean | null;
  isNew?: boolean | null;
};

export type TokenMapType = { [token: string]: ITokenObject };

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
}

export const explorerAddressUrlsByChainId: {[key: number]: string} = {
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
}


export enum SITE_ENV {
  DEV = 'dev',
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
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
  if (val > 0 && new BigNumber(val).lt(minValue)) {
    return `<${minValue}`;
  }
  return formatNumberWithSeparators(val, decimals || 4);
};

export const formatPercentNumber = (value: any, decimals?: number) => {
  let val = value;
  if (typeof value === 'string') {
    val = new BigNumber(value).toNumber();
  } else if (typeof value === 'object') {
    val = value.toNumber();
  }
  return formatNumberWithSeparators(val, decimals || 2);
};

export const formatNumberWithSeparators = (value: number, precision?: number) => {
  if (!value) value = 0;
  if (precision) {
    let outputStr = '';
    if (value >= 1) {
      outputStr = value.toLocaleString('en-US', { maximumFractionDigits: precision });
    }
    else {
      outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
    }

    if (outputStr.length > 18) {
      outputStr = outputStr.substr(0, 18) + '...'
    }
    return outputStr;
  }
  return value.toLocaleString('en-US');
}

export const isInvalidInput = (val: any) => {
  const value = new BigNumber(val);
  if (value.lt(0)) return true;
  return (val || '').toString().substring(0, 2) === '00' || val === '-';
};

export const limitInputNumber = (input: any, decimals: number) => {
  const amount = input.value;
  if (isInvalidInput(amount)) {
    input.value = '0';
    return;
  }
  if (!new BigNumber(amount).isNaN()) {
    input.value = limitDecimals(amount, decimals || 18);
  }
}

export const limitDecimals = (value: any, decimals: number) => {
  let val = value;
  if (typeof value !== 'string') {
    val = val.toString();
  }
  let chart;
  if (val.includes('.')) {
    chart = '.';
  } else if (val.includes(',')) {
    chart = ',';
  } else {
    return value;
  }
  const parts = val.split(chart);
  let decimalsPart = parts[1];
  if (decimalsPart && decimalsPart.length > decimals) {
    parts[1] = decimalsPart.substr(0, decimals);
  }
  return parts.join(chart);
}

export async function getAPI(url:string, paramsObj?: any): Promise<any> {
  let queries = '';
  if (paramsObj) {
      try {
          queries = new URLSearchParams(paramsObj).toString();
      } catch(err) {
          console.log('err', err)
      }
  }
  let fullURL = url + (queries ? `?${queries}` : '');
  const response = await fetch(fullURL, {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
  });
  return response.json();
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

export const toWeiInv = (n: string, unit?: number) => {
  if (new BigNumber(n).eq(0)) return new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'); 
  return new BigNumber('1').shiftedBy((unit || 18)*2).idiv(new BigNumber(n).shiftedBy(unit || 18));
}

export const padLeft = function(string: string, chars: number, sign?: string){
  return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
}

export const numberToBytes32 = (value: any, prefix?: string) => {
  if (!value) return;
  let v = value;
  if (typeof value == "number") {
    // covert to a hex string
    v = value.toString(16);
  } else if (/^[0-9]*$/.test(value)) {
    // assuming value to be a decimal number, value could be a hex
    v = new BigNumber(value).toString(16);
  } else if (/^(0x)?[0-9A-Fa-f]*$/.test(value)) {
    // value already a hex
    v = value;
  } else if (BigNumber.isBigNumber(value)) {
    v = value.toString(16);
  }
  v = v.replace("0x", "");
  v = padLeft(v, 64);
  if (prefix)
    v = '0x' + v
  return v;
}

export const getParamsFromUrl = () => {
  const startIdx = window.location.href.indexOf("?");
  const search = window.location.href.substring(startIdx, window.location.href.length)
  const queryString = search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams;
}

export const formatNumberValue = (data: any, tokenMap: TokenMapType) => {
  const { title, value, symbol, icon, prefix, isWrapped } = data;
  try {
    let limitDecimals = 18;
    if (symbol) {
      let symb = symbol;
      if (symb.includes('/')) {
        symb = symb.split('/')[0];
      }
      if (symbol === 'USD') {
        limitDecimals = 2;
      } else {
        const tokenObj = Object.values(tokenMap).find((token: any) => token.symbol === symb) as any;
        if (tokenObj) {
          limitDecimals = tokenObj.decimals || 18;
        }
      }
    }
    const val = parseFloat(value);
    const minValue = 0.0001;
    let result;
    let tooltip = `${value}`;
    if (val === 0) {
      result = `0`;
    } else if (val < minValue) {
      if (prefix === '$') {
        result = `< ${prefix}${minValue}`;
      } else if (prefix) {
        result = `${prefix.replace('=', '')} < ${minValue}`;
      } else {
        result = `< ${minValue}`;
      }
      tooltip = val.toLocaleString('en-US', { maximumFractionDigits: limitDecimals });
    } else {
      const stringValue = value.toString();
      const decimalsIndex = stringValue.indexOf('.');
      const length = decimalsIndex < 0 ? stringValue.length : stringValue.length - 1;
      let valueFormatted = val.toLocaleString('en-US', { maximumFractionDigits: limitDecimals });
      const arr = valueFormatted.split('.');
      valueFormatted = arr[0];
      if (arr[1]) {
        valueFormatted = `${arr[0]}.${arr[1].substr(0, 4)}`;
      }
      if (length <= 7) {
        result = valueFormatted;
      } else if (decimalsIndex > 7) {
        result = `${valueFormatted.substr(0, 9)}...`;
      } else if (decimalsIndex > -1) {
        result = valueFormatted;
      } else {
        const finalVal = valueFormatted.substr(0, 13);
        result = `${finalVal}${length > 10 ? '...' : ''}`;
      }
      if (result.length > 20 && !result.includes('...')) {
        result = `${result.substr(0, 13)}...`;
      }

      // Format value for the tooltip
      const parts = stringValue.split('.');
      const intVal = parseInt(parts[0]).toLocaleString('en-US');
      tooltip = `${intVal}`;
      if (parts[1]) {
        let decVal = parts[1];
        if (parts[1].length > limitDecimals) {
          decVal = parseFloat(`0.${parts[1]}`).toLocaleString('en-US', { maximumFractionDigits: limitDecimals });
          if (decVal == 1) {
            decVal = parts[1].substr(0, limitDecimals);
          } else {
            decVal = decVal.substr(2);
          }
        }
        tooltip += `.${decVal}`;
      }
    }
    if (icon) {
      result += ` <img width="20" src="${icon}" style="padding-bottom: 0.15rem" />`;
    }
    if (symbol) {
      result += ` ${symbol}`;
      tooltip += ` ${symbol}`;
    }
    if (prefix) {
      result = `${val < minValue ? '' : prefix}${result}`;
      tooltip = `${prefix}${tooltip}`;
    }
    if (title) {
      result = `${title}: ${result}`;
    }
    if (isWrapped) {
      result = `(${result})`;
    }
    if (symbol === 'USD') {
      return result;
    } else {
      return { result, tooltip }
    }
  } catch {
    return '-';
  }
}

export const uniqWith = (array: any[], compareFn: (cur: any, oth: any) => boolean) => {
  const unique: any = [];
  for (const cur of array) {
    const isDuplicate = unique.some((oth: any) => compareFn(cur, oth));
    if (!isDuplicate) unique.push(cur);
  }
  return unique;
}

export const getWeekDays = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  let days = [];
  let day = d;
  for (let i = 0; i < 7; i++) {
    days.push(day.setDate(day.getDate() + 1));
  }
  return days;
}

export const renderBalanceTooltip = (params: any, tokenMap: TokenMapType, isBold?: boolean) => {
  const data = formatNumberValue(params, tokenMap);
  if (typeof data === "object") {
    const { result, tooltip } = data;
    if (isBold) {
      return `<i-label class="bold" tooltip='${JSON.stringify({ content: tooltip })}'>${result}</i-label>`
    }
    return `<i-label tooltip='${JSON.stringify({ content: tooltip })}'>${result}</i-label>`;
  }
  return data;
}

const delimiters:string[] = [",", ":", "=", " "];
const newline = "[\\r\\n]+"; // one or more of "\r" or "\n" or "\r\n" will be iditified
const addressReg = /^0x/;

export interface DisperseData {
  address: string,
  amount: BigNumber,
}

export interface DisperseCheckedData extends DisperseData {
  isAddressOk:boolean
  AddressErrorMessage:string
  isAmountOk:boolean
  AmountErrorMessage:string
}

function isAddress(text:string) {
  return addressReg.test(text);
}

function isAmount(text:string) {
  return !new BigNumber(text).isNaN();
}

export function disperseDataToString(data: DisperseData[]):string {// using ","
  try {
    return data.reduce((prev, next)=>prev+=`${next.address},${next.amount.toFixed()}\n`,""); 
  } catch (error) {
    console.log(data);
    console.log("disperseDataToString", error);
    return "";
  }
}

export const toDisperseData = (inputText: string): DisperseData[] => {
  let allSep = delimiters.concat(newline);
  const separatorReg = new RegExp(allSep.join('|'));
  let textList = inputText.split(separatorReg).filter(x=>x.length);
  let data: DisperseData[] = [];

  enum TextType{Address,Amount,Other,None,}

  function toTextType(text:string):TextType {
    if (isAddress(text)) return TextType.Address;
    if (isAmount(text)) return TextType.Amount;
    return TextType.Other;
  }

  let lastText:TextType;
  let savedAddress: string | null = null;
  for (let i = 0; i < textList.length; i++) {
    let thisText = toTextType(textList[i]);
    switch (thisText) {
      case TextType.Address:{
        if (savedAddress) data.push({
          address:savedAddress,
          amount:new BigNumber("0")
        });
        savedAddress = textList[i];
        break;
      }
      case TextType.Amount:{
        if (savedAddress){
          data.push({
            address:savedAddress,
            amount:new BigNumber(textList[i])
          });
        } else {
          data.push({
            address:"0x",
            amount:new BigNumber(textList[i])
          })
        }
        savedAddress = null;
        break;
      }
      case TextType.Other:
      default:
        if (savedAddress) data.push({
          address:savedAddress,
          amount:new BigNumber("0")
        })
        savedAddress = null;
        break;
    }
    lastText = thisText;
  }
  if (savedAddress) data.push({
    address:savedAddress,
    amount:new BigNumber("0")
  })
  //console.log(disperseDataToString(data));
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

export function isWalletAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
