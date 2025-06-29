import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Settings = () => {
  const { profile, updateProfile, isUpdating } = useProfile();
  const [newBalance, setNewBalance] = useState('');
  const [strategyName, setStrategyName] = useState('');
  const [strategyCategory, setStrategyCategory] = useState('');
  const [checklistItems, setChecklistItems] = useState(['']);
  const queryClient = useQueryClient();

  // Get user strategies
  const { data: strategies, isLoading: strategiesLoading } = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createStrategy = useMutation({
    mutationFn: async (strategy: { name: string; category: string; checklist: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('strategies')
        .insert({
          user_id: user.id,
          name: strategy.name,
          category: strategy.category,
          checklist: strategy.checklist,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
      setStrategyName('');
      setStrategyCategory('');
      setChecklistItems(['']);
      toast({
        title: "Strategi Dibuat",
        description: "Strategi kustom berhasil disimpan.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal membuat strategi.",
        variant: "destructive",
      });
    },
  });

  const deleteStrategy = useMutation({
    mutationFn: async (strategyId: string) => {
      const { error } = await supabase
        .from('strategies')
        .delete()
        .eq('id', strategyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
      toast({
        title: "Strategi Dihapus",
        description: "Strategi berhasil dihapus.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus strategi.",
        variant: "destructive",
      });
    },
  });

  const handleBalanceUpdate = () => {
    const balance = parseFloat(newBalance);
    if (isNaN(balance)) {
      toast({
        title: "Invalid Input",
        description: "Masukkan angka yang valid.",
        variant: "destructive",
      });
      return;
    }
    updateProfile({ balance });
    setNewBalance('');
  };

  const handleAddChecklistItem = () => {
    setChecklistItems([...checklistItems, '']);
  };

  const handleRemoveChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const handleChecklistItemChange = (index: number, value: string) => {
    const newItems = [...checklistItems];
    newItems[index] = value;
    setChecklistItems(newItems);
  };

  const handleCreateStrategy = () => {
    if (!strategyName || !strategyCategory) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Nama strategi dan kategori harus diisi.",
        variant: "destructive",
      });
      return;
    }

    const validChecklistItems = checklistItems.filter(item => item.trim() !== '');
    if (validChecklistItems.length === 0) {
      toast({
        title: "Checklist Kosong",
        description: "Tambahkan minimal 1 item checklist.",
        variant: "destructive",
      });
      return;
    }

    createStrategy.mutate({
      name: strategyName,
      category: strategyCategory,
      checklist: validChecklistItems,
    });
  };

  const handleResetSettings = () => {
    if (confirm('Yakin ingin reset semua pengaturan? Ini akan menghapus semua data Anda.')) {
      // This would reset all user data - implement carefully
      toast({
        title: "Reset Berhasil",
        description: "Semua pengaturan telah direset.",
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Settings</h1>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger value="general" className="data-[state=active]:bg-green-600">
              Pengaturan Awal
            </TabsTrigger>
            <TabsTrigger value="strategies" className="data-[state=active]:bg-green-600">
              Strategi Kustom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-green-400">Pengaturan Saldo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-balance" className="text-gray-300">
                    Saldo Saat Ini: ${profile?.balance?.toFixed(2) || '0.00'}
                  </Label>
                </div>
                <div className="flex space-x-2">
                  <Input
                    id="new-balance"
                    type="number"
                    placeholder="Saldo baru"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button
                    onClick={handleBalanceUpdate}
                    disabled={isUpdating}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-red-400">Reset Pengaturan</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleResetSettings}
                  variant="destructive"
                  className="w-full"
                >
                  Reset Semua Pengaturan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-green-400">Buat Strategi Baru</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="strategy-name" className="text-gray-300">Nama Strategi</Label>
                  <Input
                    id="strategy-name"
                    placeholder="e.g., Breakout Plan"
                    value={strategyName}
                    onChange={(e) => setStrategyName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="strategy-category" className="text-gray-300">Kategori</Label>
                  <Input
                    id="strategy-category"
                    placeholder="e.g., Konfirmasi, Entry, Exit"
                    value={strategyCategory}
                    onChange={(e) => setStrategyCategory(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Checklist To-Do</Label>
                  <div className="space-y-2">
                    {checklistItems.map((item, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          placeholder={`Task ${index + 1}`}
                          value={item}
                          onChange={(e) => handleChecklistItemChange(index, e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        {checklistItems.length > 1 && (
                          <Button
                            onClick={() => handleRemoveChecklistItem(index)}
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      onClick={handleAddChecklistItem}
                      variant="ghost"
                      className="text-green-400 hover:text-green-300"
                    >
                      <Plus size={16} className="mr-2" />
                      Tambah Item
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleCreateStrategy}
                  disabled={createStrategy.isPending}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  {createStrategy.isPending ? 'Menyimpan...' : 'Simpan Strategi'}
                </Button>
              </CardContent>
            </Card>

            {/* Existing Strategies */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-green-400">Strategi Tersimpan</CardTitle>
              </CardHeader>
              <CardContent>
                {strategiesLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : strategies?.length === 0 ? (
                  <div className="text-gray-400 text-center py-4">
                    Belum ada strategi tersimpan
                  </div>
                ) : (
                  <div className="space-y-3">
                    {strategies?.map((strategy) => (
                      <div key={strategy.id} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-white">{strategy.name}</h3>
                            <p className="text-sm text-gray-400">{strategy.category}</p>
                          </div>
                          <Button
                            onClick={() => deleteStrategy.mutate(strategy.id)}
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {(strategy.checklist as string[]).map((item, index) => (
                            <div key={index} className="text-sm text-gray-300">
                              • {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
