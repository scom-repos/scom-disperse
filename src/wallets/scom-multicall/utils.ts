export interface IMulticallInfo {
    chainId: number; 
    contractAddress: string;
    gasBuffer: string;
}

export function getMulticallInfoList() {
    const list = [
        {
            chainId: 1,
            contractAddress: '0x8d035edd8e09c3283463dade67cc0d49d6868063',
            gasBuffer: '3000000'
        },
        {
            chainId: 56,
            contractAddress: '0x804708de7af615085203fa2b18eae59c5738e2a9',
            gasBuffer: '3000000'
        },
        {
            chainId: 97,
            contractAddress: '0xFe482bde67982C73D215032184312E4707B437C1',
            gasBuffer: '3000000'
        },
        {
            chainId: 137,
            contractAddress: '0x0196e8a9455a90d392b46df8560c867e7df40b34',
            gasBuffer: '3000000'
        },
        {
            chainId: 250,
            contractAddress: '0xA31bB36c5164B165f9c36955EA4CcBaB42B3B28E',
            gasBuffer: '3000000'
        },
        {
            chainId: 43113,
            contractAddress: '0x40784b92542649DDA13FF97580e8A021aC57b320',
            gasBuffer: '3000000'
        },
        {
            chainId: 43114,
            contractAddress: '0xC4A8B7e29E3C8ec560cd4945c1cF3461a85a148d',
            gasBuffer: '3000000'
        },
        {
            chainId: 80001,
            contractAddress: '0x7810eC500061f5469fF6e1485Ab130045B3af6b0',
            gasBuffer: '3000000'
        },
        {
            chainId: 421613,
            contractAddress: '0xee25cCcc02550DdBF4b90eb06b0D796eBE247E1B',
            gasBuffer: '3000000'
        },
        {
            chainId: 42161,
            contractAddress: '0x11DEE30E710B8d4a8630392781Cc3c0046365d4c',
            gasBuffer: '3000000'
        }
    ];
    return list;
}

export function getMulticallInfo(chainId: number) {
    const list = getMulticallInfoList();
    const info = list.find((item) => item.chainId === chainId);
    return info;
}