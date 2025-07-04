
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

      const { data, error } = await supabase
        .from('trades')
        .insert({
          ...tradeData,
          user_id: user.id,
          result: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
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
      toast({
        title: "Error",
        description: `Gagal membuat trade: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateTradeMutation = useMutation({
    mutationFn: async ({ id, result, profit_loss }: { 
      id: string; 
      result: 'sl' | 'tp'; 
      profit_loss?: number 
    }) => {
      const { data, error } = await supabase
        .from('trades')
        .update({ 
          result, 
          profit_loss,
          closed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: "Trade Updated",
        description: `Trade ${data.result === 'sl' ? 'Stop Loss' : 'Take Profit'} berhasil!`,
      });
    },
    onError: (error) => {
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
