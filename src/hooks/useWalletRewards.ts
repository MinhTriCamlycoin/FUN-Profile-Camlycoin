import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';

export interface WalletRewards {
  camly: string;
  bnb: string;
  usdt: string;
  btc: string;
  loading: boolean;
}

export const useWalletRewards = () => {
  const { address } = useAccount();
  const [rewards, setRewards] = useState<WalletRewards>({
    camly: '0',
    bnb: '0',
    usdt: '0',
    btc: '0',
    loading: true,
  });

  useEffect(() => {
    const fetchRewards = async () => {
      if (!address) {
        setRewards({ camly: '0', bnb: '0', usdt: '0', btc: '0', loading: false });
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRewards({ camly: '0', bnb: '0', usdt: '0', btc: '0', loading: false });
          return;
        }

        // Fetch successful transactions where user is receiver
        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('to_address', address)
          .eq('status', 'success')
          .eq('user_id', user.id);

        if (!transactions) {
          setRewards({ camly: '0', bnb: '0', usdt: '0', btc: '0', loading: false });
          return;
        }

        // Sum up rewards by token
        let camlyTotal = 0;
        let bnbTotal = 0;
        let usdtTotal = 0;
        let btcTotal = 0;

        transactions.forEach((tx) => {
          const amount = parseFloat(tx.amount);
          switch (tx.token_symbol.toUpperCase()) {
            case 'CAMLY':
            case 'C':
              camlyTotal += amount;
              break;
            case 'BNB':
              bnbTotal += amount;
              break;
            case 'USDT':
              usdtTotal += amount;
              break;
            case 'BTC':
            case 'BTCB':
              btcTotal += amount;
              break;
          }
        });

        setRewards({
          camly: camlyTotal.toFixed(2),
          bnb: bnbTotal.toFixed(4),
          usdt: usdtTotal.toFixed(2),
          btc: btcTotal.toFixed(8),
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching rewards:', error);
        setRewards({ camly: '0', bnb: '0', usdt: '0', btc: '0', loading: false });
      }
    };

    fetchRewards();

    // Real-time updates for new transactions
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `to_address=eq.${address}`,
        },
        () => {
          fetchRewards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [address]);

  return rewards;
};
