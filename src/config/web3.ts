import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc } from 'wagmi/chains';

// Bitcoin network is handled separately via BlockCypher API
export const config = getDefaultConfig({
  appName: 'F.U. Profile - Multi-Chain Wallet',
  projectId: '21fef48091f12692cad574a6f7753643',
  chains: [bsc], // Focus on BSC for EVM tokens
  ssr: false,
});
