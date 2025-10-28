// Initial data
const initialItems = [
    { id: 1, name: 'Wheat', stock: 10, unit: 'kg' },
    { id: 2, name: 'Rice', stock: 5, unit: 'kg' },
    { id: 3, name: 'Sugar', stock: 2, unit: 'kg' },
    { id: 4, name: 'Salt', stock: 8, unit: 'kg' },
    { id: 5, name: 'Oil', stock: 1, unit: 'liters' },
];

// Create a copy of initial data
let items = [...initialItems];

// Function to get all items
const getItems = () => [...items];

// Function to add or update an item
const addOrUpdateItem = (newItem) => {
    // Check if item with same name and unit already exists
    const existingItemIndex = items.findIndex(
        item => item.name.toLowerCase() === newItem.name.toLowerCase() && 
               item.unit.toLowerCase() === newItem.unit.toLowerCase()
    );

    if (existingItemIndex >= 0) {
        // If item exists, update the stock
        items[existingItemIndex].stock += parseInt(newItem.stock, 10);
    } else {
        // If item doesn't exist, add it with a new ID
        const newId = Math.max(0, ...items.map(item => item.id)) + 1;
        items.push({
            id: newId,
            name: newItem.name,
            stock: parseInt(newItem.stock, 10),
            unit: newItem.unit
        });
    }
    return [...items]; // Return a new array to trigger re-renders
};

// Function to reset to initial data (for testing)
const resetItems = () => {
    items = [...initialItems];
    return [...items];
};

export { getItems, addOrUpdateItem, resetItems };
