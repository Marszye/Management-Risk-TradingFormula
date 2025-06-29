
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

export const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showAccessCodePanel, setShowAccessCodePanel] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const motivationalQuote = "Lebih baik ga Entry daripada Rugi, Makanya semua tu Konfirmasi Dulu!";

  const handleGetAccess = () => {
    // Open lynk.id link
    window.open('https://lynk.id/marszye?fbclid=PAZXh0bgNhZW0CMTEAAacpTw4LqakuUW5KrhF_N55LISkjVcFpZxxW6MxTWWnydLKVXCbZT3sDiH6EFQ_aem_Crm0WJDeQOvx1VnJiZ1q5Q', '_blank');
  };

  const handleVerifyCode = () => {
    if (accessCode.toLowerCase() === 'hearme') {
      setShowAccessCodePanel(false);
      setShowRegistrationForm(true);
      setAccessCode('');
      toast({
        title: "Kode Benar!",
        description: "Silakan lengkapi form registrasi.",
      });
    } else {
      toast({
        title: "Kode salah",
        description: "Minta akses dulu ya!",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon isi username dan password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create account with email as username@trax.app
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
            title: "SESUAIKAN",
            description: "nama telah ada, buat nama yang lain",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Registrasi Berhasil!",
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
        title: "Error",
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
        title: "Data Tidak Lengkap",
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
          title: "Login Gagal",
          description: "Username atau password salah.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Quote */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-green-400">TRAX</h1>
          <p className="text-gray-300 text-sm italic px-4 leading-relaxed">
            {motivationalQuote}
          </p>
        </div>

        {/* STEP 1: Access Code Panel */}
        {showAccessCodePanel && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-green-400 text-center">Access Code Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="🔑 Masukkan Access Code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <div className="space-y-3">
                <Button 
                  onClick={handleGetAccess}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  🎁 Get Access
                </Button>
                <Button 
                  onClick={handleVerifyCode}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
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
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-green-400 text-center">Form Registrasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white pr-10"
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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                {loading ? 'Processing...' : 'Register Sekarang'}
              </Button>

              <div className="text-center">
                <button
                  onClick={() => {
                    setShowRegistrationForm(false);
                    setIsLogin(true);
                  }}
                  className="text-green-400 hover:text-green-300 text-sm"
                >
                  Sudah punya akun? Login
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Auth Screen (Login/Register Options) */}
        {!showAccessCodePanel && !showRegistrationForm && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-green-400 text-center">
                {isLogin ? 'STEP 3: Login Page' : 'Pilih Opsi'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isLogin && (
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowAccessCodePanel(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    Register
                  </Button>
                  <Button
                    onClick={() => setIsLogin(true)}
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Login
                  </Button>
                </div>
              )}

              {isLogin && (
                <>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2 relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pr-10"
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
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    {loading ? 'Processing...' : 'Masuk'}
                  </Button>

                  <div className="text-center">
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-green-400 hover:text-green-300 text-sm"
                    >
                      Belum punya akun? Register
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
