import { BigNumber, IWallet } from "@ijstech/eth-contract";
import { Disperse } from "./contracts/index";

export interface DisperseData {
    address: string,
    amount: BigNumber,
}

export async function doDisperse(
    wallet: IWallet,
    contractAddress: string,
    tokenAddress: string | null,
    tokenDecimals: number | null,
    data: DisperseData[],
) {
    let recipients:string[] = data.map(d=>d.address);
    let values:BigNumber[] = data.map(d=>d.amount.shiftedBy(tokenDecimals || 18));
    const disperse = new Disperse(wallet, contractAddress)
    let receipt = tokenAddress? await disperse.disperseToken({token:tokenAddress,recipients,values}): await disperse.disperseEther({recipients,values},values.reduce((p,n)=>p.plus(n)));
    return receipt;
}