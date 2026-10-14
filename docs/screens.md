# Screens

Every screen to design. **Recorded** means it appears in the screen recording. **Specified** means it is required for the full product and is not in the clip. Visual rules are in [design-system.md](design-system.md). Behavior is in [flows.md](flows.md).

The bottom bar (Home, Saved, Cart, Offers, Profile) is on the five roots only. It is hidden from checkout onward, and hidden on dish detail, place suggestion, payment, and tracking detail.

## Auth

| ID | Screen | Source | States |
| --- | --- | --- | --- |
| A-01 | Splash | Recorded | Courier illustration, wordmark Foodie., "Delicious food, delivered fast." Auto-advances. |
| A-02 | Login | Recorded | Empty fields. Email filled. Password hidden. "Keep me signed in" checked. |
| A-03 | Login error | Recorded | Email stroke and helper: "That email doesn't look right." |
| A-04 | Login loading | Recorded | Log In label replaced by a spinner. Fields locked. |
| A-05 | Sign up | Specified | Name, email or phone, password, primary Create account, Google, Apple, link back to Log In. |
| A-06 | Forgot password | Specified | Email or phone, Send link. |
| A-07 | Reset sent | Specified | "Check your email" and Back to log in. |

Login copy that is already fixed: title "Welcome Back"; hero "Foodie." and "Hot meals, right at your door."; primary "Log In"; divider "Or continue with"; footer "Don't have an account? Sign Up".

## Order

| ID | Screen | Source | States |
| --- | --- | --- | --- |
| O-01 | Home | Recorded | Deliver to Home, 12 Jalan Ampang, Kuala Lumpur. Banner "FAST & FREE DELIVERY" / "ORDER NOW". Categories. Order again. Deals. Popular restaurants. |
| O-02 | Address picker | Specified | Saved addresses, current location, add address. Selecting one returns to Home. |
| O-03 | Search | Specified | Empty prompt, typing, results, no results. |
| O-04 | Category | Recorded | Two-column food cards. See the dish table in [product-brief.md](product-brief.md). See all on Home opens this. |
| O-05 | Restaurant | Specified | Hero, fee chip, menu sections, food cards. Community places that are only Live show photos and "Not taking orders yet" instead of a menu. |
| O-06 | Dish | Specified | Photo, name, price, calories, time, description, quantity, Add to cart. |
| O-07 | Cart | Specified | Empty, and filled with line items, quantities, subtotal, and Go to checkout. |
| O-08 | Checkout | Specified | Address, items summary, promo field, Foodie cash toggle and amount, payment row, total, Place order. |
| O-09 | Order placed | Specified | Confirmation, order number, View order. |
| O-10 | Tracking | Specified | Map, courier status, place, items, help. Statuses: Confirmed, Preparing, Picked up, Arriving, Delivered. |
| O-11 | History | Specified | List of past orders. Empty. |
| O-12 | Receipt | Specified | Items, promos, cash applied, method, total, refund state if any. |

Home sections use the recorded labels: Categories, Order again, Deals for you, Popular restaurants near you. Deal cards use `FOODIE30` and `FREESHIP`.

## Payment

These sit on top of checkout or replace it temporarily. Rules are in [payments.md](payments.md).

| ID | Screen | Source | States |
| --- | --- | --- | --- |
| Y-01 | Payment methods | Specified | Card, Apple Pay, FPX, Touch 'n Go, GrabPay. Selected radio. Add card. |
| Y-02 | Add card | Specified | Number, expiry, CVC, name. Field errors. Saving. |
| Y-03 | FPX banks | Specified | Bank list, then the redirect holding state. |
| Y-04 | Processing | Specified | Spinner on Place order, or the holding line "Finish payment in your bank" with Cancel. |
| Y-05 | Payment failed | Specified | Checkout unchanged, banner "Payment didn't go through." Retry and change method. |

## Places

| ID | Screen | Source | States |
| --- | --- | --- | --- |
| L-01 | Suggest a place | Specified | Name, category, note, hours. Next is disabled until name and category are set. |
| L-02 | Pin | Specified | Map, search, draggable pin, Drop pin. Permission denied. |
| L-03 | Photos | Specified | Camera, library, one to five tiles, remove. Submit disabled until one photo exists. |
| L-04 | My submissions | Specified | Empty, and rows for Suggested, In review, Live, Orderable, Rejected. |
| L-05 | Place detail | Specified | Photos, pin, suggester, status. Orderable places show the menu and Order. Live places do not. |
| L-06 | Rejected | Specified | Reason and Edit, which reopens the suggestion. |

Entry points: Profile → Suggest a place, and Profile → My submissions. A Live or Orderable place is also reachable from Search and from Home when it is near the address.

## Rewards

| ID | Screen | Source | States |
| --- | --- | --- | --- |
| R-01 | Wallet | Specified | Cash balance in points and in currency, rank this month, prize points this month, activity list. |
| R-02 | Leaderboard | Specified | This month, last month, top list, the current user's pinned row if they are off-screen. |
| R-03 | Prizes | Specified | Upcoming, Open, Awarded. Eligibility line for the 200-point threshold and the top 10. |
| R-04 | How points work | Specified | Short explanation of the split, the 20% checkout cap, and that self-orders do not count. |

Entry point: Profile → Points.

## Account

| ID | Screen | Source | States |
| --- | --- | --- | --- |
| C-01 | Saved | Specified | Empty, and saved restaurants and dishes. Tab root. |
| C-02 | Offers | Specified | `FOODIE30` and `FREESHIP` plus any other active offers. Apply sends the code to checkout. Tab root. |
| C-03 | Profile | Specified | Name, email, Points, Orders, Addresses, Payment methods, Suggest a place, My submissions, Log out. Tab root. |
| C-04 | Notifications | Specified | Order updates. Opened from the bell on Home. |

Cart is a tab root and uses O-07. Home uses O-01.

## Admin

Desktop, not a phone tab. Staff sign in with Clerk and only see this portal when their role is admin.

| ID | Screen | Source | States |
| --- | --- | --- | --- |
| D-01 | Dashboard | Specified | Today’s order count, amount paid, places waiting for review, refund count. |
| D-02 | Place review | Specified | Queue of submissions. Actions: Live, Orderable, Reject with a reason. |
| D-03 | Orders | Specified | Order, place, payment method, status. Refund before pickup. |
| D-04 | Payments | Specified | Intent, method, amount, Paid / Failed / Refund pending. Read only until a gateway is connected. |
