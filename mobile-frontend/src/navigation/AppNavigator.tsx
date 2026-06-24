import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { Icon, useTheme } from "react-native-paper";

import WelcomeScreen from "../screens/onboarding/WelcomeScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

import AccountingScreen from "../screens/accounting/AccountingScreen";
import BalanceSheetScreen from "../screens/accounting/BalanceSheetScreen";
import CashFlowScreen from "../screens/accounting/CashFlowScreen";
import IncomeStatementScreen from "../screens/accounting/IncomeStatementScreen";
import AnalyticsScreen from "../screens/analytics/AnalyticsScreen";
import ApplyLoanScreen from "../screens/credit/ApplyLoanScreen";
import CreditScoreScreen from "../screens/credit/CreditScoreScreen";
import CreditScreen from "../screens/credit/CreditScreen";
import LoanDetailsScreen from "../screens/credit/LoanDetailsScreen";
import LoansScreen from "../screens/credit/LoansScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import CreatePaymentScreen from "../screens/payments/CreatePaymentScreen";
import PaymentDetailsScreen from "../screens/payments/PaymentDetailsScreen";
import PaymentsScreen from "../screens/payments/PaymentsScreen";
import TransactionsScreen from "../screens/transactions/TransactionsScreen";
import InvoicesScreen from "../screens/invoices/InvoicesScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

import type { RootState } from "../store";
import type { AppTheme } from "../theme";
import { navLightTheme, navDarkTheme } from "../theme";

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};
export type MainTabParamList = {
  Dashboard: undefined;
  Payments: undefined;
  Accounting: undefined;
  Analytics: undefined;
  Credit: undefined;
};
export type PaymentsStackParamList = {
  PaymentsList: undefined;
  PaymentDetails: { id: string };
  CreatePayment: undefined;
};
export type AccountingStackParamList = {
  AccountingHome: undefined;
  BalanceSheet: { date?: string };
  IncomeStatement: { startDate?: string; endDate?: string };
  CashFlow: { startDate?: string; endDate?: string };
};
export type CreditStackParamList = {
  CreditHome: undefined;
  CreditScore: undefined;
  Loans: undefined;
  LoanDetails: { id: string };
  ApplyLoan: undefined;
};
export type DrawerParamList = {
  MainTabs: undefined;
  Invoices: undefined;
  Transactions: undefined;
  Profile: undefined;
  Settings: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const PaymentsStack = createNativeStackNavigator<PaymentsStackParamList>();
const AccountingStack = createNativeStackNavigator<AccountingStackParamList>();
const CreditStack = createNativeStackNavigator<CreditStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const PaymentsNavigator = () => (
  <PaymentsStack.Navigator>
    <PaymentsStack.Screen
      name="PaymentsList"
      component={PaymentsScreen}
      options={{ headerShown: false }}
    />
    <PaymentsStack.Screen
      name="PaymentDetails"
      component={PaymentDetailsScreen}
      options={{ title: "Payment" }}
    />
    <PaymentsStack.Screen
      name="CreatePayment"
      component={CreatePaymentScreen}
      options={{ title: "New payment" }}
    />
  </PaymentsStack.Navigator>
);

const AccountingNavigator = () => (
  <AccountingStack.Navigator>
    <AccountingStack.Screen
      name="AccountingHome"
      component={AccountingScreen}
      options={{ headerShown: false }}
    />
    <AccountingStack.Screen
      name="BalanceSheet"
      component={BalanceSheetScreen}
      options={{ title: "Balance sheet" }}
    />
    <AccountingStack.Screen
      name="IncomeStatement"
      component={IncomeStatementScreen}
      options={{ title: "Income statement" }}
    />
    <AccountingStack.Screen
      name="CashFlow"
      component={CashFlowScreen}
      options={{ title: "Cash flow" }}
    />
  </AccountingStack.Navigator>
);

const CreditNavigator = () => (
  <CreditStack.Navigator>
    <CreditStack.Screen
      name="CreditHome"
      component={CreditScreen}
      options={{ headerShown: false }}
    />
    <CreditStack.Screen
      name="CreditScore"
      component={CreditScoreScreen}
      options={{ title: "Credit score" }}
    />
    <CreditStack.Screen
      name="Loans"
      component={LoansScreen}
      options={{ title: "Loans" }}
    />
    <CreditStack.Screen
      name="LoanDetails"
      component={LoanDetailsScreen}
      options={{ title: "Loan" }}
    />
    <CreditStack.Screen
      name="ApplyLoan"
      component={ApplyLoanScreen}
      options={{ title: "Apply" }}
    />
  </CreditStack.Navigator>
);

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  Dashboard: "view-dashboard-outline",
  Payments: "credit-card-outline",
  Accounting: "book-open-outline",
  Analytics: "chart-line",
  Credit: "bank-outline",
};

const MainTabNavigator = () => {
  const theme = useTheme<AppTheme>();
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        tabBarIcon: ({ color, size }) => (
          <Icon source={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <MainTab.Screen name="Dashboard" component={DashboardScreen} />
      <MainTab.Screen name="Payments" component={PaymentsNavigator} />
      <MainTab.Screen name="Accounting" component={AccountingNavigator} />
      <MainTab.Screen name="Analytics" component={AnalyticsScreen} />
      <MainTab.Screen name="Credit" component={CreditNavigator} />
    </MainTab.Navigator>
  );
};

const DRAWER_ICONS: Record<string, string> = {
  MainTabs: "view-dashboard-outline",
  Invoices: "file-document-outline",
  Transactions: "swap-horizontal",
  Profile: "account-outline",
  Settings: "cog-outline",
};

const DrawerNavigator = () => {
  const theme = useTheme<AppTheme>();
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.onSurfaceVariant,
        drawerIcon: ({ color, size }) => (
          <Icon
            source={DRAWER_ICONS[route.name] ?? "circle-small"}
            size={size}
            color={color}
          />
        ),
        headerTintColor: theme.colors.onSurface,
        headerStyle: { backgroundColor: theme.colors.surface },
      })}
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false, title: "Home" }}
      />
      <Drawer.Screen name="Invoices" component={InvoicesScreen} />
      <Drawer.Screen name="Transactions" component={TransactionsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

export const AppNavigator = ({ isDark = false }: { isDark?: boolean }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  return (
    <NavigationContainer theme={isDark ? navDarkTheme : navLightTheme}>
      {token ? <DrawerNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
