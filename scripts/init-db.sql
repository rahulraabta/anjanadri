CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_purchase NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_addresses (
  id SERIAL PRIMARY KEY,
  customer_email TEXT NOT NULL,
  label TEXT DEFAULT 'Default',
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT DEFAULT 'IN'
);
