import React, { useEffect, useRef } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { ShakeDetector } from "@/components/ShakeDetector";
import "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const webViewRef = useRef<WebView>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    ShakeDetector.addListener(() => {
      if (isLoaded.current) {
        webViewRef.current?.injectJavaScript("window.handleRollDice();");

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    });

    return () => {
      ShakeDetector.removeListener();
    };
  }, []);

  if (!loaded) {
    return null;
  }

  const threeJsUrl = "https://dndiceapp.netlify.app/";

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: threeJsUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={["*"]}
          onLoadEnd={() => {
            isLoaded.current = true;
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView error: ", nativeEvent);
          }}
        />
      </SafeAreaView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
