import { Wallet } from "@ijstech/eth-wallet";
import { DisperseData } from "./common";
export declare function doDisperse(wallet: Wallet, contractAddress: string, tokenAddress: string | null, tokenDecimals: number | null, data: DisperseData[]): Promise<import("@ijstech/eth-wallet/types/wallet").TransactionReceipt>;
