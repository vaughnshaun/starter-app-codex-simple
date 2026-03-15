import { Pressable, StyleSheet, Text, View } from "react-native";

interface VerificationStatusProps {
  email?: string | null;
  message?: string | null;
  isLoading?: boolean;
  onResend: () => Promise<void> | void;
}

export function VerificationStatus({
  email,
  message,
  isLoading,
  onResend
}: VerificationStatusProps) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Verify your email
      </Text>
      <Text style={styles.body}>
        {email
          ? `We are waiting for ${email} to be verified before protected access is allowed.`
          : "We are waiting for your email verification before protected access is allowed."}
      </Text>
      {message ? <Text>{message}</Text> : null}
      <Pressable accessibilityRole="button" onPress={onResend} style={styles.button}>
        <Text style={styles.buttonText}>
          {isLoading ? "Sending..." : "Resend verification email"}
        </Text>
      </Pressable>
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
  body: {
    color: "#4b5563",
    fontSize: 16
  },
  button: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 12,
    paddingVertical: 14
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600"
  }
});

