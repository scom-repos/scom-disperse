import { Wallet, ISendTxEventsOptions } from "@ijstech/eth-wallet"; 


export const registerSendTxEvents = (sendTxEventHandlers: ISendTxEventsOptions) => {
  const wallet = Wallet.getClientInstance();
  wallet.registerSendTxEvents({
      transactionHash: (error: Error, receipt?: string) => {
        if (sendTxEventHandlers.transactionHash) {
          sendTxEventHandlers.transactionHash(error, receipt);
        }
      },
      confirmation: (receipt: any) => {
        if (sendTxEventHandlers.confirmation) {
          sendTxEventHandlers.confirmation(receipt);
        }
      },
  })
}

export const isAddressValid = async(address: string) => {
  let wallet: any = Wallet.getClientInstance();
  const isValid = wallet.web3.utils.isAddress(address);
  return isValid;
}