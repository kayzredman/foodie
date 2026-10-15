import { mkdirSync } from "node:fs";
import path from "node:path";
import { Pool } from "pg";

export type Row = Record<string, unknown>;

export type Db = {
  query<T extends Row>(sql: string, params?: unknown[]): Promise<T[]>;
  exec(sql: string): Promise<void>;
};

const schema = `
create table if not exists places (
  id text primary key,
  name text not null,
  category text not null,
  area text not null,
  city text not null,
  status text not null,
  currency text not null
);
create table if not exists dishes (
  id text primary key,
  place_id text not null references places (id),
  name text not null,
  category text not null,
  minutes integer not null,
  price_pesewas integer not null
);
create table if not exists orders (
  id text primary key,
  number integer not null,
  place_id text not null references places (id),
  status text not null,
  tender text not null,
  phone text not null,
  food_subtotal integer not null,
  food_promo integer not null,
  delivery_fee integer not null,
  delivery_promo integer not null,
  total integer not null,
  currency text not null,
  created_at timestamptz not null default now()
);
create table if not exists order_lines (
  order_id text not null references orders (id),
  dish_id text not null,
  name text not null,
  qty integer not null,
  price_pesewas integer not null
);
`;

const seedPlaces = `
insert into places (id, name, category, area, city, status, currency)
values ('auntie-munis', 'Auntie Muni''s', 'Grill', 'East Legon', 'Accra', 'Orderable', 'GHS')
on conflict (id) do nothing
`;

const seedDishes = `
insert into dishes (id, place_id, name, category, minutes, price_pesewas) values
  ('chicken', 'auntie-munis', 'Herb roast', 'Chicken', 35, 8500),
  ('jollof', 'auntie-munis', 'Jollof bowl', 'Jollof', 20, 4800),
  ('burger', 'auntie-munis', 'Cheese burger', 'Burger', 15, 6500),
  ('fries', 'auntie-munis', 'Loaded fries', 'Fries', 12, 2800)
on conflict (id) do nothing
`;

export async function openDb(): Promise<Db> {
  const databaseUrl = process.env.DATABASE_URL;
  const db = databaseUrl ? postgres(databaseUrl) : await embedded();
  for (const statement of schema.split(";").map((part) => part.trim()).filter(Boolean)) {
    await db.exec(statement);
  }
  await db.exec(seedPlaces);
  await db.exec(seedDishes);
  return db;
}

function postgres(databaseUrl: string): Db {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: /localhost|127\.0\.0\.1/.test(databaseUrl) ? undefined : { rejectUnauthorized: false },
  });
  return {
    async query<T extends Row>(sql: string, params?: unknown[]) {
      const result = await pool.query(sql, params);
      return result.rows as T[];
    },
    async exec(sql) {
      await pool.query(sql);
    },
  };
}

async function embedded(): Promise<Db> {
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = path.join(process.cwd(), ".data");
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  return {
    async query<T extends Row>(sql: string, params?: unknown[]) {
      const result = await client.query<T>(sql, params);
      return result.rows;
    },
    async exec(sql) {
      await client.exec(sql);
    },
  };
}
