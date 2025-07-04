
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Calendar, Edit3, Trash2 } from 'lucide-react';
import { useJournal } from '@/hooks/useJournal';

export const Journal = () => {
  const { entries, createEntry, deleteEntry, isLoading, isCreating } = useJournal();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [problems, setProblems] = useState('');

  const handleSubmit = () => {
    if (title && thoughts && problems) {
      createEntry({
        title,
        thoughts,
        problems
      }, {
        onSuccess: () => {
          setTitle('');
          setThoughts('');
          setProblems('');
          setShowForm(false);
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus journal ini?')) {
      deleteEntry(id);
    }
  };

  const quotes = [
    "Evaluasi adalah kunci perbaikan trading",
    "Setiap kesalahan adalah pelajaran berharga",
    "Trader yang baik selalu melakukan introspeksi",
    "Journal trading adalah GPS menuju kesuksesan"
  ];

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading journal entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="bg-orange-200 rounded-2xl p-3 md:p-4 shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-orange-600 mb-2 md:mb-3">
              📝 Trading Journal
            </h1>
            <p className="text-sm md:text-base text-gray-700 italic font-medium">
              "{quotes[Math.floor(Math.random() * quotes.length)]}"
            </p>
          </div>
        </div>

        {/* Add Entry Button */}
        <div className="text-center">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
          >
            <Plus className="mr-2" />
            Tambah Evaluasi Baru
          </Button>
        </div>

        {/* Entry Form */}
        {showForm && (
          <Card className="bg-yellow-50 border border-orange-200 shadow-lg">
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
                  className="bg-white border-orange-300 min-h-[100px] md:min-h-[120px]"
                />
              </div>

              <div>
                <Label>What's the problem? ❓</Label>
                <Textarea
                  placeholder="Masalah apa yang kamu hadapi?"
                  value={problems}
                  onChange={(e) => setProblems(e.target.value)}
                  className="bg-white border-orange-300 min-h-[100px] md:min-h-[120px]"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!title || !thoughts || !problems || isCreating}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {isCreating ? 'Menyimpan...' : 'Simpan Evaluasi'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {entries.map((entry) => (
            <Card key={entry.id} className="bg-white border border-orange-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-orange-700 text-base md:text-lg">{entry.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-orange-500 text-white text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(entry.created_at).toLocaleDateString('id-ID')}
                    </Badge>
                    <Button
                      onClick={() => handleDelete(entry.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2 text-sm">💭 Thoughts:</h4>
                  <p className="text-xs md:text-sm text-gray-700 bg-green-50 p-2 md:p-3 rounded-lg border border-green-200">
                    {entry.thoughts}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-700 mb-2 text-sm">❗ Problems:</h4>
                  <p className="text-xs md:text-sm text-gray-700 bg-red-50 p-2 md:p-3 rounded-lg border border-red-200">
                    {entry.problems}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {entries.length === 0 && !showForm && (
          <div className="text-center py-8 md:py-12">
            <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-orange-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base md:text-lg">Belum ada evaluasi trading</p>
            <p className="text-gray-400 text-sm md:text-base">Mulai dengan menambah evaluasi pertama!</p>
          </div>
        )}
      </div>
    </div>
  );
};
