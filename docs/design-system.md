# Foodie design system

This is the visual system to carry from the recording into every new screen. Hex values are matched by eye from the clip. Lock the real values as Figma variables before building components. Do not invent a second palette.

Frame size for design is the iPhone 17 Pro Max logical size used in the simulator. Build screens at that size, with 16px side margins unless a hero is full-bleed.

## Look

- A green gradient carries the brand. It fills the splash-adjacent login hero and the primary button.
- Content sits on white or a warm off-white page, in soft cards with large radii.
- The login form is a white sheet that overlaps the hero. New flows can use the same sheet, or a flat white page with the same type and controls.
- One green is the action color: primary button, links, checkbox, add button, selected tab.
- Red is only for field errors. The recording uses a red stroke and the line "That email doesn't look right".
- Illustration style on the hero is flat: a courier in a green helmet on a green scooter with a delivery box. New marketing art should match that, not photoreal 3D and not emoji.

## Color

| Token | Use | Working value |
| --- | --- | --- |
| `green.900` | Wordmark, hero shadow end, pressed button | `#146B34` |
| `green.600` | Links, icons, add button, selected tab | `#1F9D4A` |
| `green.400` | Gradient end, success chips | `#8ED86A` |
| `green.50` | Soft badges, illustration backdrop | `#E7F8E4` |
| `ink.900` | Titles, prices, field text | `#1A1A1A` |
| `ink.500` | Secondary labels, captions, placeholders | `#6B7280` |
| `ink.300` | Dividers, default field stroke | `#E4E7EC` |
| `paper` | Page background | `#F6F7F4` |
| `white` | Sheets, cards, fields | `#FFFFFF` |
| `danger.600` | Error text and error stroke | `#E11D2E` |
| `danger.50` | Error field fill | `#FEF2F2` |

Hero and primary button use a left-to-right or top-to-bottom gradient from `green.900` to `green.400`. The login button in the clip is slightly lighter on the right.

Delivery-fee badges: free delivery uses `green.50` and `green.600`. A paid fee uses a neutral chip (`ink.500` on `paper`).

## Type

The wordmark is a heavy geometric sans with a tight period: **Foodie.** UI text is a plain grotesque, not a serif and not a script.

| Style | Size / line-height | Weight | Use |
| --- | --- | --- | --- |
| Display | 32 / 38 | 700 | Wordmark |
| Title | 24 / 30 | 700 | Welcome Back, screen titles |
| Headline | 18 / 24 | 700 | Section titles: Categories, Deals for you |
| Body | 16 / 22 | 500 | Field text, buttons, dish names |
| Label | 14 / 20 | 600 | Links, card titles, tab labels |
| Caption | 12 / 16 | 500 | Calories, time, "Yesterday", helper text |

Body text stays at least 16px. Captions can be 12px. Do not go below 12. Prices use Body or Label in `ink.900`, semibold.

Working font pairing for Figma: Plus Jakarta Sans for the wordmark and titles, Inter for body and captions. On device, the UI face can fall back to SF Pro. The wordmark does not fall back to a system font if the brand face is available.

## Space, radius, elevation

Spacing scale: 4, 8, 12, 16, 20, 24, 32.

- Screen side inset: 16.
- Space between sections on Home: 24.
- Space between a label and its control: 8.
- Card padding: 12.

| Radius | Use |
| --- | --- |
| 999 (pill) | Text fields, primary button, social buttons, chips, add button |
| 20 | Promo banner, deal cards, login sheet top corners |
| 16 | Food cards, restaurant rows, reorder cards |
| 12 | Photo tiles, map preview |

Cards use a soft shadow: y 8, blur 24, 8% black. The login sheet can use a larger shadow where it overlaps the hero. Do not stack heavy shadows on every row.

Tap targets are at least 44 × 44. The green add button is a circle inside that target, not a 16px icon with no padding.

## Components

**Wordmark.** "Foodie." in Display, `green.900` on light surfaces and white on the green hero.

**Hero.** Full-width green gradient, wordmark, one short line, and the courier illustration on the right. The login hero copy is "Hot meals, right at your door."

**Text field.** White pill, 1px `ink.300` stroke, left icon, 16px horizontal padding, about 52px tall. Placeholder in `ink.500`. Focus uses a `green.600` stroke. Error uses a `danger.600` stroke, `danger.50` fill, and a 12px error line under the field. Password adds a visibility toggle on the right.

**Checkbox.** 20px rounded square. Checked state is `green.600` with a white tick, as in "Keep me signed in".

**Text link.** Label size, `green.600`, no underline. Used for Forgot Password?, Sign Up, and See all.

**Primary button.** Full-width pill, gradient fill, white Body label. Loading replaces the label with a small white spinner and keeps the button width, as in the clip. Disabled is 40% opacity and does not submit.

**Social button.** White pill, 1px `ink.300` stroke, leading logo, label "Google" or "Apple". The pair sits on one row with 12px between them.

**Divider.** A hairline with the centered caption "Or continue with" in Caption, `ink.500`.

**Location bar.** Avatar, "Deliver to" caption, place name in Label, address in Caption truncated to one line, chevron. Bell button on the trailing edge.

**Banner.** Full-bleed rounded image or illustration, about 20px radius, with a short headline and a text button such as ORDER NOW.

**Category.** Circular image well on `green.50` or a photo, label in Caption under it. Horizontal scroll. See all sits on the section header, not inside the scroller.

**Reorder card.** Horizontal card, thumbnail, dish name, relative time, price. The clip shows Cheese Burger and Tonkotsu Ramen.

**Deal card.** Dark or photo card, offer headline ("YOUR WHOLE ORDER 30% OFF" or "DELIVERY FEE FREE"), code chip (`FOODIE30`, `FREESHIP`), and Apply.

**Restaurant row.** Thumbnail, name, meta line, and a fee chip (Free delivery or a price).

**Food card.** Two-column grid. Image on top, name, price, a calories row, a time row, and a green circular plus. Plus adds one item and does not open the dish. The card itself opens the dish.

**Bottom bar.** Five items: Home, Saved, Cart, Offers, Profile. Icon above a Caption label. Selected item is `green.600`. Unselected is `ink.500`. Cart shows a count badge when the count is above zero. The bar stays visible on the five roots and hides on checkout, payment, dish detail, and place suggestion.

**Status chip.** Caption on a tinted pill. Used for place states (In review, Live, Orderable, Rejected), order states, and payment states.

**Map pin.** A `green.600` pin. The selected spot is a larger pin with a white center. The confirm control is the primary button "Drop pin".

**Payment row.** Method logo, name, last-four or wallet name, and a radio. The selected row uses a `green.600` stroke.

## Motion

- Screen changes are short, about 200–300ms. The clip cuts through a blank white frame between flows; designed transitions should be a push or a fade, not a flash of empty white.
- The login spinner stays on the button. Do not swap the whole screen for a blocking loader during sign-in.
- Honor reduced motion: fade instead of sliding the hero illustration.

## Tone

Short, warm, and concrete. Buttons are verbs: Log In, Sign Up, Order now, Place order, Drop pin, Apply. Errors say what is wrong in plain language, next to the field. Empty states say what to do next.
