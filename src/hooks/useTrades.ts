
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Trade {
  id: string;
  pair: string;
  lot_size: number;
  stop_loss?: number;
  take_profit?: number;
  psychology_state: string;
  discipline_score: number;
  result?: 'pending' | 'sl' | 'tp';
  profit_loss?: number;
  profit_loss_percentage?: number;
  strategy_id?: string;
  created_at: string;
  closed_at?: string;
}

export const useTrades = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Trade[];
    }
  });

  const createTradeMutation = useMutation({
    mutationFn: async (tradeData: {
      pair: string;
      lot_size: number;
      stop_loss?: number;
      take_profit?: number;
      psychology_state: string;
      discipline_score: number;
      strategy_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('Creating trade with data:', tradeData);

      const { data, error } = await supabase
        .from('trades')
        .insert({
          pair: tradeData.pair,
          lot_size: tradeData.lot_size,
          stop_loss: tradeData.stop_loss,
          take_profit: tradeData.take_profit,
          psychology_state: tradeData.psychology_state,
          discipline_score: tradeData.discipline_score,
          strategy_id: tradeData.strategy_id || null,
          user_id: user.id,
          result: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Trade creation error:', error);
        throw error;
      }
      
      console.log('Trade created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: "Trade Created",
        description: "Trade berhasil dibuat dan tersimpan!",
      });
    },
    onError: (error) => {
      console.error('Trade creation failed:', error);
      toast({
        title: "Error",
        description: `Gagal membuat trade: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateTradeMutation = useMutation({
    mutationFn: async ({ id, result, lotSize, initialBalance }: { 
      id: string; 
      result: 'sl' | 'tp'; 
      lotSize: number;
      initialBalance: number;
    }) => {
      console.log('Updating trade:', { id, result, lotSize, initialBalance });

      // Calculate profit/loss based on lot size and percentage
      const baseAmount = lotSize * 100; // Each lot = $100 base calculation
      const profitLossAmount = result === 'tp' ? baseAmount : -baseAmount;
      const profitLossPercentage = (profitLossAmount / initialBalance) * 100;

      const { data, error } = await supabase
        .from('trades')
        .update({ 
          result, 
          profit_loss: profitLossAmount,
          profit_loss_percentage: profitLossPercentage,
          closed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Trade update error:', error);
        throw error;
      }

      // Update user balance
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .single();

        if (profile) {
          const newBalance = (profile.balance || initialBalance) + profitLossAmount;
          await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', user.id);
        }
      }
      
      console.log('Trade updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: "Trade Updated",
        description: `Trade ${data.result === 'sl' ? 'Stop Loss' : 'Take Profit'} berhasil! P&L: ${data.profit_loss_percentage?.toFixed(2)}%`,
      });
    },
    onError: (error) => {
      console.error('Trade update failed:', error);
      toast({
        title: "Error",
        description: `Gagal update trade: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    trades,
    isLoading,
    createTrade: createTradeMutation.mutate,
    updateTrade: updateTradeMutation.mutate,
    isCreatingTrade: createTradeMutation.isPending,
    isUpdatingTrade: updateTradeMutation.isPending
  };
};
