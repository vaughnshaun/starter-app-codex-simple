import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { AuthFormShell } from "@/app/modules/auth/components/auth-form-shell";
import { SignInInput } from "@/app/modules/auth/types";

interface SignInFormProps {
  isLoading?: boolean;
  errorMessage?: string | null;
  initialValues?: Partial<SignInInput>;
  onSubmit: (input: SignInInput) => Promise<void> | void;
}

export function SignInForm({
  isLoading,
  errorMessage,
  initialValues,
  onSubmit
}: SignInFormProps) {
  const [identifier, setIdentifier] = useState(initialValues?.identifier || "");
  const [password, setPassword] = useState(initialValues?.password || "");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const handleSubmit = async () => {
    const nextErrors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      nextErrors.identifier = "Enter your username or email.";
    }
    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      identifier,
      password
    });
  };

  return (
    <AuthFormShell
      title="Sign in"
      subtitle="Use your username and password to continue."
      errorMessage={errorMessage}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      submitLabel="Sign in"
    >
      <View style={styles.field}>
        <Text>Username or email</Text>
        <TextInput
          accessibilityLabel="Username or email"
          autoCapitalize="none"
          onChangeText={setIdentifier}
          style={styles.input}
          value={identifier}
        />
        {errors.identifier ? <Text style={styles.error}>{errors.identifier}</Text> : null}
      </View>
      <View style={styles.field}>
        <Text>Password</Text>
        <TextInput
          accessibilityLabel="Password"
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          value={password}
        />
        {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
      </View>
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

