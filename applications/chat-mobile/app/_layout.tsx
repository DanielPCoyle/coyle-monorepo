import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import "react-native-reanimated";

import { AppContext } from "@/context/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import { ChatScreen } from "./ChatScreen";
import { ConversationsScreen } from "./ConversationsScreen";
import { DesignScreen } from "./DesignScreen";
import { HomeScreen } from "./HomeScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState(null);
  const socketRef = useRef(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          socketRef.current = io(parsedUser.website, {
            path: "/api/socket",
          });
        }
      } catch (error) {
        console.error("Failed to load user from AsyncStorage", error);
      }
    };

    fetchUser();
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AppContext.Provider value={{ user, setUser }}>
        <Drawer.Navigator
          initialRouteName={user ? "ConversationsStack" : "Home"}
        >
          {!user && (
            <Drawer.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
          )}
          <Drawer.Screen
            name="ConversationsStack"
            component={ConversationsStack}
            options={{ title: "Chat" }}
          />
          <Drawer.Screen
            name="Sign Out"
            component={() => {
              return null;
            }}
            options={{ title: "Sign Out" }}
          />
        </Drawer.Navigator>
        <StatusBar style="auto" />
      </AppContext.Provider>
    </ThemeProvider>
  );
}

function ConversationsStack() {
  return (
    <Stack.Navigator initialRouteName="Conversations">
      <Stack.Screen
        name="Conversations"
        component={ConversationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Design"
        component={DesignScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
