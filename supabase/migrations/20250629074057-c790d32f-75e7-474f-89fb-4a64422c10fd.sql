
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  balance DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create custom strategies table
CREATE TABLE public.strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  checklist JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trades table
CREATE TABLE public.trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  strategy_id UUID REFERENCES public.strategies(id),
  pair TEXT NOT NULL,
  lot_size DECIMAL(10,4) NOT NULL,
  stop_loss DECIMAL(10,4),
  take_profit DECIMAL(10,4),
  psychology_state TEXT NOT NULL,
  discipline_score INTEGER NOT NULL DEFAULT 0,
  result TEXT, -- 'pending', 'sl', 'tp'
  profit_loss DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Create journal entries table
CREATE TABLE public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  thoughts TEXT NOT NULL,
  problems TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reiteration loops table
CREATE TABLE public.reiteration_loops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  journal_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE NOT NULL,
  solution TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  progress_days INTEGER DEFAULT 0,
  daily_progress JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reiteration_loops ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for strategies
CREATE POLICY "Users can view own strategies" ON public.strategies
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own strategies" ON public.strategies
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own strategies" ON public.strategies
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own strategies" ON public.strategies
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for trades
CREATE POLICY "Users can view own trades" ON public.trades
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trades" ON public.trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trades" ON public.trades
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for journal entries
CREATE POLICY "Users can view own journal entries" ON public.journal_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal entries" ON public.journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal entries" ON public.journal_entries
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal entries" ON public.journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for reiteration loops
CREATE POLICY "Users can view own reiteration loops" ON public.reiteration_loops
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reiteration loops" ON public.reiteration_loops
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reiteration loops" ON public.reiteration_loops
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reiteration loops" ON public.reiteration_loops
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, balance)
  VALUES (new.id, 'user_' || substring(new.id::text, 1, 8), 0.00);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
