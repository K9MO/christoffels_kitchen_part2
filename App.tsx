import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ImageBackground,
  Alert,
  ScrollView,
} from "react-native";

// --- TYPES AND DATA ---
type Course = "Starter" | "Main" | "Dessert" | "Beverage";

type AddOnItem = {
  id: string;
  name: string; // e.g., "Add Side Salad"
};

type MenuItem = {
  id: string;
  name: string;
  addOn: string;
  price: string; // Stored as RXX format
  course: Course;
};

// --- Add-on Data ---
const initialAddOns: AddOnItem[] = [
  { id: "AO1", name: "None / Default Preparation" },
  { id: "AO2", name: "Add Cheese (R20)" },
  { id: "AO3", name: "Extra Sauce (R15)" },
  { id: "AO4", name: "Side Salad (R35)" },
  { id: "AO5", name: "Make it Spicy (Free)" },
];

// Initial menu data updated to use the 'addOn' field
const initialMenuItems: MenuItem[] = [
  // --- STARTER ITEMS ---
  { id: "3", name: "Caesar Salad", addOn: "Add Grilled Prawns (R45)", price: "R80.00", course: "Starter" },
  { id: "4", name: "Soup of the Day", addOn: "None / Default Preparation", price: "R65.00", course: "Starter" },
  { id: "7", name: "Mushroom Bruschetta", addOn: "Make it Spicy (Free)", price: "R75.00", course: "Starter" },
  { id: "8", name: "Prawn Cocktail", addOn: "Double the sauce (R10)", price: "R95.00", course: "Starter" },
  { id: "9", name: "Caprese Skewers", addOn: "Add Olives (R15)", price: "R55.00", course: "Starter" },

  // --- MAIN ITEMS ---
  { id: "1", name: "Grilled Chicken", addOn: "Side Salad (R35)", price: "R120.00", course: "Main" },
  { id: "2", name: "Beef Lasagna", addOn: "Add Cheese (R20)", price: "R150.00", course: "Main" },
  { id: "10", name: "Seared Salmon", addOn: "Extra Sauce (R15)", price: "R185.00", course: "Main" },
  { id: "11", name: "Veggie Burger", addOn: "Add Extra Patty (R45)", price: "R110.00", course: "Main" },
  { id: "12", name: "Lamb Shank", addOn: "Served with mashed potato", price: "R220.00", course: "Main" },
  
  // --- DESSERT ITEMS ---
  { id: "5", name: "Chocolate Cake", addOn: "Add Vanilla Ice Cream (R20)", price: "R75.00", course: "Dessert" },
  { id: "13", name: "Crème Brûlée", addOn: "Add fresh berries (R15)", price: "R70.00", course: "Dessert" },
  { id: "14", name: "Tiramisu", addOn: "Extra dusting of cocoa", price: "R85.00", course: "Dessert" },
  { id: "15", name: "Sorbet Selection", addOn: "Make it a triple scoop (R30)", price: "R60.00", course: "Dessert" },

  // --- BEVERAGE ITEMS ---
  { id: "6", name: "Coffee", addOn: "Extra Shot of Syrup (R10)", price: "R30.00", course: "Beverage" },
  { id: "16", name: "Fresh Orange Juice", addOn: "Large size available (R15)", price: "R40.00", course: "Beverage" },
  { id: "17", name: "Iced Tea", addOn: "Make it sugar-free (Free)", price: "R35.00", course: "Beverage" },
  { id: "18", name: "Sparkling Water", addOn: "Served with lemon slices", price: "R25.00", course: "Beverage" },
];

const availableCourses: Course[] = ["Starter", "Main", "Dessert", "Beverage"];

