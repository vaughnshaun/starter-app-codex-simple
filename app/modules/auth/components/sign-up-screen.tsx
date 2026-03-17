import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useHelloWorld,
  useResendVerification,
  useSignUp
} from "@/app/modules/auth/hooks";
import { useStoredProfile } from "@/app/modules/profile/hooks";

export function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const storedProfileQuery = useStoredProfile();
  const signUpMutation = useSignUp();
  const resendVerificationMutation = useResendVerification();
  const helloWorldMutation = useHelloWorld();

  const handleSignUp = () => {
    signUpMutation.reset();
    void signUpMutation.mutateAsync({
      username,
      password
    });
  };

  const handleResendVerification = () => {
    resendVerificationMutation.reset();
    void resendVerificationMutation.mutateAsync({
      username
    });
  };

  const handleHelloWorld = () => {
    helloWorldMutation.reset();
    helloWorldMutation.mutate(undefined, {
      onError: (error) => {
        Alert.alert("Hello World Error", error.message);
      },
      onSuccess: ({ message }) => {
        Alert.alert("Hello World", message);
      }
    });
  };

  const hasStoredProfile = Boolean(storedProfileQuery.data);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.panel}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>
            Create an account with username and password only.
          </Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            accessibilityLabel="Username"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setUsername}
            placeholder="name@example.com"
            style={styles.input}
            value={username}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            accessibilityLabel="Password"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
            style={styles.input}
            value={password}
          />

          <Pressable
            accessibilityRole="button"
            disabled={signUpMutation.isPending}
            onPress={handleSignUp}
            style={({ pressed }) => [
              styles.button,
              pressed ? styles.buttonPressed : null,
              signUpMutation.isPending ? styles.buttonDisabled : null
            ]}
          >
            {signUpMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleResendVerification}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed ? styles.secondaryButtonPressed : null
            ]}
          >
            {resendVerificationMutation.isPending ? (
              <ActivityIndicator color="#a24a2d" />
            ) : (
              <Text style={styles.secondaryButtonText}>Resend Verification</Text>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={helloWorldMutation.isPending}
            onPress={handleHelloWorld}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed ? styles.secondaryButtonPressed : null,
              helloWorldMutation.isPending ? styles.buttonDisabled : null
            ]}
          >
            {helloWorldMutation.isPending ? (
              <ActivityIndicator color="#a24a2d" />
            ) : (
              <Text style={styles.secondaryButtonText}>Test Hello World</Text>
            )}
          </Pressable>

          {signUpMutation.error ? (
            <Text style={styles.errorText}>{signUpMutation.error.message}</Text>
          ) : null}
          {resendVerificationMutation.error ? (
            <Text style={styles.errorText}>{resendVerificationMutation.error.message}</Text>
          ) : null}

          <View style={styles.profileSection}>
            <Text style={styles.profileTitle}>Saved Profile</Text>
            {storedProfileQuery.isLoading ? (
              <Text style={styles.profileEmpty}>Loading profile...</Text>
            ) : null}
            {!storedProfileQuery.isLoading && !hasStoredProfile ? (
              <Text style={styles.profileEmpty}>No profile saved yet.</Text>
            ) : null}
            {storedProfileQuery.data ? (
              <View style={styles.profileCard}>
                <Text style={styles.profileRow}>Username: {storedProfileQuery.data.username}</Text>
                <Text style={styles.profileRow}>Email: {storedProfileQuery.data.email}</Text>
                <Text style={styles.profileRow}>User ID: {storedProfileQuery.data.userId}</Text>
                <Text style={styles.profileRow}>
                  Created At: {storedProfileQuery.data.createdAt ?? "Unavailable"}
                </Text>
                <Text style={styles.profileRow}>
                  Email Verified: {storedProfileQuery.data.emailConfirmedAt ? "Yes" : "Pending"}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2efe7"
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24
  },
  panel: {
    backgroundColor: "#fffdf8",
    borderColor: "#d9cfbb",
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 24,
    shadowColor: "#362f28",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.08,
    shadowRadius: 20
  },
  title: {
    color: "#2c241f",
    fontSize: 32,
    fontWeight: "700"
  },
  subtitle: {
    color: "#5a5148",
    fontSize: 15,
    marginBottom: 12
  },
  label: {
    color: "#3f352d",
    fontSize: 14,
    fontWeight: "600"
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#c9bca3",
    borderRadius: 14,
    borderWidth: 1,
    color: "#221c18",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  button: {
    alignItems: "center",
    backgroundColor: "#a24a2d",
    borderRadius: 14,
    marginTop: 12,
    paddingVertical: 16
  },
  buttonPressed: {
    opacity: 0.92
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#fff7ef",
    borderColor: "#d9b59d",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 16
  },
  secondaryButtonPressed: {
    opacity: 0.88
  },
  secondaryButtonText: {
    color: "#a24a2d",
    fontSize: 16,
    fontWeight: "700"
  },
  errorText: {
    color: "#a12727",
    fontSize: 14
  },
  profileSection: {
    borderTopColor: "#e4dac8",
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 20
  },
  profileTitle: {
    color: "#2c241f",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8
  },
  profileEmpty: {
    color: "#6f665c",
    fontSize: 14
  },
  profileCard: {
    backgroundColor: "#f8f2e6",
    borderRadius: 16,
    gap: 8,
    padding: 16
  },
  profileRow: {
    color: "#372f29",
    fontSize: 14
  }
});
