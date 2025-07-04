
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Strategy {
  id: string;
  name: string;
  category: string;
  checklist: string[];
  user_id: string;
  created_at: string;
}

export const useStrategies = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: strategies = [], isLoading } = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      console.log('Fetching strategies...');
      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching strategies:', error);
        throw error;
      }
      
      console.log('Strategies fetched:', data);
      return data as Strategy[];
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

      console.log('Creating strategy with data:', strategyData);

      const { data, error } = await supabase
        .from('strategies')
        .insert({
          name: strategyData.name,
          category: strategyData.category,
          checklist: strategyData.checklist,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Strategy creation error:', error);
        throw error;
      }
      
      console.log('Strategy created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
      toast({
        title: "Strategy Created",
        description: "Strategy berhasil dibuat dan tersimpan!",
      });
    },
    onError: (error) => {
      console.error('Strategy creation failed:', error);
      toast({
        title: "Error",
        description: `Gagal membuat strategy: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteStrategyMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting strategy:', id);
      
      const { error } = await supabase
        .from('strategies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Strategy deletion error:', error);
        throw error;
      }
      
      console.log('Strategy deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
      toast({
        title: "Strategy Deleted",
        description: "Strategy berhasil dihapus!",
      });
    },
    onError: (error) => {
      console.error('Strategy deletion failed:', error);
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
