-- =============================================
-- Pozwól gościom składać zamówienia
-- Wykonaj w Supabase SQL Editor
-- =============================================

-- Usuń stare polityki
DROP POLICY IF EXISTS "Orders are not publicly viewable" ON orders;
DROP POLICY IF EXISTS "Order items are not publicly viewable" ON order_items;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;

-- Pozwól roli anon tworzyć zamówienia (guest checkout)
CREATE POLICY "Guest can insert orders"
ON orders FOR INSERT TO anon
WITH CHECK (true);

-- Pozwól roli anon dodawać pozycje zamówienia
CREATE POLICY "Guest can insert order items"
ON order_items FOR INSERT TO anon
WITH CHECK (true);

-- Pozwól roli anon odczytywać zamówienia (SuccessPage potrzebuje order_number)
CREATE POLICY "Guest can view own order"
ON orders FOR SELECT TO anon
USING (true);

-- Admin nadal ma pełny dostęp (polityki już istnieją z schema.sql)
