import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { AuthFormShell } from "@/app/modules/auth/components/auth-form-shell";

interface ResetPasswordFormProps {
  isLoading?: boolean;
  errorMessage?: string | null;
  hasValidToken: boolean;
  onSubmit: (input: { password: string }) => Promise<void> | void;
}

export function ResetPasswordForm({
  isLoading,
  errorMessage,
  hasValidToken,
  onSubmit
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!hasValidToken) {
      setFieldError("This reset link is invalid or expired.");
      return;
    }

    if (password.length < 8) {
      setFieldError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setFieldError("Passwords must match.");
      return;
    }

    setFieldError(null);
    await onSubmit({ password });
  };

  return (
    <AuthFormShell
      title="Reset password"
      subtitle="Set a new password to regain access."
      errorMessage={errorMessage}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      submitLabel="Update password"
    >
      <View style={styles.field}>
        <Text>New password</Text>
        <TextInput
          accessibilityLabel="New password"
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          value={password}
        />
      </View>
      <View style={styles.field}>
        <Text>Confirm password</Text>
        <TextInput
          accessibilityLabel="Confirm password"
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
        />
      </View>
      {fieldError ? <Text style={styles.error}>{fieldError}</Text> : null}
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

