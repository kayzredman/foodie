import { DELIVERY_PESEWAS, dishById } from "./catalog";

export type Line = { id: string; qty: number };

export type Bill = {
  food: number;
  foodOff: number;
  delivery: number;
  deliveryOff: number;
  total: number;
};

export function quote(lines: Line[], foodie30: boolean, freeship: boolean): Bill {
  const food = lines.reduce((sum, line) => sum + dishById(line.id).price * line.qty, 0);
  const foodOff = foodie30 ? Math.round(food * 0.3) : 0;
  const hasFood = food > 0;
  const delivery = hasFood && !freeship ? DELIVERY_PESEWAS : 0;
  const deliveryOff = hasFood && freeship ? DELIVERY_PESEWAS : 0;
  return {
    food,
    foodOff,
    delivery,
    deliveryOff,
    total: food - foodOff + delivery,
  };
}
