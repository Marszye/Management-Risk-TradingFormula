
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Settings as SettingsIcon, DollarSign, Target, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useProfile } from '@/hooks/useProfile';

interface Strategy {
  id: string;
  name: string;
  category: string;
  todoList: string[];
}

export const Settings = () => {
  const { settings, updateSettings, isUpdating } = useSettings();
  const { updateProfile } = useProfile();
  const [initialBalance, setInitialBalance] = useState('1000');
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'Scalping Master',
      category: 'Short Term',
      todoList: ['Check 1M timeframe', 'Identify support/resistance', 'Volume confirmation', 'Risk 1% max']
    }
  ]);
  
  const [showStrategyForm, setShowStrategyForm] = useState(false);
  const [newStrategyName, setNewStrategyName] = useState('');
  const [newStrategyCategory, setNewStrategyCategory] = useState('');
  const [newTodoItem, setNewTodoItem] = useState('');
  const [currentTodoList, setCurrentTodoList] = useState<string[]>([]);

  // Load settings when component mounts
  useEffect(() => {
    if (settings?.initial_balance) {
      setInitialBalance(settings.initial_balance.toString());
    }
  }, [settings]);

  const handleSaveBalance = async () => {
    const balanceValue = parseFloat(initialBalance);
    if (isNaN(balanceValue) || balanceValue < 0) {
      return;
    }

    // Update settings
    updateSettings({ initial_balance: balanceValue });
    
    // Also update profile balance
    updateProfile({ balance: balanceValue });
  };

  const addTodoItem = () => {
    if (newTodoItem.trim()) {
      setCurrentTodoList([...currentTodoList, newTodoItem.trim()]);
      setNewTodoItem('');
    }
  };

  const removeTodoItem = (index: number) => {
    setCurrentTodoList(currentTodoList.filter((_, i) => i !== index));
  };

  const handleCreateStrategy = () => {
    if (newStrategyName && newStrategyCategory && currentTodoList.length > 0) {
      const newStrategy: Strategy = {
        id: Date.now().toString(),
        name: newStrategyName,
        category: newStrategyCategory,
        todoList: currentTodoList
      };
      setStrategies([...strategies, newStrategy]);
      
      // Reset form
      setNewStrategyName('');
      setNewStrategyCategory('');
      setCurrentTodoList([]);
      setShowStrategyForm(false);
    }
  };

  const deleteStrategy = (id: string) => {
    setStrategies(strategies.filter(s => s.id !== id));
  };

  const resetAllSettings = () => {
    setInitialBalance('1000');
    setStrategies([]);
    localStorage.clear();
  };

  const quotes = [
    "Pengaturan yang tepat adalah fondasi kesuksesan",
    "Strategi yang baik dimulai dari perencanaan yang matang",
    "Customization adalah kunci personalisasi trading",
    "Setting yang optimal menghasilkan performa maksimal"
  ];

  return (
    <div className="w-full h-full p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="bg-gradient-to-r from-teal-200 via-cyan-200 to-blue-200 rounded-2xl p-4 md:p-6 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
            ⚙️ Settings
          </h1>
          <p className="text-base md:text-lg text-gray-700 italic font-medium">
            "{quotes[Math.floor(Math.random() * quotes.length)]}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Initial Balance Settings */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <DollarSign className="mr-2" />
              Modal Dollar $$
            </CardTitle>
            <CardDescription>Set saldo awal untuk tracking performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Initial Balance ($)</Label>
              <Input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="bg-white border-green-300 text-lg font-bold"
                placeholder="1000"
              />
            </div>
            <Button 
              onClick={handleSaveBalance}
              disabled={isUpdating}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan Saldo Awal'}
            </Button>
          </CardContent>
        </Card>

        {/* Strategy Management */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Target className="mr-2" />
              Strategy Management
            </CardTitle>
            <CardDescription>Kelola strategy trading kamu</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowStrategyForm(!showStrategyForm)}
              className="w-full mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              <Plus className="mr-2" />
              Tambah Strategy Baru
            </Button>

            {/* Strategy List */}
            <div className="space-y-3">
              {strategies.map((strategy) => (
                <div key={strategy.id} className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-blue-700">{strategy.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        {strategy.category}
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Strategy</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah kamu yakin ingin menghapus strategy "{strategy.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteStrategy(strategy.id)}>
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Todo List:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {strategy.todoList.map((todo, index) => (
                        <li key={index}>{todo}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strategy Form */}
        {showStrategyForm && (
          <Card className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <Plus className="mr-2" />
                Buat Strategy Baru
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nama Strategy</Label>
                  <Input
                    placeholder="Contoh: Scalping Master"
                    value={newStrategyName}
                    onChange={(e) => setNewStrategyName(e.target.value)}
                    className="bg-white border-purple-300"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    placeholder="Contoh: Short Term"
                    value={newStrategyCategory}
                    onChange={(e) => setNewStrategyCategory(e.target.value)}
                    className="bg-white border-purple-300"
                  />
                </div>
              </div>

              <div>
                <Label>Todo List Items</Label>
                <div className="flex space-x-2 mb-3">
                  <Input
                    placeholder="Tambah item todo list..."
                    value={newTodoItem}
                    onChange={(e) => setNewTodoItem(e.target.value)}
                    className="bg-white border-purple-300"
                    onKeyPress={(e) => e.key === 'Enter' && addTodoItem()}
                  />
                  <Button
                    onClick={addTodoItem}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Current Todo List */}
                <div className="space-y-2">
                  {currentTodoList.map((todo, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-purple-200">
                      <span>{todo}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeTodoItem(index)}
                        className="text-red-600 border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleCreateStrategy}
                  disabled={!newStrategyName || !newStrategyCategory || currentTodoList.length === 0}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  Buat Strategy
                </Button>
                <Button
                  onClick={() => setShowStrategyForm(false)}
                  variant="outline"
                  className="border-purple-300"
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reset Settings */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <RotateCcw className="mr-2" />
              Reset Semua Pengaturan
            </CardTitle>
            <CardDescription>Hapus semua data dan kembalikan ke pengaturan awal</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                  <RotateCcw className="mr-2" />
                  Reset Semuanya dari Awal
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Semua Pengaturan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah kamu yakin ingin menghapus semua data termasuk strategies, balance, dan pengaturan lainnya? 
                    Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={resetAllSettings} className="bg-red-600 hover:bg-red-700">
                    Ya, Reset Semua
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
