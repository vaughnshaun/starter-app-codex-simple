import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { AuthFormShell } from "@/app/modules/auth/components/auth-form-shell";

interface ForgotPasswordFormProps {
  isLoading?: boolean;
  errorMessage?: string | null;
  onSubmit: (input: { email: string }) => Promise<void> | void;
}

export function ForgotPasswordForm({
  isLoading,
  errorMessage,
  onSubmit
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setFieldError("Enter a valid email address.");
      return;
    }

    setFieldError(null);
    await onSubmit({ email });
    setSuccessMessage(
      "If an eligible account exists, password reset instructions have been sent."
    );
  };

  return (
    <AuthFormShell
      title="Forgot password"
      subtitle="Request a password reset."
      errorMessage={errorMessage}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      submitLabel="Send reset link"
    >
      <View style={styles.field}>
        <Text>Email</Text>
        <TextInput
          accessibilityLabel="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          style={styles.input}
          value={email}
        />
        {fieldError ? <Text style={styles.error}>{fieldError}</Text> : null}
      </View>
      {successMessage ? <Text>{successMessage}</Text> : null}
    </AuthFormShell>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6
  },
  input: {
    borderColor: "#cbd5e1",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  error: {
    color: "#b91c1c"
  }
});

