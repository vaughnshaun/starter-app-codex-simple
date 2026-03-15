import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ROUTES } from "@/app/modules/auth/navigation";
import { useSignOutMutation } from "@/app/modules/auth/hooks";
import { useProfile } from "@/app/modules/profile/hooks";

export default function ProfileScreen() {
  const router = useRouter();
  const profileQuery = useProfile();
  const signOutMutation = useSignOutMutation();

  if (profileQuery.isLoading) {
    return <Text>Loading profile...</Text>;
  }

  if (!profileQuery.data) {
    return <Text>Profile unavailable.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Profile
      </Text>
      <Text>Username: {profileQuery.data.username}</Text>
      <Text>Email: {profileQuery.data.email}</Text>
      <Text>
        Verification: {profileQuery.data.emailVerified ? "Verified" : "Pending verification"}
      </Text>
      <Pressable onPress={() => router.push(ROUTES.home)} style={styles.button}>
        <Text style={styles.buttonText}>Back home</Text>
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

