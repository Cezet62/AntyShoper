-- =============================================
-- Pozwól gościom składać zamówienia
-- Wykonaj w Supabase SQL Editor
-- =============================================

-- Usuń stare polityki dla orders (które blokowały insert)
DROP POLICY IF EXISTS "Orders are not publicly viewable" ON orders;
DROP POLICY IF EXISTS "Order items are not publicly viewable" ON order_items;

-- Pozwól każdemu tworzyć zamówienia (checkout jako gość)
CREATE POLICY "Anyone can create orders"
ON orders FOR INSERT
WITH CHECK (true);

-- Pozwól każdemu dodawać pozycje zamówienia
CREATE POLICY "Anyone can create order items"
ON order_items FOR INSERT
WITH CHECK (true);

-- Klient może zobaczyć swoje zamówienie po emailu (opcjonalne, na przyszłość)
-- CREATE POLICY "Customers can view own orders by email"
-- ON orders FOR SELECT
-- USING (customer_email = current_setting('request.jwt.claims')::json->>'email');

-- Admin nadal ma pełny dostęp (polityki już istnieją)
