
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

export const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showAccessCodePanel, setShowAccessCodePanel] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const motivationalQuotes = [
    "Lebih baik ga Entry daripada Rugi, Makanya semua tu Konfirmasi Dulu!!!",
    "Disiplin adalah kunci kesuksesan trading. Jangan pernah melanggar aturan mu sendiri!",
    "Emosi adalah musuh terbesar trader. Kendalikan, jangan dikendalikan!",
    "Kamu sedang membentuk otak miliarder. Ini bukan soal cuan, tapi soal kendali.",
    "Trading bukan tentang berapa banyak profit, tapi berapa sedikit loss yang bisa kamu terima.",
  ];

  const currentQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const handleGetAccess = () => {
    window.open('https://lynk.id/marszye?fbclid=PAZXh0bgNhZW0CMTEAAacpTw4LqakuUW5KrhF_N55LISkjVcFpZxxW6MxTWWnydLKVXCbZT3sDiH6EFQ_aem_Crm0WJDeQOvx1VnJiZ1q5Q', '_blank');
  };

  const handleVerifyCode = () => {
    if (accessCode.toLowerCase() === 'hearme') {
      setShowAccessCodePanel(false);
      setShowRegistrationForm(true);
      setAccessCode('');
      toast({
        title: "✅ Kode Benar!",
        description: "Silakan lengkapi form registrasi.",
      });
    } else {
      toast({
        title: "❌ Kode salah",
        description: "Minta akses dulu ya!",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      toast({
        title: "⚠️ Data Tidak Lengkap",
        description: "Mohon isi username dan password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const email = `${username}@trax.app`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "🔄 SESUAIKAN",
            description: "nama telah ada, buat nama yang lain",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "🎉 Registrasi Berhasil!",
          description: "Silakan login dengan akun baru Anda.",
        });
        setShowRegistrationForm(false);
        setIsLogin(true);
        setUsername('');
        setPassword('');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Terjadi kesalahan saat mendaftar.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: "⚠️ Data Tidak Lengkap",
        description: "Mohon isi username dan password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const email = `${username}@trax.app`;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "❌ Login Gagal",
          description: "Username atau password salah.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Terjadi kesalahan saat login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Quote */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              TRAX
            </h1>
            <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white text-sm italic leading-relaxed font-medium">
              💎 {currentQuote}
            </p>
          </div>
        </div>

        {/* STEP 1: Access Code Panel */}
        {showAccessCodePanel && (
          <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                ✅ STEP 1: Access Code Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="🔑 Masukkan Access Code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-300 focus:border-pink-500"
              />
              <div className="space-y-3">
                <Button 
                  onClick={handleGetAccess}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg shadow-lg"
                >
                  🎁 Get Access
                </Button>
                <Button 
                  onClick={handleVerifyCode}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg shadow-lg"
                  disabled={!accessCode}
                >
                  ✅ Verify
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: Form Registrasi */}
        {showRegistrationForm && (
          <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                🧾 STEP 2: Form Registrasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="👤 Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-300 focus:border-pink-500"
                />
              </div>
              
              <div className="space-y-2 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="🔒 Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-300 focus:border-pink-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg shadow-lg"
              >
                {loading ? '⏳ Processing...' : '🚀 Register Sekarang'}
              </Button>

              <div className="text-center">
                <button
                  onClick={() => {
                    setShowRegistrationForm(false);
                    setIsLogin(true);
                  }}
                  className="text-pink-400 hover:text-pink-300 text-sm font-medium"
                >
                  Sudah punya akun? Login 👉
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Auth Screen (Login/Register Options) */}
        {!showAccessCodePanel && !showRegistrationForm && (
          <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {isLogin ? '🔐 STEP 3: Login Page' : '🎯 Pilih Opsi'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isLogin && (
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowAccessCodePanel(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold text-lg shadow-lg"
                  >
                    📝 Register
                  </Button>
                  <Button
                    onClick={() => setIsLogin(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-lg shadow-lg"
                  >
                    🔑 Login
                  </Button>
                </div>
              )}

              {isLogin && (
                <>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="👤 Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-300 focus:border-cyan-500"
                    />
                  </div>
                  
                  <div className="space-y-2 relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="🔒 Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-300 focus:border-cyan-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <Button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-lg shadow-lg"
                  >
                    {loading ? '⏳ Processing...' : '🚀 Masuk'}
                  </Button>

                  <div className="text-center">
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                    >
                      Belum punya akun? Register 👉
                    </button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
