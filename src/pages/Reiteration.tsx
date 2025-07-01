
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, CheckCircle, XCircle, Calendar, Target, Trophy } from 'lucide-react';

interface ReiterationModel {
  id: string;
  title: string;
  journalProblem: string;
  solution: string;
  targetDays: number;
  currentDay: number;
  disciplineRecord: boolean[];
  completed: boolean;
  successRate: number;
}

export const Reiteration = () => {
  const [models, setModels] = useState<ReiterationModel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [title, setTitle] = useState('');
  const [journalProblem, setJournalProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [targetDays, setTargetDays] = useState(30);

  // Mock journal problems - in real app this would come from Journal page
  const journalProblems = [
    { id: '1', title: 'Overtrading Issue', problem: 'Sering melakukan trading berlebihan' },
    { id: '2', title: 'Emotion Control', problem: 'Sulit mengontrol emosi saat loss' },
    { id: '3', title: 'Risk Management', problem: 'Tidak konsisten dengan risk management' }
  ];

  const handleCreateModel = () => {
    if (title && journalProblem && solution) {
      const newModel: ReiterationModel = {
        id: Date.now().toString(),
        title,
        journalProblem,
        solution,
        targetDays,
        currentDay: 0,
        disciplineRecord: [],
        completed: false,
        successRate: 0
      };
      setModels([newModel, ...models]);
      setTitle('');
      setJournalProblem('');
      setSolution('');
      setShowForm(false);
    }
  };

  const handleDailyCheck = (modelId: string, isDisciplined: boolean) => {
    setModels(prevModels => 
      prevModels.map(model => {
        if (model.id === modelId && model.currentDay < model.targetDays) {
          const newRecord = [...model.disciplineRecord, isDisciplined];
          const newCurrentDay = model.currentDay + 1;
          const disciplinedDays = newRecord.filter(Boolean).length;
          const successRate = (disciplinedDays / newCurrentDay) * 100;
          const completed = newCurrentDay >= model.targetDays;

          return {
            ...model,
            currentDay: newCurrentDay,
            disciplineRecord: newRecord,
            successRate: Math.round(successRate),
            completed
          };
        }
        return model;
      })
    );
  };

  const resetModel = (modelId: string) => {
    setModels(prevModels =>
      prevModels.map(model =>
        model.id === modelId
          ? { ...model, currentDay: 0, disciplineRecord: [], completed: false, successRate: 0 }
          : model
      )
    );
  };

  const quotes = [
    "Konsistensi adalah kunci kesuksesan trading",
    "30 hari untuk mengubah kebiasaan buruk",
    "Disiplin hari ini, profit masa depan",
    "Reiteration membentuk trader profesional"
  ];

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="bg-indigo-200 rounded-2xl p-4 shadow-lg">
          <h1 className="text-3xl font-bold text-indigo-600 mb-3">
            🔄 Reiteration Evaluation
          </h1>
          <p className="text-base text-gray-700 italic font-medium">
            "{quotes[Math.floor(Math.random() * quotes.length)]}"
          </p>
        </div>
      </div>

      {/* Create New Model Button */}
      <div className="mb-6 text-center">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 text-base"
        >
          <Target className="mr-2" />
          Buat Model Reiteration Baru
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="mb-6 bg-purple-50 border border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-700">
              <RotateCcw className="mr-2" />
              Reiteration Model Baru
            </CardTitle>
            <CardDescription>Buat program disiplin 30 hari untuk perbaikan trading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                placeholder="Nama program reiteration..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white border-purple-300"
              />
            </div>

            <div>
              <Label>Pilih Journal Problem</Label>
              <Select value={journalProblem} onValueChange={setJournalProblem}>
                <SelectTrigger className="bg-white border-purple-300">
                  <SelectValue placeholder="Pilih masalah dari journal" />
                </SelectTrigger>
                <SelectContent>
                  {journalProblems.map((problem) => (
                    <SelectItem key={problem.id} value={problem.problem}>
                      {problem.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Solution</Label>
              <Textarea
                placeholder="Solusi untuk mengatasi masalah ini..."
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="bg-white border-purple-300 min-h-[120px]"
              />
            </div>

            <div>
              <Label>Target Days (Default: 30)</Label>
              <Input
                type="number"
                value={targetDays}
                onChange={(e) => setTargetDays(parseInt(e.target.value) || 30)}
                className="bg-white border-purple-300"
                min="1"
                max="365"
              />
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleCreateModel}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Buat Model
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="border-purple-300"
              >
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Models List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="bg-white border border-purple-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-purple-700">{model.title}</CardTitle>
                {model.completed && (
                  <Badge className="bg-green-500 text-white">
                    <Trophy className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <CardDescription>
                Day {model.currentDay} of {model.targetDays}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-red-700 mb-2">Problem:</h4>
                <p className="text-sm text-gray-700 bg-red-50 p-3 rounded-lg border border-red-200">
                  {model.journalProblem}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-green-700 mb-2">Solution:</h4>
                <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                  {model.solution}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Progress</span>
                  <Badge className={`${model.successRate >= 80 ? 'bg-green-500' : model.successRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                    {model.successRate}%
                  </Badge>
                </div>
                <Progress value={(model.currentDay / model.targetDays) * 100} className="w-full" />
              </div>

              {!model.completed && model.currentDay < model.targetDays && (
                <div className="flex space-x-4">
                  <Button
                    onClick={() => handleDailyCheck(model.id, true)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="mr-2 w-4 h-4" />
                    Disiplin Hari Ini
                  </Button>
                  <Button
                    onClick={() => handleDailyCheck(model.id, false)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <XCircle className="mr-2 w-4 h-4" />
                    Tidak Disiplin
                  </Button>
                </div>
              )}

              {model.completed && (
                <div className="text-center space-y-2">
                  <p className="text-lg font-bold text-green-700">
                    🎉 Selesai! Success Rate: {model.successRate}%
                  </p>
                  <Button
                    onClick={() => resetModel(model.id)}
                    variant="outline"
                    className="border-purple-300"
                  >
                    <RotateCcw className="mr-2 w-4 h-4" />
                    Ulangi Lagi
                  </Button>
                </div>
              )}

              {/* Discipline Record Visual */}
              {model.disciplineRecord.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Discipline Record:</h4>
                  <div className="flex flex-wrap gap-1">
                    {model.disciplineRecord.map((disciplined, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          disciplined 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}
                        title={`Day ${index + 1}: ${disciplined ? 'Disciplined' : 'Not Disciplined'}`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {models.length === 0 && !showForm && (
        <div className="text-center py-12">
          <RotateCcw className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Belum ada model reiteration</p>
          <p className="text-gray-400">Mulai dengan membuat program disiplin pertama!</p>
        </div>
      )}
    </div>
  );
};
