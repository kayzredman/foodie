# Flows

Screen ids are in [screens.md](screens.md). Point math is in [points.md](points.md). Charge math is in [payments.md](payments.md).

## Sign in

1. A-01 Splash shows the courier, "Foodie.", and "Delicious food, delivered fast.", then opens A-02.
2. A-02 accepts an email or a phone number, and a password. "Keep me signed in" stores the session on this device. "Forgot Password?" opens A-06.
3. Invalid email stays on A-03 with "That email doesn't look right" under the field. The password is left as the user typed it.
4. A valid submit becomes A-04. The button spinner replaces the label. A success continues to O-01. A wrong password shows "That password doesn't match" under the password field and restores the button.
5. Google and Apple are account login. They skip the password. A new social account still creates a Foodie profile and lands on O-01.
6. Sign Up opens A-05. Create account lands on O-01. A-06 sends a reset and shows A-07. A-07 returns to A-02.

## Browse and order

1. O-01 uses the selected address. The chevron opens O-02. Changing the address reloads restaurants and fees.
2. The banner "ORDER NOW" scrolls to Categories. A category opens O-04. See all opens O-04 for that category.
3. Search opens O-03. Results can be restaurants, dishes, or community places. No results offers "Suggest this place", which opens L-01 with the query as the name.
4. A restaurant row opens O-05. A food card opens O-06. The green plus on a card adds one and leaves the user on the list, with the cart badge incremented.
5. O-06 Add to cart returns to the previous list. Cart tab or the badge opens O-07.
6. O-07 empty state points to Home. Filled state edits quantities, removes lines, and continues to O-08.
7. Order again on Home adds that dish at quantity one and opens O-07.

## Checkout and pay

1. O-08 shows address, items, promo, Foodie cash, payment method, and total.
2. A code from a deal card or from C-02 arrives prefilled. The user can clear it. A bad code shows "That code doesn't work" and does not change the total.
3. Foodie cash defaults to the maximum the cap allows. The user can turn it off or lower it. The row shows points and the currency value.
4. The payment row opens Y-01. Card opens Y-02. FPX opens Y-03. Apple Pay, Touch 'n Go, and GrabPay select that method and return to O-08.
5. Place order is disabled until a method is selected, unless the remainder is already 0.
6. Place order moves to Y-04. Redirect methods show "Finish payment in your bank" until the app is reopened.
7. Failure stays on O-08 with Y-05 copy: "Payment didn't go through." Cart, code, and points are unchanged.
8. Success opens O-09, then O-10. The order does not exist before the server marks the payment paid.
9. Cancel on the redirect holding screen voids the attempt and returns to O-08.

## Track and reorder

1. O-10 advances Confirmed → Preparing → Picked up → Arriving → Delivered.
2. Before Picked up, the customer can cancel. Cancel refunds the gateway charge, restores cash points, and reverses any contribution points from that order.
3. Delivered files the order into O-11 and O-12. Reorder from the receipt builds a new cart and opens O-07.
4. The bell on Home opens C-04. An order notification opens O-10.

## Suggest a place

1. Profile opens L-01. Name and category are required to continue.
2. L-02 asks for location permission. Denied state explains why and offers Open settings. The user drops a pin and confirms.
3. L-03 takes one to five photos from the camera or the library. Submit is disabled with zero photos.
4. Submit creates the place as In review and opens L-04.
5. Rejection opens L-06 with the reason. Edit returns to L-01 with the previous values.
6. Approval without a menu makes the place Live. It can appear in search and on the map, and O-05 shows "Not taking orders yet".
7. When a menu exists, the place becomes Orderable. The suggester receives the one-time approval bonus. O-05 then behaves like any other restaurant.

Duplicate submissions for the same spot are rejected and do not move points.

## Earn

1. A different customer completes a delivered order at an Orderable place.
2. Gross points are computed from the post-promo food subtotal and split into cash, rank, and prize.
3. The suggester sees a new line on R-01. Rank and prize also move R-02 and R-03.
4. The buyer's own orders never pay the buyer as suggester.
5. A refund or cancel writes a reversal line and undoes that grant.

## Rewards

1. R-01 is the wallet. It links to R-02, R-03, and R-04.
2. R-02 defaults to this month. Last month is read-only.
3. R-03 shows the current prize, whether the user is in the top 10 or over 200 prize points, and winners after the month is awarded.
4. Spending cash happens only on O-08. It does not change rank or prize.

## Admin

1. An admin opens the portal. D-01 shows today’s Accra totals.
2. D-02 lists places In review. Live lists the place without a menu. Orderable grants the approval bonus in [points.md](points.md). Reject asks for a reason and the suggester sees it on L-06.
3. D-03 refund, before the courier picks up, returns the gateway charge and reverses points, the same rule as a customer cancel.
4. D-04 shows adapter statuses. A failed payment never becomes an order.

## Account tabs

- Home is O-01.
- Saved is C-01. A heart on O-05 or O-06 writes here. Empty state sends the user to Home.
- Cart is O-07.
- Offers is C-02. Apply stores the code and opens O-08 if the cart is non-empty, otherwise it stores the code and confirms "We'll apply this at checkout."
- Profile is C-03, which reaches points, orders (O-11), addresses (O-02), payment methods (Y-01), suggest (L-01), submissions (L-04), and log out. Log out returns to A-02.
