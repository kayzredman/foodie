import type { Tender } from "./catalog";

export type PaymentResult = {
  status: "paid" | "failed";
  paymentId: string;
};

const seen = new Map<string, PaymentResult>();
let sequence = 1048;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fake Paystack driver. The screen waits for this result before an order exists. */
export async function confirmPayment(input: {
  idempotencyKey: string;
  amountPesewas: number;
  currency: "GHS";
  tender: Tender;
  outcome: "paid" | "failed";
}): Promise<PaymentResult> {
  const prior = seen.get(input.idempotencyKey);
  if (prior) return prior;
  await wait(700);
  const paymentId = `pi_${sequence}`;
  sequence += 1;
  const result: PaymentResult = {
    status: input.outcome,
    paymentId,
  };
  seen.set(input.idempotencyKey, result);
  return result;
}
