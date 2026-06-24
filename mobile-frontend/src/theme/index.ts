import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from "react-native-paper";
import {
  DarkTheme as NavDark,
  DefaultTheme as NavLight,
  type Theme as NavTheme,
} from "@react-navigation/native";

// FinFlow brand palette: deep indigo primary, emerald for positive money,
// amber/rose for warning and negative. Shared with the web client.
export const brand = {
  indigo: "#4F46E5",
  indigoSoft: "#E0E7FF",
  emerald: "#10B981",
  amber: "#F59E0B",
  rose: "#E11D48",
  ink: "#0F172A",
};

export interface AppColors {
  success: string;
  successContainer: string;
  warning: string;
  info: string;
  gradientStart: string;
  gradientEnd: string;
}

export const lightTheme: MD3Theme & { colors: MD3Theme["colors"] & AppColors } =
  {
    ...MD3LightTheme,
    roundness: 3,
    colors: {
      ...MD3LightTheme.colors,
      primary: brand.indigo,
      onPrimary: "#FFFFFF",
      primaryContainer: brand.indigoSoft,
      onPrimaryContainer: "#1E1B4B",
      secondary: brand.emerald,
      onSecondary: "#FFFFFF",
      secondaryContainer: "#D1FAE5",
      onSecondaryContainer: "#064E3B",
      background: "#F6F7FB",
      onBackground: brand.ink,
      surface: "#FFFFFF",
      onSurface: brand.ink,
      surfaceVariant: "#EEF0F6",
      onSurfaceVariant: "#5B6478",
      outline: "#E2E6EF",
      outlineVariant: "#EDF0F6",
      error: brand.rose,
      elevation: {
        ...MD3LightTheme.colors.elevation,
        level1: "#FFFFFF",
        level2: "#FBFBFE",
      },
      success: brand.emerald,
      successContainer: "#D1FAE5",
      warning: brand.amber,
      info: "#0EA5E9",
      gradientStart: "#4F46E5",
      gradientEnd: "#0EA5E9",
    },
  };

export const darkTheme: MD3Theme & { colors: MD3Theme["colors"] & AppColors } =
  {
    ...MD3DarkTheme,
    roundness: 3,
    colors: {
      ...MD3DarkTheme.colors,
      primary: "#818CF8",
      onPrimary: "#0B1020",
      primaryContainer: "#312E81",
      onPrimaryContainer: "#E0E7FF",
      secondary: "#34D399",
      onSecondary: "#06281E",
      secondaryContainer: "#065F46",
      onSecondaryContainer: "#D1FAE5",
      background: "#0B1020",
      onBackground: "#E6E8F2",
      surface: "#121829",
      onSurface: "#E6E8F2",
      surfaceVariant: "#1A2236",
      onSurfaceVariant: "#9AA4BD",
      outline: "#222C44",
      outlineVariant: "#1A2236",
      error: "#FB7185",
      elevation: {
        ...MD3DarkTheme.colors.elevation,
        level1: "#121829",
        level2: "#161E31",
      },
      success: "#34D399",
      successContainer: "#065F46",
      warning: "#FBBF24",
      info: "#38BDF8",
      gradientStart: "#6366F1",
      gradientEnd: "#0EA5E9",
    },
  };

export const navLightTheme: NavTheme = {
  ...NavLight,
  colors: {
    ...NavLight.colors,
    primary: brand.indigo,
    background: lightTheme.colors.background,
    card: lightTheme.colors.surface,
    text: lightTheme.colors.onSurface,
    border: lightTheme.colors.outline,
  },
};

export const navDarkTheme: NavTheme = {
  ...NavDark,
  colors: {
    ...NavDark.colors,
    primary: darkTheme.colors.primary,
    background: darkTheme.colors.background,
    card: darkTheme.colors.surface,
    text: darkTheme.colors.onSurface,
    border: darkTheme.colors.outline,
  },
};

export type AppTheme = typeof lightTheme;
