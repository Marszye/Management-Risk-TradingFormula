
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Target, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { useTrades } from '@/hooks/useTrades';
import { useStrategies } from '@/hooks/useStrategies';
import { useSettings } from '@/hooks/useSettings';
import { useNavigate } from 'react-router-dom';

export const Trade = () => {
  const navigate = useNavigate();
  const { createTrade, updateTrade, isCreatingTrade, isUpdatingTrade } = useTrades();
  const { strategies, isLoading: strategiesLoading } = useStrategies();
  const { settings } = useSettings();
  
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [pair, setPair] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [psychology, setPsychology] = useState('');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [currentTrade, setCurrentTrade] = useState<any>(null);

  const psychologyOptions = [
    { id: 'fear', label: 'Takut (Fear)', color: 'bg-red-100 text-red-700', negative: true },
    { id: 'greed', label: 'Serakah (Greed)', color: 'bg-orange-100 text-orange-700', negative: true },
    { id: 'revenge', label: 'Dendam (Revenge Trading)', color: 'bg-purple-100 text-purple-700', negative: true },
    { id: 'happiness', label: 'Happiness', color: 'bg-green-100 text-green-700', negative: false }
  ];

  const currentStrategy = strategies.find(s => s.id === selectedStrategy);
  const disciplinePercentage = currentStrategy ? (checkedItems.length / currentStrategy.checklist.length) * 100 : 0;

  const handleTodoCheck = (todo: string, checked: boolean) => {
    if (checked) {
      setCheckedItems([...checkedItems, todo]);
    } else {
      setCheckedItems(checkedItems.filter(item => item !== todo));
    }
  };

  const handleExecuteTrade = () => {
    if (disciplinePercentage === 100 && psychology === 'happiness' && pair && lotSize) {
      const tradeData = {
        pair,
        lot_size: parseFloat(lotSize),
        stop_loss: sl ? parseFloat(sl) : undefined,
        take_profit: tp ? parseFloat(tp) : undefined,
        psychology_state: psychology,
        discipline_score: disciplinePercentage,
        strategy_id: selectedStrategy
      };

      createTrade(tradeData, {
        onSuccess: (data) => {
          setCurrentTrade(data);
        }
      });
    }
  };

  const handleTradeResult = (result: 'sl' | 'tp') => {
    if (currentTrade && settings?.initial_balance) {
      updateTrade({ 
        id: currentTrade.id, 
        result, 
        lotSize: currentTrade.lot_size,
        initialBalance: settings.initial_balance
      }, {
        onSuccess: () => {
          // Reset form and navigate back
          setCurrentTrade(null);
          setPair('');
          setLotSize('');
          setSl('');
          setTp('');
          setPsychology('');
          setSelectedStrategy('');
          setCheckedItems([]);
          navigate('/');
        }
      });
    }
  };

  const quotes = [
    "Lebih baik ga Entry daripada Rugi, Makanya semua tu Konfirmasi Dulu!!!",
    "Disiplin adalah kunci kesuksesan trading",
    "Plan your trade, trade your plan",
    "Risk management is everything"
  ];

  if (strategiesLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading strategies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-4 md:space-y-6">
        {/* Header with Quote */}
        <div className="text-center">
          <div className="bg-pink-200 rounded-2xl p-3 md:p-4 shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-purple-600 mb-2 md:mb-3">
              🚀 Start Trading
            </h1>
            <p className="text-sm md:text-base text-gray-700 italic font-medium">
              "{quotes[Math.floor(Math.random() * quotes.length)]}"
            </p>
          </div>
        </div>

        {!currentTrade ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Strategy Selection */}
            <Card className="bg-blue-50 border border-blue-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Target className="mr-2" />
                  Pilih Strategy
                </CardTitle>
                <CardDescription>Pilih strategy trading yang akan digunakan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                {strategies.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Belum ada strategy. Buat strategy di menu Settings terlebih dahulu.</p>
                  </div>
                ) : (
                  strategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      onClick={() => setSelectedStrategy(strategy.id)}
                      className={`p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                        selectedStrategy === strategy.id
                          ? 'bg-blue-200 border-blue-400 shadow-lg'
                          : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      <h3 className="font-bold text-base md:text-lg">{strategy.name}</h3>
                      <Badge className="mt-2 bg-blue-500 text-white text-xs">
                        {strategy.category}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Trade Execution */}
            <Card className="bg-green-50 border border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <Play className="mr-2" />
                  Execute Trade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label className="text-sm">Pair</Label>
                    <Input
                      placeholder="EURUSD"
                      value={pair}
                      onChange={(e) => setPair(e.target.value)}
                      className="bg-white border-green-300"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Size Lot</Label>
                    <Input
                      placeholder="0.01"
                      type="number"
                      value={lotSize}
                      onChange={(e) => setLotSize(e.target.value)}
                      className="bg-white border-green-300"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">SL</Label>
                    <Input
                      placeholder="Stop Loss"
                      type="number"
                      value={sl}
                      onChange={(e) => setSl(e.target.value)}
                      className="bg-white border-green-300"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">TP</Label>
                    <Input
                      placeholder="Take Profit"
                      type="number"
                      value={tp}
                      onChange={(e) => setTp(e.target.value)}
                      className="bg-white border-green-300"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm">Psychology State</Label>
                  <Select value={psychology} onValueChange={setPsychology}>
                    <SelectTrigger className="bg-white border-green-300">
                      <SelectValue placeholder="Pilih kondisi psikologi" />
                    </SelectTrigger>
                    <SelectContent>
                      {psychologyOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${option.color}`}></span>
                            {option.label} {option.negative ? '❌' : '✅'}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Strategy Checklist */}
            {currentStrategy && (
              <Card className="lg:col-span-2 bg-purple-50 border border-purple-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-700 text-base md:text-lg">
                    <CheckCircle className="mr-2" />
                    {currentStrategy.name} - Checklist
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Discipline Progress</span>
                    <Badge className={`${disciplinePercentage === 100 ? 'bg-green-500' : 'bg-orange-500'} text-white text-xs`}>
                      {disciplinePercentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress value={disciplinePercentage} className="w-full" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {currentStrategy.checklist.map((todo, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 md:p-3 bg-white rounded-lg border border-purple-200">
                        <Checkbox
                          checked={checkedItems.includes(todo)}
                          onCheckedChange={(checked) => handleTodoCheck(todo, checked as boolean)}
                        />
                        <span className={`text-sm ${checkedItems.includes(todo) ? 'line-through text-gray-500' : ''}`}>
                          {todo}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleExecuteTrade}
                    disabled={disciplinePercentage !== 100 || psychology !== 'happiness' || !pair || !lotSize || isCreatingTrade}
                    className="w-full mt-4 md:mt-6 bg-purple-500 hover:bg-purple-600 text-white text-base md:text-lg py-2 md:py-3"
                  >
                    <TrendingUp className="mr-2" />
                    {isCreatingTrade ? 'Creating Trade...' : 'Execute Trade'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          // Result View
          <Card className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-yellow-700 text-xl md:text-2xl">
                🎯 Trade Result
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-xs md:text-sm text-gray-600">Pair</p>
                  <p className="font-bold text-base md:text-lg">{currentTrade.pair}</p>
                </div>
                <div className="p-3 md:p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-xs md:text-sm text-gray-600">Lot Size</p>
                  <p className="font-bold text-base md:text-lg">{currentTrade.lot_size}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Button 
                  onClick={() => handleTradeResult('sl')}
                  disabled={isUpdatingTrade}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 md:px-8 py-2 md:py-3"
                >
                  <XCircle className="mr-2" />
                  {isUpdatingTrade ? 'Processing...' : 'SL - Stop Loss'}
                </Button>
                <Button 
                  onClick={() => handleTradeResult('tp')}
                  disabled={isUpdatingTrade}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 md:px-8 py-2 md:py-3"
                >
                  <CheckCircle className="mr-2" />
                  {isUpdatingTrade ? 'Processing...' : 'TP - Take Profit'}
                </Button>
              </div>

              <p className="text-xs md:text-sm text-gray-600 italic">
                Klik salah satu button untuk menyelesaikan trade
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
