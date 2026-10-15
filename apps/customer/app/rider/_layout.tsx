import { createContext, use, useMemo, useState, type ReactNode } from "react";
import { SymbolView } from "expo-symbols";
import { Tabs } from "expo-router";

import { font, theme } from "@/constants/theme";

type RiderState = {
  accepted: boolean;
  delivered: boolean;
  accept: () => void;
  deliver: () => void;
  reject: () => void;
};

const RiderContext = createContext<RiderState | null>(null);

export function useRider() {
  const value = use(RiderContext);
  if (!value) throw new Error("useRider must be used inside the rider tabs");
  return value;
}

export default function RiderLayout() {
  const [accepted, setAccepted] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const value = useMemo<RiderState>(
    () => ({
      accepted,
      delivered,
      accept: () => setAccepted(true),
      deliver: () => setDelivered(true),
      reject: () => setAccepted(false),
    }),
    [accepted, delivered],
  );

  return (
    <RiderContext value={value}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.green900,
          tabBarInactiveTintColor: theme.ink500,
          tabBarStyle: {
            backgroundColor: theme.white,
            borderTopColor: theme.ink300,
            height: 64,
            paddingTop: 6,
          },
          tabBarLabelStyle: { fontFamily: font.semibold, fontSize: 12 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Jobs",
            tabBarIcon: ({ color }) => (
              <SymbolView name={{ ios: "list.bullet", android: "list", web: "list" }} tintColor={color} size={22} />
            ),
          }}
        />
        <Tabs.Screen
          name="trip"
          options={{
            title: "Trip",
            tabBarIcon: ({ color }) => (
              <SymbolView name={{ ios: "location.fill", android: "navigation", web: "navigation" }} tintColor={color} size={22} />
            ),
          }}
        />
        <Tabs.Screen
          name="pay"
          options={{
            title: "Pay",
            tabBarIcon: ({ color }) => (
              <SymbolView name={{ ios: "banknote.fill", android: "payments", web: "payments" }} tintColor={color} size={22} />
            ),
          }}
        />
        <Tabs.Screen name="offer" options={{ href: null }} />
      </Tabs>
    </RiderContext>
  );
}
