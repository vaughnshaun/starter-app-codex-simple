import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

interface AuthFormShellProps {
  title: string;
  subtitle?: string;
  errorMessage?: string | null;
  submitLabel: string;
  isLoading?: boolean;
  onSubmit: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthFormShell({
  title,
  subtitle,
  errorMessage,
  submitLabel,
  isLoading,
  onSubmit,
  children,
  footer
}: AuthFormShellProps) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.fields}>{children}</View>
      {errorMessage ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {errorMessage}
        </Text>
      ) : null}
      <Pressable accessibilityRole="button" onPress={onSubmit} style={styles.button}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{submitLabel}</Text>}
      </Pressable>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 24
  },
  title: {
    fontSize: 28,
    fontWeight: "700"
  },
  subtitle: {
    color: "#4b5563",
    fontSize: 16
  },
  fields: {
    gap: 12
  },
  error: {
    color: "#b91c1c"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 12,
    paddingVertical: 14
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  footer: {
    gap: 8
  }
});
