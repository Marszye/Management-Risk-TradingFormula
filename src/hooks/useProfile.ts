
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useProfile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Try to get existing profile
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      // If profile exists, return it
      if (existingProfile) {
        return existingProfile;
      }

      // If no profile exists, create one with user metadata
      const username = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split('@')[0] || 
                      'user_' + user.id.substring(0, 8);

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: username,
          balance: 0.00
        })
        .select()
        .single();

      if (createError) throw createError;
      return newProfile;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: { username?: string; balance?: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Profil Updated",
        description: "Profile berhasil diperbarui.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui profil.",
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isPending,
  };
};
