import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  useTheme,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Logo } from "../../components/common/Logo";
import type { AppDispatch, RootState } from "../../store";
import { login, clearError } from "../../store/slices/authSlice";
import type { AppTheme } from "../../theme";

const LoginScreen: React.FC<any> = ({ navigation }: any) => {
  const theme = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((s: RootState) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const valid = emailValid && password.length >= 6;

  const onSubmit = async () => {
    setTouched(true);
    if (!valid) return;
    dispatch(clearError());
    dispatch(login({ email: email.trim(), password }) as never);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + 16,
        },
      ]}
    >
      <View style={styles.inner}>
        <Logo size={30} />
        <View style={styles.head}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            Welcome back
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Sign in to your FinFlow account to continue.
          </Text>
        </View>

        {error ? (
          <HelperText type="error" visible style={styles.banner}>
            {String(error)}
          </HelperText>
        ) : null}

        <View style={styles.form}>
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            testID="email-input"
            left={<TextInput.Icon icon="email-outline" />}
            error={touched && !emailValid}
          />
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!show}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock-outline" />}
            testID="password-input"
            right={
              <TextInput.Icon
                icon={show ? "eye-off" : "eye"}
                onPress={() => setShow((s) => !s)}
              />
            }
            error={touched && password.length > 0 && password.length < 6}
          />
          <Button
            mode="text"
            compact
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgot}
            labelStyle={{ fontSize: 13 }}
          >
            Forgot password?
          </Button>
          <Button
            mode="contained"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isLoading}
            contentStyle={styles.btn}
          >
            Sign in
          </Button>
        </View>

        <View style={styles.footer}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            New to FinFlow?{" "}
          </Text>
          <Button
            mode="text"
            compact
            onPress={() => navigation.navigate("Register")}
            labelStyle={{ fontSize: 14 }}
          >
            Create an account
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24 },
  inner: { flex: 1, justifyContent: "center", gap: 20 },
  head: { gap: 6 },
  title: { fontWeight: "800" },
  banner: { backgroundColor: "transparent" },
  form: { gap: 12 },
  forgot: { alignSelf: "flex-end", marginTop: -4 },
  btn: { paddingVertical: 6 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginScreen;
