
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Settings, 
  Play, 
  BookOpen, 
  RotateCcw, 
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { icon: Home, label: '🏠 Dashboard', path: '/' },
    { icon: Settings, label: '⚙️ Settings', path: '/settings' },
    { icon: Play, label: '🚀 Start Trade', path: '/trade' },
    { icon: BookOpen, label: '📝 Journal', path: '/journal' },
    { icon: RotateCcw, label: '🔄 Reiteration', path: '/reiteration' },
  ];

  const NavLink = ({ item }: { item: typeof navItems[0] }) => (
    <button
      onClick={() => {
        navigate(item.path);
        setIsOpen(false);
      }}
      className={`flex items-center space-x-3 w-full p-4 rounded-xl transition-all duration-300 ${
        location.pathname === item.path
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
          : 'text-gray-300 hover:bg-gradient-to-r hover:from-purple-800/50 hover:to-pink-800/50 hover:text-white hover:transform hover:scale-105'
      }`}
    >
      <item.icon size={24} />
      <span className="font-semibold text-lg">{item.label}</span>
    </button>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-purple-600 to-pink-600 border border-purple-500/30 rounded-xl text-white shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-gray-900 via-purple-900/50 to-indigo-900 border-r border-purple-500/30 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              TRAX
            </h1>
            <Sparkles className="ml-2 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          
          <nav className="space-y-3">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Button
              onClick={handleLogout}
              className="w-full justify-start bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold text-lg shadow-lg"
            >
              <LogOut className="mr-3 h-5 w-5" />
              🚪 Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
