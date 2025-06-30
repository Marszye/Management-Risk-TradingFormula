
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Calendar, Edit3 } from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  thoughts: string;
  problems: string;
  date: string;
}

export const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [problems, setProblems] = useState('');

  const handleSubmit = () => {
    if (title && thoughts && problems) {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title,
        thoughts,
        problems,
        date: new Date().toLocaleDateString('id-ID')
      };
      setEntries([newEntry, ...entries]);
      setTitle('');
      setThoughts('');
      setProblems('');
      setShowForm(false);
    }
  };

  const quotes = [
    "Evaluasi adalah kunci perbaikan trading",
    "Setiap kesalahan adalah pelajaran berharga",
    "Trader yang baik selalu melakukan introspeksi",
    "Journal trading adalah GPS menuju kesuksesan"
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="bg-gradient-to-r from-orange-200 via-yellow-200 to-red-200 rounded-2xl p-6 shadow-lg">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-red-600 bg-clip-text text-transparent mb-4">
            📝 Trading Journal
          </h1>
          <p className="text-lg text-gray-700 italic font-medium">
            "{quotes[Math.floor(Math.random() * quotes.length)]}"
          </p>
        </div>
      </div>

      {/* Add Entry Button */}
      <div className="mb-6 text-center">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg"
        >
          <Plus className="mr-2" />
          Tambah Evaluasi Baru
        </Button>
      </div>

      {/* Entry Form */}
      {showForm && (
        <Card className="mb-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Edit3 className="mr-2" />
              Journal Evaluation
            </CardTitle>
            <CardDescription>Tulis evaluasi trading hari ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                placeholder="Judul evaluasi trading..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white border-orange-300"
              />
            </div>
            
            <div>
              <Label>What do you think? 🤔</Label>
              <Textarea
                placeholder="Apa yang kamu pikirkan tentang trading hari ini?"
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                className="bg-white border-orange-300 min-h-[120px]"
              />
            </div>

            <div>
              <Label>What's the problem? ❓</Label>
              <Textarea
                placeholder="Masalah apa yang kamu hadapi?"
                value={problems}
                onChange={(e) => setProblems(e.target.value)}
                className="bg-white border-orange-300 min-h-[120px]"
              />
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                Simpan Evaluasi
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="border-orange-300"
              >
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <Card key={entry.id} className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-orange-700 text-lg">{entry.title}</CardTitle>
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <Calendar className="w-3 h-3 mr-1" />
                  {entry.date}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">💭 Thoughts:</h4>
                <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                  {entry.thoughts}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-red-700 mb-2">❗ Problems:</h4>
                <p className="text-sm text-gray-700 bg-red-50 p-3 rounded-lg border border-red-200">
                  {entry.problems}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {entries.length === 0 && !showForm && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-orange-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Belum ada evaluasi trading</p>
          <p className="text-gray-400">Mulai dengan menambah evaluasi pertama!</p>
        </div>
      )}
    </div>
  );
};
