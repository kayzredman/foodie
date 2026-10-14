import { SymbolView } from "expo-symbols";
import { Tabs } from "expo-router";

import { font, theme } from "@/constants/theme";
import { useStore } from "@/lib/store";

export default function TabLayout() {
  const { lines } = useStore();
  const count = lines.reduce((sum, line) => sum + line.qty, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.green600,
        tabBarInactiveTintColor: theme.ink500,
        tabBarStyle: {
          backgroundColor: theme.white,
          borderTopColor: theme.ink300,
          height: 64,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontFamily: font.semibold, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: "house.fill", android: "home", web: "home" }} tintColor={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="places"
        options={{
          title: "Places",
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: "mappin", android: "place", web: "place" }} tintColor={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarBadge: count > 0 ? count : undefined,
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: "cart.fill", android: "shopping_cart", web: "shopping_cart" }} tintColor={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="board"
        options={{
          title: "Board",
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: "trophy.fill", android: "emoji_events", web: "emoji_events" }} tintColor={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: "You",
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: "person.fill", android: "person", web: "person" }} tintColor={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
