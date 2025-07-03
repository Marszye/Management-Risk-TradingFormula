
-- Create weekly_reflections table for the Anti-Amnesia Trader system
CREATE TABLE public.weekly_reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  biggest_mistake TEXT NOT NULL,
  dominant_emotion TEXT NOT NULL,
  main_lesson TEXT NOT NULL,
  bad_habit_to_remove TEXT NOT NULL,
  good_habit_to_build TEXT NOT NULL,
  week_start DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Enable RLS
ALTER TABLE public.weekly_reflections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own weekly reflections" 
  ON public.weekly_reflections 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly reflections" 
  ON public.weekly_reflections 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly reflections" 
  ON public.weekly_reflections 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weekly reflections" 
  ON public.weekly_reflections 
  FOR DELETE 
  USING (auth.uid() = user_id);
