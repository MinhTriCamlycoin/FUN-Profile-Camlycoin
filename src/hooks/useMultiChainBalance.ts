import { useEffect, useState } from 'react';
import { useAccount, useBalance, useReadContract, useChainId } from 'wagmi';
import { formatUnits } from 'viem';
import { bsc } from 'wagmi/chains';

// Token addresses on BSC
const BSC_TOKENS = {
  USDT: '0x55d398326f99059fF775485246999027B3197955' as `0x${string}`,
  CAMLY: '0x2c7b8a1e4b8e5d7f3a9c6d8e1f2a3b4c5d6e7f8a' as `0x${string}`, // Replace with actual CAMLY address
  BTC: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c' as `0x${string}`, // BTCB on BSC
};

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
] as const;

export interface MultiChainBalance {
  bnb: string;
  usdt: string;
  camly: string;
  btc: string;
  btcNetwork: string;
  loading: boolean;
}

export const useMultiChainBalance = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [btcBalance, setBtcBalance] = useState('0');
  const [btcLoading, setBtcLoading] = useState(false);

  // BNB balance on BSC
  const { data: bnbBalance } = useBalance({
    address,
    chainId: bsc.id,
  });

  // USDT balance on BSC
  const { data: usdtBalance } = useReadContract({
    address: BSC_TOKENS.USDT,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: bsc.id,
  });

  // CAMLY balance on BSC
  const { data: camlyBalance } = useReadContract({
    address: BSC_TOKENS.CAMLY,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: bsc.id,
  });

  // BTC balance on BSC (BTCB)
  const { data: btcbBalance } = useReadContract({
    address: BSC_TOKENS.BTC,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: bsc.id,
  });

  // Fetch Bitcoin Network balance
  useEffect(() => {
    const fetchBtcBalance = async () => {
      if (!address) return;
      
      setBtcLoading(true);
      try {
        // Using BlockCypher API for Bitcoin balance
        const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`);
        const data = await response.json();
        
        if (data.balance !== undefined) {
          // Convert satoshis to BTC
          const btcAmount = (data.balance / 100000000).toFixed(8);
          setBtcBalance(btcAmount);
        }
      } catch (error) {
        console.error('Error fetching BTC balance:', error);
        setBtcBalance('0');
      } finally {
        setBtcLoading(false);
      }
    };

    fetchBtcBalance();
  }, [address]);

  const balances: MultiChainBalance = {
    bnb: bnbBalance ? formatUnits(bnbBalance.value, 18) : '0',
    usdt: usdtBalance ? formatUnits(usdtBalance as bigint, 18) : '0',
    camly: camlyBalance ? formatUnits(camlyBalance as bigint, 18) : '0',
    btc: btcbBalance ? formatUnits(btcbBalance as bigint, 18) : '0',
    btcNetwork: btcBalance,
    loading: btcLoading,
  };

  return balances;
};
