import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export function HomeScreen() {
  const [view, setView] = React.useState("home");
  const [website, setWebsite] = React.useState("https://");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { user, setUser } = useContext(AppContext);
  const navigation = useNavigation();

  React.useEffect(() => {
    if (user) {
      navigation.navigate("Conversations");
    }
  }, [user]);

  const handleWebsiteChange = (text: string) => {
    if (!text.startsWith("https://")) {
      setWebsite("https://");
    } else {
      setWebsite(text);
    }
  };

  const handleSubmit = async () => {
    setUser({ email, website });
    return;
    try {
      const response = await fetch(`${website}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        Alert.alert("Login successful");
        setUser({ email, website });
        await AsyncStorage.setItem("user", JSON.stringify({ email, website }));
      } else {
        Alert.alert("Login failed");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("An error occurred");
    }
  };

  return (
    <>
      {view === "home" && (
        <View style={styles.container}>
          {/* <Image source={require('./path/to/logo.png')} style={styles.logo} /> */}
          <Text style={styles.title}>Welcome to Chat App</Text>
          <TouchableOpacity
            onPress={() => setView("login")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
      {view === "login" && (
        <>
          <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Website</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter website"
                value={website}
                onChangeText={handleWebsiteChange}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setView("home")}
              style={styles.backLink}
            >
              <Text>back</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 300,
  },
  backLink: {
    color: "#00000",
    marginTop: 20,
  },
});
