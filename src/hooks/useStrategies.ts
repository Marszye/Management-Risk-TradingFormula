
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Strategy {
  id: string;
  name: string;
  category: string;
  checklist: string[];
  created_at: string;
}

export const useStrategies = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: strategies = [], isLoading } = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(strategy => ({
        ...strategy,
        checklist: strategy.checklist as string[]
      })) as Strategy[];
    }
  });

  const createStrategyMutation = useMutation({
    mutationFn: async (strategyData: {
      name: string;
      category: string;
      checklist: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('strategies')
        .insert({
          ...strategyData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
      toast({
        title: "Strategy Created",
        description: "Strategy baru berhasil dibuat!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Gagal membuat strategy: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteStrategyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('strategies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
      toast({
        title: "Strategy Deleted",
        description: "Strategy berhasil dihapus!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Gagal menghapus strategy: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    strategies,
    isLoading,
    createStrategy: createStrategyMutation.mutate,
    deleteStrategy: deleteStrategyMutation.mutate,
    isCreating: createStrategyMutation.isPending,
    isDeleting: deleteStrategyMutation.isPending
  };
};
