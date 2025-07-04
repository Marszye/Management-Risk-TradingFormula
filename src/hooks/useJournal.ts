
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface JournalEntry {
  id: string;
  title: string;
  thoughts: string;
  problems: string;
  created_at: string;
  updated_at: string;
}

export const useJournal = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as JournalEntry[];
    }
  });

  const createEntryMutation = useMutation({
    mutationFn: async (entryData: {
      title: string;
      thoughts: string;
      problems: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          ...entryData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast({
        title: "Journal Saved",
        description: "Journal entry berhasil disimpan!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Gagal menyimpan journal: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast({
        title: "Journal Deleted",
        description: "Journal entry berhasil dihapus!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Gagal menghapus journal: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    entries,
    isLoading,
    createEntry: createEntryMutation.mutate,
    deleteEntry: deleteEntryMutation.mutate,
    isCreating: createEntryMutation.isPending,
    isDeleting: deleteEntryMutation.isPending
  };
};
