
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Target, TrendingUp, Brain, CheckCircle, XCircle } from 'lucide-react';

export const Trade = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [pair, setPair] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [psychology, setPsychology] = useState('');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const strategies = [
    { 
      id: 'scalping', 
      name: 'Scalping Master', 
      category: 'Short Term',
      todos: ['Check 1M timeframe', 'Identify support/resistance', 'Volume confirmation', 'Risk 1% max']
    },
    { 
      id: 'swing', 
      name: 'Swing Trader', 
      category: 'Medium Term',
      todos: ['Daily chart analysis', 'Weekly trend check', 'Economic calendar', 'Position sizing']
    },
    { 
      id: 'breakout', 
      name: 'Breakout Hunter', 
      category: 'Momentum',
      todos: ['Consolidation pattern', 'Volume spike', 'False breakout check', 'Stop loss placement']
    }
  ];

  const psychologyOptions = [
    { id: 'fear', label: 'Takut (Fear)', color: 'bg-red-100 text-red-700', negative: true },
    { id: 'greed', label: 'Serakah (Greed)', color: 'bg-orange-100 text-orange-700', negative: true },
    { id: 'revenge', label: 'Dendam (Revenge Trading)', color: 'bg-purple-100 text-purple-700', negative: true },
    { id: 'happiness', label: 'Happiness', color: 'bg-green-100 text-green-700', negative: false }
  ];

  const currentStrategy = strategies.find(s => s.id === selectedStrategy);
  const disciplinePercentage = currentStrategy ? (checkedItems.length / currentStrategy.todos.length) * 100 : 0;

  const handleTodoCheck = (todo: string, checked: boolean) => {
    if (checked) {
      setCheckedItems([...checkedItems, todo]);
    } else {
      setCheckedItems(checkedItems.filter(item => item !== todo));
    }
  };

  const handleExecuteTrade = () => {
    if (disciplinePercentage === 100 && psychology === 'happiness' && pair && lotSize) {
      setShowResult(true);
    }
  };

  const quotes = [
    "Lebih baik ga Entry daripada Rugi, Makanya semua tu Konfirmasi Dulu!!!",
    "Disiplin adalah kunci kesuksesan trading",
    "Plan your trade, trade your plan",
    "Risk management is everything"
  ];

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header with Quote */}
      <div className="mb-6 text-center">
        <div className="bg-pink-200 rounded-2xl p-4 shadow-lg">
          <h1 className="text-3xl font-bold text-purple-600 mb-3">
            🚀 Start Trading
          </h1>
          <p className="text-base text-gray-700 italic font-medium">
            "{quotes[Math.floor(Math.random() * quotes.length)]}"
          </p>
        </div>
      </div>

      {!showResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strategy Selection */}
          <Card className="bg-blue-50 border border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Target className="mr-2" />
                Pilih Strategy
              </CardTitle>
              <CardDescription>Pilih strategy trading yang akan digunakan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {strategies.map((strategy) => (
                <div
                  key={strategy.id}
                  onClick={() => setSelectedStrategy(strategy.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                    selectedStrategy === strategy.id
                      ? 'bg-blue-200 border-blue-400 shadow-lg'
                      : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  <h3 className="font-bold text-lg">{strategy.name}</h3>
                  <Badge className="mt-2 bg-blue-500 text-white">
                    {strategy.category}
                  </Badge>
                </div>
              ))}
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pair</Label>
                  <Input
                    placeholder="EURUSD"
                    value={pair}
                    onChange={(e) => setPair(e.target.value)}
                    className="bg-white border-green-300"
                  />
                </div>
                <div>
                  <Label>Size Lot</Label>
                  <Input
                    placeholder="0.01"
                    value={lotSize}
                    onChange={(e) => setLotSize(e.target.value)}
                    className="bg-white border-green-300"
                  />
                </div>
                <div>
                  <Label>SL</Label>
                  <Input
                    placeholder="Stop Loss"
                    value={sl}
                    onChange={(e) => setSl(e.target.value)}
                    className="bg-white border-green-300"
                  />
                </div>
                <div>
                  <Label>TP</Label>
                  <Input
                    placeholder="Take Profit"
                    value={tp}
                    onChange={(e) => setTp(e.target.value)}
                    className="bg-white border-green-300"
                  />
                </div>
              </div>

              <div>
                <Label>Psychology State</Label>
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
                <CardTitle className="flex items-center text-purple-700">
                  <CheckCircle className="mr-2" />
                  {currentStrategy.name} - Checklist
                </CardTitle>
                <div className="flex items-center justify-between">
                  <span>Discipline Progress</span>
                  <Badge className={`${disciplinePercentage === 100 ? 'bg-green-500' : 'bg-orange-500'} text-white`}>
                    {disciplinePercentage.toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={disciplinePercentage} className="w-full" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentStrategy.todos.map((todo, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-purple-200">
                      <Checkbox
                        checked={checkedItems.includes(todo)}
                        onCheckedChange={(checked) => handleTodoCheck(todo, checked as boolean)}
                      />
                      <span className={checkedItems.includes(todo) ? 'line-through text-gray-500' : ''}>
                        {todo}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleExecuteTrade}
                  disabled={disciplinePercentage !== 100 || psychology !== 'happiness' || !pair || !lotSize}
                  className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-white text-lg py-3"
                >
                  <TrendingUp className="mr-2" />
                  Execute Trade
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // Result View
        <Card className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-yellow-700 text-2xl">
              🎯 Trade Result
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-yellow-200">
                <p className="text-sm text-gray-600">Pair</p>
                <p className="font-bold text-lg">{pair}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-yellow-200">
                <p className="text-sm text-gray-600">Lot Size</p>
                <p className="font-bold text-lg">{lotSize}</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3">
                <XCircle className="mr-2" />
                SL - Stop Loss
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
                <CheckCircle className="mr-2" />
                TP - Take Profit
              </Button>
            </div>

            <p className="text-sm text-gray-600 italic">
              Klik salah satu button untuk menyelesaikan trade
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
