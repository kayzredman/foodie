# Points and places

People can suggest a food spot. When someone else completes an order there, the suggester earns points. Points are split into cash, rank, and prizes. "Patronize" means a completed Foodie delivery order, not a visit or a check-in.

## Place lifecycle

| State | What the customer sees | Points |
| --- | --- | --- |
| Suggested | Only the suggester, on My submissions | None |
| In review | Suggester only, with "In review" | None |
| Live | Listed, with photos and the pin. No menu yet. Copy explains it is not taking orders. | None |
| Orderable | Menu, cart, and checkout work | Earn on qualifying orders |
| Rejected | Suggester only, with the reason and Edit | None |

A suggestion requires:

- Place name
- One category from the same set as Home (Chicken, Meat, Noodles, Pasta, Dessert, plus the rest of that list)
- A map pin
- At least one photo, at most five
- Optional hours and a short note

The first approved submission for a pin and name becomes the place of record. A later submission for the same spot is rejected as a duplicate and points stay with the original suggester. The suggester and the place owner can be different people. Only the suggester of record earns contribution points. Payouts to the place, if any, are a payment concern in [payments.md](payments.md), not points.

## Qualifying order

All of these must be true:

- The place is Orderable.
- The order status is Completed. Completed means delivered, not merely paid.
- The order is not cancelled and not refunded.
- The buyer is not the suggester.

If any check fails, the suggester earns nothing. Cancelling or refunding an order that already granted points reverses those points.

## How many points

Working numbers for design and copy. They can change without changing the screens.

- Gross points = food subtotal after promos, in major currency units, times 5. Delivery fees, taxes, and tips are excluded. A food subtotal of 20 earns 100 points.
- Rounding is to the nearest whole point. Halves round to even.
- When a place first becomes Orderable, the suggester gets a one-time approval bonus of 40 gross points, split with the same rule below.

Example. Someone else completes an order with RM 20 of food after promos. Gross points = 100.

## The three buckets

Every grant, including the approval bonus, is split:

| Bucket | Share | What it does | Resets |
| --- | --- | --- | --- |
| Cash | 50% | Checkout credit | No |
| Rank | 30% | Monthly leaderboard | 1st of the month, Asia/Kuala_Lumpur |
| Prize | 20% | Monthly prize eligibility | Same monthly reset |

Remainder after integer split goes to Rank. On 100 points that is 50 cash, 30 rank, 20 prize. On the 40-point approval bonus that is 20 cash, 12 rank, 8 prize.

Cash, rank, and prize are stored separately. Spending cash does not change rank or prize. The leaderboard sorts by rank points earned this month, not by cash balance.

## Spending cash

- 100 cash points = 1.00 in the market currency.
- At checkout, cash is applied after promos. See the calculation order in [payments.md](payments.md).
- Cap per order: 20% of the post-promo food subtotal, and never more than the cash balance.
- The user can apply a smaller amount, or none. The default on checkout is to apply the maximum allowed.
- Cash cannot push the gateway remainder below zero. If promos already zero the amount due, no cash is spent.

## Leaderboard and prizes

The leaderboard is monthly, public inside the app, and shows display name, avatar, rank points this month, and position. It resets on the 1st. Last month stays readable as a past board.

Prize eligibility that month:

- The top 10 by prize points, and
- Anyone with at least 200 prize points

Prizes are announced on the prizes screen for that month. The doc does not lock the prize list. The screen must support a title, a short description, a winner count, and a state of Upcoming, Open, or Awarded. Awarded shows winners. Cash prizes, if used, are granted as cash points, not as a bank transfer.

## Abuse rules

- Self-orders earn nothing.
- Two accounts at the same payout instrument or the same device do not earn from each other. Hold the points and show "Under review" on the suggester's wallet activity.
- Cancelled, refunded, and unpaid orders earn nothing. A later refund claws back the grant, including rank and prize for that month if the month is still open. If the month has closed, the clawback is applied to the current month's rank and prize, down to zero, and cash is reduced even if that makes the next redemption smaller.
- Photos that are stock, screenshots, or unrelated are a rejection reason, not a points event.
- Editing a live place does not grant the approval bonus again.

## Wallet activity

Each line shows date, place name, order reference or "Approval", gross points, and the three-way split. Reversals are their own lines, negative, tied to the original order.
