
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

export const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const motivationalQuote = "Masuk bukan untuk untung cepat. Tapi untuk jadi versi kamu yang paling disiplin.";

  const handleVerification = () => {
    if (verificationCode.toLowerCase() === 'hearme') {
      // Open lynk.id link
      window.open('https://lynk.id/marszye?fbclid=PAZXh0bgNhZW0CMTEAAacpTw4LqakuUW5KrhF_N55LISkjVcFpZxxW6MxTWWnydLKVXCbZT3sDiH6EFQ_aem_Crm0WJDeQOvx1VnJiZ1q5Q', '_blank');
      setShowVerification(false);
      setIsLogin(false); // Show registration form
    } else {
      toast({
        title: "Kode Salah",
        description: "Masukkan kode yang benar untuk melanjutkan.",
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
      // Create account with email as username@tirax.app
      const email = `${username}@tirax.app`;
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
            description: "Nama telah ada, buat nama yang lain",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Akun Berhasil Dibuat!",
          description: "Silakan login dengan akun baru Anda.",
        });
        setIsLogin(true);
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
      const email = `${username}@tirax.app`;
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
          <h1 className="text-4xl font-bold text-green-400">TIRAX</h1>
          <p className="text-gray-300 text-sm italic px-4 leading-relaxed">
            {motivationalQuote}
          </p>
        </div>

        {/* Verification Modal */}
        {showVerification && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-green-400 text-center">Kode Verifikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="Masukkan kode verifikasi"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button 
                onClick={handleVerification}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                Get Access
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Registration/Login Form */}
        {!showVerification && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-green-400 text-center">
                {isLogin ? 'Login' : 'Daftar Akun'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isLogin && (
                <Button
                  onClick={() => setShowVerification(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Register
                </Button>
              )}

              {(isLogin || showVerification === false) && (
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
                    onClick={isLogin ? handleLogin : handleRegister}
                    disabled={loading}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Buat Akun')}
                  </Button>

                  <div className="text-center">
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-green-400 hover:text-green-300 text-sm"
                    >
                      {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}
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
