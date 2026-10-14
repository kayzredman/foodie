import { createContext, useMemo, useState, type ReactNode } from "react";
import { use } from "react";

import type { Tender } from "@/lib/catalog";
import { quote, type Line } from "@/lib/quote";

export type Session = {
  name: string;
  identity: string;
};

export type Order = {
  number: string;
  lines: Line[];
  total: number;
  tender: Tender;
  paymentId: string;
  step: number;
};

type Store = {
  session: Session | null;
  signIn: (session: Session) => void;
  signOut: () => void;
  lines: Line[];
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  foodie30: boolean;
  freeship: boolean;
  togglePromo: (code: "FOODIE30" | "FREESHIP") => void;
  order: Order | null;
  placeOrder: (input: { paymentId: string; tender: Tender }) => void;
  setStep: (step: number) => void;
};

const StoreContext = createContext<Store | null>(null);

let orderSequence = 1048;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [foodie30, setFoodie30] = useState(false);
  const [freeship, setFreeship] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const value = useMemo<Store>(
    () => ({
      session,
      signIn: setSession,
      signOut: () => setSession(null),
      lines,
      add: (id) => {
        setLines((current) => {
          const found = current.find((line) => line.id === id);
          if (!found) return [...current, { id, qty: 1 }];
          return current.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line));
        });
      },
      setQty: (id, qty) => {
        setLines((current) =>
          qty <= 0 ? current.filter((line) => line.id !== id) : current.map((line) => (line.id === id ? { ...line, qty } : line)),
        );
      },
      foodie30,
      freeship,
      togglePromo: (code) => {
        if (code === "FOODIE30") setFoodie30((on) => !on);
        else setFreeship((on) => !on);
      },
      order,
      placeOrder: ({ paymentId, tender }) => {
        const bill = quote(lines, foodie30, freeship);
        const number = String(orderSequence);
        orderSequence += 1;
        setOrder({
          number,
          lines,
          total: bill.total,
          tender,
          paymentId,
          step: 0,
        });
        setLines([]);
        setFoodie30(false);
        setFreeship(false);
      },
      setStep: (step) => {
        setOrder((current) => (current ? { ...current, step } : current));
      },
    }),
    [session, lines, foodie30, freeship, order],
  );

  return <StoreContext value={value}>{children}</StoreContext>;
}

export function useStore() {
  const store = use(StoreContext);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}
