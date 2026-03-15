import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ROUTES } from "@/app/modules/auth/navigation";
import { useSignOutMutation } from "@/app/modules/auth/hooks";
import { useSession } from "@/app/providers/session-provider";

export default function HomeScreen() {
  const router = useRouter();
  const signOutMutation = useSignOutMutation();
  const session = useSession();

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Home
      </Text>
      <Text testID="welcome-copy">
        {session.user ? `Welcome, ${session.user.username}.` : "Welcome."}
      </Text>
      <Pressable onPress={() => router.push(ROUTES.profile)} style={styles.button}>
        <Text style={styles.buttonText}>Go to profile</Text>
      </Pressable>
      <Pressable
        onPress={async () => {
          await signOutMutation.mutateAsync();
          router.replace(ROUTES.signIn);
        }}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Sign out</Text>
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
  button: {
    backgroundColor: "#0f766e",
    borderRadius: 12,
    padding: 14
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600"
  },
  secondaryButton: {
    borderColor: "#0f766e",
    borderRadius: 12,
    borderWidth: 1,
    padding: 14
  },
  secondaryButtonText: {
    color: "#0f766e",
    fontWeight: "600"
  }
});