// Utility to safely parse price from RXX format
const parsePrice = (priceStr: string): number => {
  const numStr = priceStr.replace("R", "");
  const parsed = parseFloat(numStr);
  return isNaN(parsed) ? 0 : parsed;
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [screen, setScreen] = useState<"Home" | "ManageMenu">("Home");
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  
  const [availableAddOns, setAvailableAddOns] = useState<AddOnItem[]>(initialAddOns);
  
  // State for adding new menu item
  const [dishName, setDishName] = useState<string>("");
  const [selectedAddOn, setSelectedAddOn] = useState<string>(initialAddOns[0].name);  
  const [price, setPrice] = useState<string>("");
  const [course, setCourse] = useState<Course>("Main");

  // State for managing dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // State for adding new standard add-on
  const [newAddOnName, setNewAddOnName] = useState<string>("");

  const [filterCourse, setFilterCourse] = useState<Course | null>(null);  

  // Average Price Calculation (Logic remains the same)
  const averagePrices = useMemo(() => {
    const pricesByCourse: Record<Course, number[]> = {
      Starter: [], Main: [], Dessert: [], Beverage: [],
    };

    menuItems.forEach(item => {
      const priceValue = parsePrice(item.price);
      pricesByCourse[item.course]?.push(priceValue);
    });

    const averages: Record<Course, string> = {} as Record<Course, string>;
    availableCourses.forEach(c => {
      const total = pricesByCourse[c].reduce((sum, current) => sum + current, 0);
      const count = pricesByCourse[c].length;
      const average = count > 0 ? total / count : 0;
      averages[c] = average.toFixed(2);
    });

    return averages;
  }, [menuItems]);

  // --- Add-on Management Handlers ---

  const handleAddStandardAddOn = () => {
    if (!newAddOnName.trim()) {
      Alert.alert("Missing Info", "Please enter a name for the new add-on.");
      return;
    }

    const newItem: AddOnItem = {
      id: Math.random().toString(),
      name: newAddOnName.trim(),
    };

    setAvailableAddOns(prev => [...prev, newItem]);
    setNewAddOnName("");
    Alert.alert("Success", `Standard Add-on "${newItem.name}" added.`);
  };

  // --- Menu Item Handlers ---

  const handleAddItem = () => {
    if (!dishName || !price || !selectedAddOn || !course) {
      Alert.alert("Missing info", "Please enter dish name, price, and select a course and add-on.");
      return;
    }

    const priceValue = parsePrice(price);
    if (priceValue <= 0) {
        Alert.alert("Invalid Price", "Price must be a positive number.");
        return;
    }
    
    // --- DUPLICATE CHECK IMPLEMENTATION (FIXED) ---
    const isDuplicate = menuItems.some(
        item => item.name.trim().toLowerCase() === dishName.trim().toLowerCase() && 
                item.course === course
    );

    if (isDuplicate) {
        Alert.alert("Duplicate Dish", 
            `${dishName} is already listed as a ${course}. Please use a different name or edit the existing entry.`
        );
        
        // FIX: Clear the inputs when a duplicate is found
        setDishName("");
        setPrice("");
        return; // Stop execution if a duplicate is found
    }
    // --- END DUPLICATE CHECK ---

    const formattedPrice = `R${priceValue.toFixed(2)}`;

    const newItem: MenuItem = {
      id: Math.random().toString(),
      name: dishName,
      addOn: selectedAddOn,  
      price: formattedPrice,
      course: course,
    };

    setMenuItems([...menuItems, newItem]);
    
    // Clear inputs only on successful add
    setDishName("");
    setSelectedAddOn(availableAddOns[0].name);  
    setPrice("");
    setCourse("Main");  
    
    Alert.alert("Success", `${dishName} (${formattedPrice}) added successfully to ${course}!`);
  };
  
  // New handler to duplicate an existing item
  const handleDuplicateItem = (item: MenuItem) => {
    const newItem: MenuItem = {
      ...item,
      id: Math.random().toString(), // Crucially, give it a new ID
    };

    setMenuItems(prevItems => [...prevItems, newItem]);
    Alert.alert("Added", `${item.name} (${item.price}) duplicated and added as a new item!`);
  };

  const handleRemoveItem = (id: string) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
    Alert.alert("Removed", "Menu item removed successfully!");
  };

  const handleRemoveLastItem = () => {
    if (menuItems.length === 0) {
        Alert.alert("Empty Menu", "There are no items to remove.");
        return;
    }
    setMenuItems(prevItems => prevItems.slice(0, -1));  
    Alert.alert("Removed", `The last added menu item has been removed.`);
  };
  
  const handleSelectAddOn = (addOnName: string) => {
    setSelectedAddOn(addOnName);
    setIsDropdownOpen(false); // Close the dropdown immediately after selection
  };

  // --- HOME SCREEN ---
  const HomeScreen = () => {
    const filteredMenu = menuItems.filter(item => filterCourse === null || item.course === filterCourse);
    const totalDishesCount = filteredMenu.length;
    
    const filterText = filterCourse ? ` (Filtered by ${filterCourse})` : '';

    return (
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1551218808-94e220e084d2" }}
        style={styles.bg}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Christoff’s Pallet</Text>
                
                {/* Average Price Breakdown */}
                <View style={styles.averagePriceBox}>
                    <Text style={styles.averagePriceTitle}>Average Price by Course</Text>
                    <View style={styles.priceList}>
                        {availableCourses.map(c => (
                        <Text key={c} style={styles.priceItemText}>
                            <Text style={{ fontWeight: 'bold' }}>{c}</Text>: R{averagePrices[c]}
                        </Text>
                        ))}
                    </View>
                </View>

                <Text style={styles.subtitle}>Our Menu</Text>
                
                {/* Total Dishes Count */}
                <Text style={styles.totalDishesText}>
                    Total Dishes Displayed: <Text style={{fontWeight: 'bold'}}>{totalDishesCount}</Text>{filterText}
                </Text>
                
                {/* Filter Buttons */}
                <View style={styles.courseSelectContainer}>
                    <TouchableOpacity
                        style={[styles.courseButton, filterCourse === null && styles.courseButtonActive]}
                        onPress={() => setFilterCourse(null)}
                    >
                        <Text style={[styles.courseText, filterCourse === null && styles.courseTextActive]}>All</Text>
                    </TouchableOpacity>
                    {availableCourses.map(c => (
                        <TouchableOpacity
                            key={c}
                            style={[styles.courseButton, c === filterCourse && styles.courseButtonActive]}
                            onPress={() => setFilterCourse(c)}
                        >
                            <Text style={[styles.courseText, c === filterCourse && styles.courseTextActive]}>{c}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {filteredMenu.length === 0 ? (
                    <Text style={styles.emptyText}>No {filterCourse ? `${filterCourse} ` : ''}dishes available.</Text>
                ) : (
                    <FlatList
                        data={filteredMenu}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.listItem}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.listText}>{item.name}</Text>
                                    <Text style={styles.description}><Text style={{fontWeight: 'bold'}}>Add-on</Text>: {item.addOn}</Text>
                                    <Text style={styles.description}><Text style={{fontWeight: 'bold'}}>Course</Text>: {item.course}</Text>
                                </View>
                                <Text style={styles.price}>{item.price}</Text>
                            </View>
                        )}
                        style={{ width: '100%', maxHeight: 400, flexGrow: 0 }}  
                        contentContainerStyle={{ alignItems: 'center' }}
                    />
                )}
                
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.button} onPress={() => setScreen("ManageMenu")}>
                        <Text style={styles.buttonText}>Manage Menu (Chef)</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
      </ImageBackground>
    );
  };

  // --- MANAGE MENU HEADER COMPONENT ---
  const ManageMenuHeader = () => (
    <View style={styles.headerContainer}>
        <Text style={styles.title}>Manage Menu Items</Text>
          
        {/* --- 1. Manage New Standard Add-ons --- */}
        <Text style={styles.subtitle}>Manage Standard Add-ons</Text>
        <TextInput
            style={styles.input}
            placeholder="New Add-on Name (e.g., Side Chips R30)"
            placeholderTextColor="#ccc"
            value={newAddOnName}
            onChangeText={setNewAddOnName}
        />
        <TouchableOpacity style={[styles.button, styles.addOnButton]} onPress={handleAddStandardAddOn}>
            <Text style={styles.buttonText}>Add New Standard Add-on</Text>
        </TouchableOpacity>
        
        <Text style={styles.subtitle}>Add New Dish</Text>

        {/* Course Selection for adding (Feedback Implementation) */}
        <View style={styles.courseSelectContainer}>
            {availableCourses.map(c => (
            <TouchableOpacity
                key={c}
                style={[styles.courseButton, c === course && styles.courseButtonActive]}
                onPress={() => setCourse(c)}
            >
                <Text style={[styles.courseText, c === course && styles.courseTextActive]}>{c}</Text>
            </TouchableOpacity>
            ))}
        </View>

        <TextInput
            style={styles.input}
            placeholder="Enter dish name"
            placeholderTextColor="#ccc"
            value={dishName}
            onChangeText={setDishName}
        />
        
        {/* --- Dropdown List for Add-ons (Picker Simulation) --- */}
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Add-on:</Text>
            <View style={styles.pickerContainer}>
            <TouchableOpacity 
                style={styles.pickerDisplay} 
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <Text style={styles.pickerText}>{selectedAddOn}</Text>
                <Text style={styles.pickerArrow}>{isDropdownOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            
            {isDropdownOpen && (
                <View style={styles.addOnDropdown}>
                {availableAddOns.map((item) => (
                    <TouchableOpacity
                    key={item.id}
                    style={[styles.dropdownItem, selectedAddOn === item.name && styles.dropdownItemActive]}
                    onPress={() => handleSelectAddOn(item.name)}
                    >
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
                </View>
            )}
            </View>
        </View>
        {/* --- End Dropdown List --- */}
        
        <TextInput
            style={styles.input}
            placeholder="Enter base price (e.g., 150)"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddItem}>
            <Text style={styles.buttonText}>Add Dish to {course}</Text>
        </TouchableOpacity>
        
        <Text style={styles.subtitle}>Manage Current Menu</Text>

        <TouchableOpacity style={[styles.button, styles.deleteLastButton]} onPress={handleRemoveLastItem}>
            <Text style={styles.buttonText}>Remove Last Added Item</Text>
        </TouchableOpacity>
    </View>
  );

  // --- MANAGE MENU SCREEN (Using FlatList as the main scroll container) ---
  const ManageMenuScreen = () => (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" }}
      style={styles.bg}
    >
        <View style={styles.container}>
            {menuItems.length === 0 ? (
                // If menu is empty, just render the header content inside a ScrollView
                <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                    <ManageMenuHeader />
                    <Text style={styles.emptyText}>Menu is currently empty. Add a dish above.</Text>
                </ScrollView>
            ) : (
                // If menu has items, use the FlatList for scrolling all content
                <FlatList
                    data={menuItems}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={ManageMenuHeader}
                    renderItem={({ item }) => (
                        <View style={styles.manageListItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.listText}>{item.name} ({item.course})</Text>
                                <Text style={styles.description}>Add-on: {item.addOn}</Text>
                                <Text style={styles.description}>Price: {item.price}</Text>
                            </View>
                            <View style={styles.manageButtonContainer}>
                                {/* DUPLICATE/ADD BUTTON */}
                                <TouchableOpacity  
                                    style={styles.addButton}  
                                    onPress={() => handleDuplicateItem(item)}
                                >
                                    <Text style={styles.addButtonText}>➕ Add</Text>
                                </TouchableOpacity>
                                {/* DEDICATED DELETE BUTTON */}
                                <TouchableOpacity  
                                    style={styles.deleteButton}  
                                    onPress={() => handleRemoveItem(item.id)}
                                >
                                    <Text style={styles.deleteButtonText}>🗑️ Del</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListFooterComponent={
                        <View style={{ height: 100 }} /> 
                    }
                    style={{ width: "100%", flexGrow: 1 }}  
                    contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
                />
            )}
            
            {/* BACK TO HOME BUTTON (moved down to be consistently visible) */}
            <View style={styles.persistentFooter}>
                <TouchableOpacity style={styles.buttonAlt} onPress={() => setScreen("Home")}>
                    <Text style={styles.buttonTextAlt}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ImageBackground>
  );
  
  // --- Screen Rendering Logic ---
  if (screen === "Home") return <HomeScreen />;
  if (screen === "ManageMenu") return <ManageMenuScreen />;

  return null;
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "rgba(0,0,0,0.7)",  
    margin: 20,
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    flex: 1,  
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  persistentFooter: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: "rgba(0,0,0,0.7)", // Match container background
  },
  title: {
    color: "#fff",
    fontSize: 28,  
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#ffd700",
    fontSize: 20,
    marginBottom: 10,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  totalDishesText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 20,
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    textAlign: "center",
  },
  // New styles for Picker/Dropdown simulation
  inputGroup: {
    width: '90%',
    marginVertical: 8,
    position: 'relative',  
    zIndex: 10,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
  },
  pickerDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    zIndex: 11,  
  },
  pickerText: {
    color: '#000',
    fontSize: 16,
  },
  pickerArrow: {
    color: '#000',
  },
  addOnDropdown: {
    position: 'absolute',
    top: 40,  
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 150,
    overflow: 'scroll',  
    zIndex: 12,  
    elevation: 5,  
    shadowColor: '#000',  
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemActive: {
    backgroundColor: '#ffe082',  
  },
  dropdownItemText: {
    textAlign: 'center',
  },
  // End new Picker styles

  // List Item Styles
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0", 
    borderRadius: 10,
    padding: 10,  
    width: "95%",
    marginVertical: 5,
    alignItems: 'center',
  },
  manageListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "95%",
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
    fontSize: 16,
    color: "#ff8c00",
    fontWeight: "bold",
    alignSelf: 'center',
    marginLeft: 10,  
    minWidth: 60,  
    textAlign: 'right',
  },
  // Button Styles
  button: {
    backgroundColor: "#ff8c00",
    borderRadius: 10,
    padding: 12,
    width: "80%",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 5,
    zIndex: 1,
  },
  addOnButton: {
    backgroundColor: "#2ecc71",  
    marginTop: 5,
  },
  buttonAlt: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,  
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonTextAlt: {
    color: "#000",
    fontWeight: "bold",
  },
  manageButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  // NEW ADD BUTTON STYLES
  addButton: {
    backgroundColor: "#27ae60", // Green for "Add"
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 12,
  },
  // NEW DELETE BUTTON STYLES
  deleteButton: {
    backgroundColor: "#dc3545", // Red for "Delete"
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Existing delete styles
  deleteLastButton: {
    backgroundColor: "#c0392b",
    marginBottom: 15,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  // Course Selection Styles  
  courseSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  courseButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    margin: 4,
    minWidth: 70,
    alignItems: 'center',
  },
  courseButtonActive: {
    backgroundColor: '#ffd700',
    borderWidth: 2,
    borderColor: '#ff8c00',
  },
  courseText: {
    color: '#333',
    fontWeight: 'bold',
  },
  courseTextActive: {
    color: '#000',
  },
  // Average Price Styles
  averagePriceBox: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    width: '90%',
  },
  averagePriceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  priceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  priceItemText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 5,
    marginVertical: 3,
  }
});