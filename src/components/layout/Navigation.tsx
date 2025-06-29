
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
  X
} from 'lucide-react';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Play, label: 'Start Trade', path: '/trade' },
    { icon: BookOpen, label: 'Journal', path: '/journal' },
    { icon: RotateCcw, label: 'Reiteration', path: '/reiteration' },
  ];

  const NavLink = ({ item }: { item: typeof navItems[0] }) => (
    <button
      onClick={() => {
        navigate(item.path);
        setIsOpen(false);
      }}
      className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
        location.pathname === item.path
          ? 'bg-green-600 text-white'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <item.icon size={20} />
      <span className="font-medium">{item.label}</span>
    </button>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
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
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-green-400 mb-8">TIRAX</h1>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
