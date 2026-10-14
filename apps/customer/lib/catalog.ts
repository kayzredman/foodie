export type Dish = {
  id: string;
  name: string;
  place: string;
  minutes: number;
  price: number;
  category: "Chicken" | "Burger" | "Jollof" | "Fries" | "Pizza";
  image: number;
};

export const dishes: Dish[] = [
  {
    id: "chicken",
    name: "Herb roast",
    place: "Auntie Muni's",
    minutes: 35,
    price: 8500,
    category: "Chicken",
    image: require("../assets/food/chicken.jpg"),
  },
  {
    id: "jollof",
    name: "Jollof bowl",
    place: "Auntie Muni's",
    minutes: 20,
    price: 4800,
    category: "Jollof",
    image: require("../assets/food/jollof.jpg"),
  },
  {
    id: "burger",
    name: "Cheese burger",
    place: "Auntie Muni's",
    minutes: 15,
    price: 6500,
    category: "Burger",
    image: require("../assets/food/burger.jpg"),
  },
  {
    id: "fries",
    name: "Loaded fries",
    place: "Auntie Muni's",
    minutes: 12,
    price: 2800,
    category: "Fries",
    image: require("../assets/food/fries.jpg"),
  },
];

export const categories = ["Chicken", "Burger", "Jollof", "Fries", "Pizza"] as const;

const images: Record<(typeof categories)[number], number> = {
  Chicken: require("../assets/food/chicken.jpg"),
  Burger: require("../assets/food/burger.jpg"),
  Jollof: require("../assets/food/jollof.jpg"),
  Fries: require("../assets/food/fries.jpg"),
  Pizza: require("../assets/food/pizza.jpg"),
};

export function categoryImage(name: (typeof categories)[number]) {
  return images[name];
}

export function dishById(id: string) {
  const dish = dishes.find((item) => item.id === id);
  if (!dish) throw new Error(`Unknown dish ${id}`);
  return dish;
}

export const DELIVERY_PESEWAS = 850;

export type Tender = "mtn" | "vod" | "atl" | "card";

export const tenders: { id: Tender; label: string }[] = [
  { id: "mtn", label: "MTN MoMo" },
  { id: "vod", label: "Telecel Cash" },
  { id: "atl", label: "AirtelTigo Money" },
  { id: "card", label: "Card" },
];
