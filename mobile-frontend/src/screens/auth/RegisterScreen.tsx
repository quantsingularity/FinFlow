import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
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
import { register, clearError } from "../../store/slices/authSlice";
import type { AppTheme } from "../../theme";

const RegisterScreen: React.FC<any> = ({ navigation }: any) => {
  const theme = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((s: RootState) => s.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const pwValid = password.length >= 8;
  const match = password === confirm;
  const valid = emailValid && pwValid && match;

  const onSubmit = async () => {
    setTouched(true);
    if (!valid) return;
    dispatch(clearError());
    const [firstName, ...rest] = name.trim().split(/\s+/);
    dispatch(
      register({
        email: email.trim(),
        password,
        firstName: firstName || name.trim(),
        lastName: rest.join(" "),
      }) as never,
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.inner,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Logo size={30} />
        <View style={styles.head}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            Create your account
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Start managing your finances in minutes.
          </Text>
        </View>

        {error ? (
          <HelperText type="error" visible>
            {String(error)}
          </HelperText>
        ) : null}

        <View style={styles.form}>
          <TextInput
            mode="outlined"
            label="Full name"
            value={name}
            onChangeText={setName}
            left={<TextInput.Icon icon="account-outline" />}
          />
          <TextInput
            mode="outlined"
            label="Work email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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
            right={
              <TextInput.Icon
                icon={show ? "eye-off" : "eye"}
                onPress={() => setShow((s) => !s)}
              />
            }
            error={touched && password.length > 0 && !pwValid}
          />
          {touched && password.length > 0 && !pwValid ? (
            <HelperText type="error" visible>
              Use at least 8 characters.
            </HelperText>
          ) : null}
          <TextInput
            mode="outlined"
            label="Confirm password"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!show}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock-check-outline" />}
            error={touched && !match}
          />
          {touched && confirm.length > 0 && !match ? (
            <HelperText type="error" visible>
              Passwords do not match.
            </HelperText>
          ) : null}
          <Button
            mode="contained"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isLoading}
            contentStyle={styles.btn}
            style={{ marginTop: 4 }}
          >
            Create account
          </Button>
        </View>

        <View style={styles.footer}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Already have an account?{" "}
          </Text>
          <Button
            mode="text"
            compact
            onPress={() => navigation.navigate("Login")}
            labelStyle={{ fontSize: 14 }}
          >
            Sign in
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inner: { paddingHorizontal: 24, gap: 18 },
  head: { gap: 6 },
  title: { fontWeight: "800" },
  form: { gap: 12 },
  btn: { paddingVertical: 6 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
});

export default RegisterScreen;
