import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { openDb, type Db, type Row } from "./db";
import { quote, type Line } from "./quote";

const port = Number(process.env.PORT ?? 8787);
const placeId = "auntie-munis";
const tenders = new Set(["mtn", "vod", "atl", "card"]);

const dbPromise = openDb();

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    send(res, 204, {});
    return;
  }
  try {
    const db = await dbPromise;
    const url = new URL(req.url ?? "/", "http://localhost");
    if (req.method === "GET" && url.pathname === "/health") {
      send(res, 200, { ok: true, service: "foodie-api" });
      return;
    }
    if (req.method === "GET" && url.pathname === "/places") {
      send(res, 200, { places: await db.query("select * from places order by name") });
      return;
    }
    if (req.method === "GET" && url.pathname === "/menu") {
      send(res, 200, { dishes: await db.query("select * from dishes where place_id = $1 order by name", [placeId]) });
      return;
    }
    if (req.method === "POST" && url.pathname === "/quotes") {
      const body = await readJson(req);
      const bill = await price(db, body);
      send(res, 200, { currency: "GHS", ...bill });
      return;
    }
    if (req.method === "GET" && url.pathname === "/orders") {
      send(res, 200, { orders: await listOrders(db) });
      return;
    }
    if (req.method === "POST" && url.pathname === "/orders") {
      const body = await readJson(req);
      const tender = String(body.tender ?? "");
      if (!tenders.has(tender)) {
        send(res, 400, { error: "Choose MTN MoMo, Telecel Cash, AirtelTigo Money, or card" });
        return;
      }
      const phone = String(body.phone ?? "");
      if (tender !== "card" && phone.replace(/\D/g, "").length < 9) {
        send(res, 400, { error: "Enter the MoMo number" });
        return;
      }
      const bill = await price(db, body);
      if (bill.food <= 0) {
        send(res, 400, { error: "Add a dish" });
        return;
      }
      const paid = fakePaystack();
      if (paid.status !== "paid") {
        send(res, 402, { error: "Payment was not completed" });
        return;
      }
      const order = await insertOrder(db, body.lines as Line[], bill, tender, phone);
      send(res, 201, { order });
      return;
    }
    send(res, 404, { error: "Not found" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    send(res, 400, { error: message });
  }
});

server.listen(port, () => {
  console.log(`Foodie API listening on ${port}`);
});

function fakePaystack() {
  return { status: "paid" as const, provider: "paystack-fake" };
}

async function price(db: Db, body: { lines?: Line[]; foodie30?: boolean; freeship?: boolean }) {
  const lines = normalizeLines(body.lines);
  const dishes = await db.query<{ id: string; price_pesewas: number }>(
    "select id, price_pesewas from dishes where place_id = $1",
    [placeId],
  );
  const prices = new Map(dishes.map((dish) => [dish.id, Number(dish.price_pesewas)]));
  const priced = lines.map((line) => {
    const amount = prices.get(line.id);
    if (amount == null) throw new Error(`Unknown dish ${line.id}`);
    return { price: amount, qty: line.qty };
  });
  return quote(priced, Boolean(body.foodie30), Boolean(body.freeship));
}

function normalizeLines(lines: Line[] | undefined): Line[] {
  if (!Array.isArray(lines)) throw new Error("Add a dish");
  return lines.map((line) => {
    const qty = Number(line.qty);
    if (!line.id || !Number.isInteger(qty) || qty < 1) throw new Error("Each dish needs a quantity");
    return { id: String(line.id), qty };
  });
}

async function insertOrder(
  db: Db,
  lines: Line[],
  bill: { food: number; foodOff: number; delivery: number; deliveryOff: number; total: number },
  tender: string,
  phone: string,
) {
  const normalized = normalizeLines(lines);
  const count = await db.query<{ count: string }>("select count(*)::text as count from orders");
  const number = 1048 + Number(count[0]?.count ?? 0);
  const id = randomUUID();
  await db.exec("begin");
  try {
    await db.query(
      `insert into orders (
        id, number, place_id, status, tender, phone,
        food_subtotal, food_promo, delivery_fee, delivery_promo, total, currency
      ) values ($1,$2,$3,'paid',$4,$5,$6,$7,$8,$9,$10,'GHS')`,
      [id, number, placeId, tender, phone, bill.food, bill.foodOff, bill.delivery, bill.deliveryOff, bill.total],
    );
    for (const line of normalized) {
      const dish = await db.query<{ name: string; price_pesewas: number }>(
        "select name, price_pesewas from dishes where id = $1",
        [line.id],
      );
      const row = dish[0];
      if (!row) throw new Error(`Unknown dish ${line.id}`);
      await db.query(
        "insert into order_lines (order_id, dish_id, name, qty, price_pesewas) values ($1,$2,$3,$4,$5)",
        [id, line.id, row.name, line.qty, Number(row.price_pesewas)],
      );
    }
    await db.exec("commit");
  } catch (error) {
    await db.exec("rollback");
    throw error;
  }
  const orders = await listOrders(db);
  const order = orders.find((item) => item.id === id);
  if (!order) throw new Error("Order was not saved");
  return order;
}

async function listOrders(db: Db) {
  const orders = await db.query<{ id: string } & Row>(
    "select * from orders order by created_at desc limit 50",
  );
  if (orders.length === 0) return [];
  const ids = orders.map((order) => order.id);
  const lines = await db.query<Row>(
    `select * from order_lines where order_id = any($1::text[])`,
    [ids],
  );
  return orders.map((order) => ({
    ...order,
    lines: lines.filter((line) => line.order_id === order.id),
  }));
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": process.env.CORS_ORIGIN ?? "*",
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "GET,POST,OPTIONS",
  });
  res.end(status === 204 ? "" : JSON.stringify(body));
}

async function readJson(req: IncomingMessage): Promise<{ lines?: Line[]; foodie30?: boolean; freeship?: boolean; tender?: string; phone?: string }> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 100_000) throw new Error("Request is too large");
    chunks.push(buffer);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
    lines?: Line[];
    foodie30?: boolean;
    freeship?: boolean;
    tender?: string;
    phone?: string;
  };
}
