import { IRpcWallet } from "@ijstech/eth-wallet";
import * as Contracts from './contracts/index';

const getProxyCampaign = async (wallet: IRpcWallet, proxyAddress: string, campaignId: number) => {
    const proxy = new Contracts.ProxyV3(wallet, proxyAddress);
    const campaign = await proxy.getCampaign({
      campaignId,
      returnArrays: true
    });
    return campaign;
  }
  

const getCommissionRate = async (wallet: IRpcWallet, proxyAddress: string, campaignId: number) => {
    const campaign = await getProxyCampaign(wallet, proxyAddress, campaignId);
    let rate = '0';
    if (campaign.commissionInTokenConfig.length > 0) {
        rate = campaign.commissionInTokenConfig[0].rate.toFixed();
    }
    else if (campaign.commissionOutTokenConfig.length > 0) {
        rate = campaign.commissionOutTokenConfig[0].rate.toFixed();
    }
    return rate;
}

export {
    getProxyCampaign,
    getCommissionRate
}