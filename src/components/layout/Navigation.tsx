
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
          ? 'bg-purple-200 text-purple-800 shadow-lg transform scale-105'
          : 'text-slate-600 hover:bg-lavender-100 hover:text-purple-700 hover:transform hover:scale-105'
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
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-purple-200 border border-purple-300 rounded-xl text-purple-800 shadow-lg"
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
      <div className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-purple-200 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-4xl font-bold text-purple-600">
              TRAX
            </h1>
            <Sparkles className="ml-2 h-6 w-6 text-amber-400 animate-pulse" />
          </div>
          
          <nav className="space-y-3">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Button
              onClick={handleLogout}
              className="w-full justify-start bg-rose-200 hover:bg-rose-300 text-rose-800 font-semibold text-lg shadow-lg"
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
