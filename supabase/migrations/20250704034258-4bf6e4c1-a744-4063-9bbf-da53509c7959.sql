
-- Add profit_loss_percentage column to trades table
ALTER TABLE public.trades 
ADD COLUMN profit_loss_percentage numeric;
