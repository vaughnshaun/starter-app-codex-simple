import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { AuthFormShell } from "@/app/modules/auth/components/auth-form-shell";
import { SignUpInput } from "@/app/modules/auth/types";

interface SignUpFormProps {
  isLoading?: boolean;
  errorMessage?: string | null;
  onSubmit: (input: SignUpInput) => Promise<void> | void;
}

export function SignUpForm({ isLoading, errorMessage, onSubmit }: SignUpFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};

    if (!/^[a-zA-Z0-9._]{3,24}$/.test(username.trim())) {
      nextErrors.username = "Use 3-24 letters, numbers, periods, or underscores.";
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      username,
      email,
      password
    });
  };

  return (
    <AuthFormShell
      title="Create account"
      subtitle="Register with a username, email, and password."
      errorMessage={errorMessage}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      submitLabel="Create account"
    >
      <View style={styles.field}>
        <Text>Username</Text>
        <TextInput accessibilityLabel="Username" onChangeText={setUsername} style={styles.input} value={username} />
        {errors.username ? <Text style={styles.error}>{errors.username}</Text> : null}
      </View>
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
        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
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

