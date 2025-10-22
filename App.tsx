import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
};

export default function App() {
  const [screen, setScreen] = useState<"Home" | "AddItem">("Home");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: "1", name: "Grilled Chicken", description: "Juicy grilled chicken with herbs", price: "R120" },
    { id: "2", name: "Beef Lasagna", description: "Layers of pasta, beef, and cheese", price: "R150" },
    { id: "3", name: "Caesar Salad", description: "Crisp lettuce, croutons, parmesan cheese", price: "R80" },
  ]);
  const [dishName, setDishName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  // Handle adding a new dish
  const handleAddItem = () => {
    if (!dishName || !price || !description) {
      Alert.alert("Missing info", "Please enter dish name, description, and price.");
      return;
    }

    const newItem: MenuItem = {
      id: Math.random().toString(),
      name: dishName,
      description: description,
      price: `R${price}`,
    };

    setMenuItems([...menuItems, newItem]);
    setDishName("");
    setDescription("");
    setPrice("");
    Alert.alert("Success", "Menu item added successfully!");
  };

  // ----------- Home Screen -----------
  if (screen === "Home") {
    return (
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1551218808-94e220e084d2" }}
        style={styles.bg}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to Christoff’s Pallet</Text>
          <Text style={styles.subtitle}>Our Menu</Text>

          {menuItems.length === 0 ? (
            <Text style={styles.emptyText}>No dishes added yet.</Text>
          ) : (
            <FlatList
              data={menuItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <View>
                    <Text style={styles.listText}>{item.name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                  <Text style={styles.price}>{item.price}</Text>
                </View>
              )}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={() => setScreen("AddItem")}>
            <Text style={styles.buttonText}>Add Menu Item</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // ----------- Add Item Screen -----------
  if (screen === "AddItem") {
    return (
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" }}
        style={styles.bg}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Add New Dish</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter dish name"
            placeholderTextColor="#ccc"
            value={dishName}
            onChangeText={setDishName}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter description"
            placeholderTextColor="#ccc"
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter price in Rands"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <TouchableOpacity style={styles.button} onPress={handleAddItem}>
            <Text style={styles.buttonText}>Add Dish</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonAlt} onPress={() => setScreen("Home")}>
            <Text style={styles.buttonTextAlt}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return null;
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "rgba(0,0,0,0.6)",
    margin: 20,
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#ffd700",
    fontSize: 20,
    marginBottom: 10,
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 20,
  },
  input: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    textAlign: "center",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    marginVertical: 5,
  },
  listText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#ff8c00",
    borderRadius: 10,
    padding: 12,
    width: "70%",
    alignItems: "center",
    marginTop: 15,
  },
  buttonAlt: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    width: "70%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonTextAlt: {
    color: "#000",
    fontWeight: "bold",
  },
});
