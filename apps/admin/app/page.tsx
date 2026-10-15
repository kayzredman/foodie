import { revalidatePath } from "next/cache";
import type { CSSProperties } from "react";

type Dish = {
  id: string;
  name: string;
  category: string;
  minutes: number;
  price_pesewas: number;
};

type OrderLine = { name: string; qty: number; price_pesewas: number };

type Order = {
  id: string;
  number: number;
  status: string;
  tender: string;
  total: number;
  lines: OrderLine[];
};

const apiUrl = process.env.FOODIE_API_URL ?? "http://localhost:8787";

export const dynamic = "force-dynamic";

export default async function Desk() {
  const [menu, orders, error] = await load();
  return (
    <main style={{ maxWidth: 880, margin: "0 auto", padding: 32 }}>
      <p style={{ margin: 0, color: "#146b34", fontWeight: 700, letterSpacing: "-0.04em", fontSize: 28 }}>Foodie.</p>
      <h1 style={{ margin: "8px 0 4px", fontSize: 22 }}>Accra desk</h1>
      <p style={{ margin: 0, color: "#6b7280" }}>Auntie Muni's, East Legon. Orders appear after the API marks them paid.</p>
      {error ? (
        <p style={{ marginTop: 24, padding: 16, background: "#fef2f2", color: "#e11d2e", borderRadius: 16 }}>{error}</p>
      ) : null}
      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18 }}>Menu</h2>
        <form action={placeOrder} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
          <label>
            Dish
            <select name="dish" style={field}>
              {menu.map((dish) => (
                <option key={dish.id} value={dish.id}>
                  {dish.name} · {ghs(Number(dish.price_pesewas))}
                </option>
              ))}
            </select>
          </label>
          <label>
            <input type="checkbox" name="foodie30" /> FOODIE30, 30% off food
          </label>
          <button type="submit" style={button}>
            Place a paid test order
          </button>
        </form>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18 }}>Paid orders</h2>
        {orders.length === 0 ? <p style={{ color: "#6b7280" }}>No paid orders yet.</p> : null}
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((order) => (
            <article key={order.id} style={{ background: "#fff", borderRadius: 16, padding: 16 }}>
              <strong>#{order.number}</strong>
              <span style={{ color: "#6b7280" }}> · {order.tender} · {order.status}</span>
              <div>{order.lines.map((line) => `${line.qty} ${line.name}`).join(", ")}</div>
              <div style={{ fontVariantNumeric: "tabular-nums" }}>{ghs(Number(order.total))}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

async function placeOrder(formData: FormData) {
  "use server";
  const dish = String(formData.get("dish") ?? "chicken");
  await fetch(`${apiUrl}/orders`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      lines: [{ id: dish, qty: 1 }],
      foodie30: formData.get("foodie30") === "on",
      freeship: false,
      tender: "mtn",
      phone: "0244000000",
    }),
  });
  revalidatePath("/");
}

async function load(): Promise<[Dish[], Order[], string]> {
  try {
    const [menuRes, orderRes] = await Promise.all([fetch(`${apiUrl}/menu`, { cache: "no-store" }), fetch(`${apiUrl}/orders`, { cache: "no-store" })]);
    if (!menuRes.ok || !orderRes.ok) return [[], [], "The API did not answer. Start it on this Mac, or set FOODIE_API_URL."];
    const menu = (await menuRes.json()) as { dishes: Dish[] };
    const orders = (await orderRes.json()) as { orders: Order[] };
    return [menu.dishes, orders.orders, ""];
  } catch {
    return [[], [], `Cannot reach the API at ${apiUrl}.`];
  }
}

function ghs(pesewas: number) {
  return `GHS ${(pesewas / 100).toFixed(2)}`;
}

const field: CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 6,
  minHeight: 44,
  borderRadius: 999,
  border: "1px solid #e4e7ec",
  padding: "0 16px",
  background: "#fff",
};

const button: CSSProperties = {
  minHeight: 48,
  border: 0,
  borderRadius: 999,
  background: "#146b34",
  color: "#fff",
  fontWeight: 700,
};
