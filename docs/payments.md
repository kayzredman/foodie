# Payments

Payments are specified now and connected later. Checkout can take a gateway charge, Foodie cash, and a promo in one order. No gateway vendor is selected in this pass. The app depends on an adapter, not on a vendor SDK shape, so Stripe, a Malaysian acquirer, or another provider can be wired without redesigning checkout.

The sample address is in Kuala Lumpur. Catalog strings copied from the recording still show `$`. New charges and examples in this doc use MYR. The adapter always takes an explicit currency.

## Tenders

Applied in this order:

1. Food subtotal.
2. Food promo, such as `FOODIE30` for 30% off food.
3. Delivery fee.
4. Delivery promo, such as `FREESHIP`.
5. Foodie cash, up to the cap in [points.md](points.md): 20% of post-promo food subtotal, and no more than the cash balance.
6. Remainder to the payment gateway.

A promo code is entered on checkout or applied from a deal card. Invalid codes fail inline: "That code doesn't work." Only one food promo and one delivery promo apply. The two sample codes may stack because they touch different lines.

If the remainder is 0, no intent is created and the order can be placed. If the remainder is above 0, the user must have a selected method and a successful payment before the order exists.

Worked example, MYR, ignoring the clip's dollar menu:

- Food RM 40.00
- `FOODIE30` → food RM 28.00
- Delivery RM 5.00, no free-delivery code
- Cash cap = 20% of 28.00 = RM 5.60, if the balance covers it
- Gateway remainder = 28.00 + 5.00 − 5.60 = RM 27.40

## Methods

| Method | In the UI | How it confirms | Saved? |
| --- | --- | --- | --- |
| Card | Brand, last four | In-app confirmation | Yes |
| Apple Pay | Apple Pay mark | System sheet | No, the wallet is the source |
| FPX | Bank list | Redirect back to the app | No |
| Touch 'n Go | Touch 'n Go mark | App switch, then return | No |
| GrabPay | GrabPay mark | App switch, then return | No |

Google on the login screen is an account login, not a payment method. Google Pay is out of this version.

Adding a card collects number, expiry, CVC, and name. The app never stores the PAN or CVC. It stores a gateway token, brand, last four, and expiry. FPX asks for a bank on the payment sheet, then leaves the app.

## Checkout states

| State | Screen behavior |
| --- | --- |
| No method | Place order is disabled. The payment row says "Add a payment method". |
| Method selected | Remainder and method are visible. Place order is enabled. |
| Processing | Place order shows a spinner and ignores repeat taps. Back is disabled. |
| Redirected | A holding screen: "Finish payment in your bank" with Cancel. Returning to the app resumes the same attempt. |
| Failed | Stay on checkout. Message: "Payment didn't go through." The cart, promos, and unspent points are unchanged. The user can retry or pick another method. |
| Paid | Leave checkout for Order placed. |

An order record is created only after the adapter reports paid. A failed, cancelled, or abandoned attempt does not create an order, does not capture points, and does not debit cash points. Cash points are debited only when the payment is paid, in the same step that creates the order. If that step fails after the gateway has captured money, the adapter refunds the charge and does not debit points.

## Adapter

Vendor code sits behind this contract. Screen and order code call only these operations.

**Create intent.** Input: draft id, amount, currency, method type, customer id, idempotency key. Output: intent id, status `requires_action` or `processing`, and either a client token or a redirect URL. Amount is the gateway remainder only, after promos and cash.

**Confirm.** Input: intent id and the client result (card confirmation, Apple Pay payload, or the return from a redirect). Output: `processing` or `paid` or `failed`, plus a failure message safe to show.

**Webhook.** The gateway calls the server. Events: `paid`, `failed`, `refunded`. The server verifies the signature, dedupes on event id, and is safe to retry. The client does not decide that a payment succeeded. The client waits until the server, informed by confirm or webhook, says paid.

**Refund.** Input: intent id, amount, idempotency key, reason. Output: refund id and `pending` or `refunded` or `failed`.

Idempotency keys are required on create and refund. Repeating a key returns the original result.

## Order and refund rules

- Place order creates the intent. The order stays uncreated until paid.
- Full cancel before the courier picks up: refund the gateway amount in full, restore cash points spent, and reverse any contribution points already granted for that order.
- After pickup, the customer contacts support. Partial refunds are allowed by the adapter but have no self-serve screen in this version.
- A refund webhook updates the order to Refunded and runs the same point reversal as a cancel.
- Duplicate webhooks must not double-refund or double-reverse points.

## What is left until a gateway is chosen

- Vendor account, keys, and which of the five methods that vendor actually supports.
- The real client SDK and the redirect return URLs.
- Certificate and webhook endpoint.
- Place payouts. When a place is orderable, the place may later be paid through the same adapter (connected account or a payout instruction). Commission is not set. No merchant screen is in this documentation pass.
- Cash-out of points to a bank. Cash points are checkout credit only.
