# Foodie product brief

Foodie is a food delivery app with a second loop: people can put a food spot on the map, and they earn points when someone else completes an order there. Points split into checkout credit, a monthly leaderboard, and monthly prizes.

The visual source is the screen recording in the project root, `ScreenRecording_10-11-2026 09-51-44_1.MP4`. It is a phone capture of a TikTok from @dailyflutterui_2001 showing a Flutter Foodie UI on an iPhone 17 Pro Max simulator (iOS 26.3). The clip is about 22 seconds. It shows splash, login, home, and a category menu. The rest of the product in these docs is specified so the full order flow, places, points, and payments can be designed.

## Who it is for

- People ordering meals to an address they already use.
- People who know a stall, cafe, or restaurant that is missing from the app and want credit when others order from it.

The sample market in the recording is Kuala Lumpur. The signed-in delivery address is **Home, 12 Jalan Ampang, Kuala Lumpur**.

## What the recording already defines

The wordmark is **Foodie.** with a period. Two lines of voice are already set:

- Splash: "Delicious food, delivered fast."
- Login hero: "Hot meals, right at your door."

Login is "Welcome Back", with email or phone, password, "Keep me signed in", "Forgot Password?", a green **Log In** button, Google and Apple, and "Don't have an account? Sign Up". An invalid email shows "That email doesn't look right". The button can show a loading spinner.

Home is a delivery app, not a single-restaurant menu:

- Deliver-to row with an avatar, the label Home, the Ampang address, and a bell.
- Banner: "FAST & FREE DELIVERY" and "ORDER NOW".
- Categories with a See all link. Visible labels: Chicken, Meat, Noodles, Pasta, Dessert.
- Order again: Cheese Burger, yesterday, $4.99; Tonkotsu Ramen, 3 days ago.
- Deals: 30% off the whole order with code `FOODIE30`; free delivery with code `FREESHIP`.
- Popular restaurants near you, with delivery-fee badges such as Free delivery and $2.50 delivery.
- Bottom bar: Home, Saved, Cart, Offers, Profile.

The category screen is a two-column menu of dishes with price, calories, time, and a green add button. Visible dishes:

| Dish | Price | Calories | Time |
| --- | --- | --- | --- |
| Yellow bowl (name not readable in the clip) | $18.90 | 1240 | 20 min |
| Wrap (name not readable in the clip) | $6.49 | 520 | 12 min |
| Herb Roast Chicken | $13.90 | 980 | 35 min |
| Grilled Ribeye Steak | $24.90 | 690 | 35 min |
| Classic Hot Dog | $3.99 | 380 | 10 min |
| Beef Kebab Skewers | $10.90 | 450 | 20 min |

Catalog prices in the recording use `$`. The Kuala Lumpur launch settles in MYR. Sample dishes keep the recorded prices until the catalog is rewritten. New payment examples in [payments.md](payments.md) use MYR.

## The two loops

Both loops use one account, one cart, and one points wallet.

**Order.** Splash, sign in or sign up, browse, add dishes, check out, pay, track the courier, and reopen past orders from Saved, Offers, or Profile.

**Contribute.** Suggest a food spot, drop a pin, add photos, and wait for review. After the place is orderable, the suggester earns points when a different person completes an order there. "Patronize" means that completed order. It does not mean an in-person check-in.

**Admin.** A separate desktop portal for staff. It is not a tab in the customer app. Staff review suggested places, watch today's orders and takings, refund an order before pickup, and see payment statuses from the gateway adapter. Only a Clerk user with the admin role can open it.

A place moves **Suggested → In review → Live → Orderable**. Live means people can find it. Orderable means it has a menu and can take a delivery order. Points start only at Orderable. A suggestion needs a name, a category, a map pin, and at least one photo.

## Points in one paragraph

Each qualifying order creates points and splits them three ways. **Cash** is checkout credit, capped so an order is not paid entirely in points by default. **Rank** is the monthly leaderboard and is not spendable. **Prize** is eligibility for that month's prizes. Rank and prize reset each month. Cash does not. Rules, numbers, and abuse cases are in [points.md](points.md).

## Payments in one paragraph

Checkout can combine a gateway charge, Foodie cash, and a promo. Methods for this market are cards, Apple Pay, FPX, Touch 'n Go, and GrabPay. No gateway vendor is chosen yet. The app talks to a single adapter (create intent, confirm, fail, refund, webhook) so a vendor can be connected later. A failed payment does not create an order and does not move points. Detail is in [payments.md](payments.md).

## Screens still to invent

The recording does not show sign up, forgot password, search, restaurant, dish detail, cart, checkout, payment, tracking, history, saved, offers, profile, place suggestion, or rewards. Those screens follow the same green, white, rounded visual system in [design-system.md](design-system.md). The full list is in [screens.md](screens.md). Step-by-step behavior is in [flows.md](flows.md).

## Out of this documentation pass

- No app code.
- No live gateway, merchant account, or payout run.
- No in-person check-in.
- No courier or restaurant operations console. Place payouts are named in the payment doc as a later connection on the same adapter.
