import AsyncStorage from '@react-native-async-storage/async-storage';

type AsyncStorageEvent = {
    key: string;
    value?: any;
};

type AsyncStorageCallback = (payload: AsyncStorageEvent) => void;

const AsyncStorageManager = {

    listeners: {} as Record<string, AsyncStorageCallback[]>,

    async appendJobToStorage(key: string, value: any) {
        try {
            // Retrieve the existing data from local storage
            const existingData = await AsyncStorage.getItem(key);

            // Parse the existing data (or initialize an empty array if it's the first time)
            let existingArray = existingData ? JSON.parse(existingData) : [];

            // Check if the existing data is an array; if not, create an array with the existing value
            if (!Array.isArray(existingArray)) {
                existingArray = [existingArray];
            }

            // Define the job ID to check
            const jobIdToCheck = value.jobId;

            const index = existingArray.findIndex((item: { jobId: any; }) => item.jobId === jobIdToCheck);

            if (index === -1) {
                existingArray.push(value);
                // Save the updated array back to local storage
                await AsyncStorage.setItem(key, JSON.stringify(existingArray));
                console.log('Data appended successfully');

                AsyncStorageManager.emitEvent('jobAppended', { key, value });
            } else {
                console.log('Object already exists');
            }

        } catch (error) {
            console.error('Error appending data:', error);
            throw error;
        }
    },

    async removeSpecificJobFromStorage(key: string, value: any) {
        try {
            // Retrieve the existing data from local storage
            const existingData = await AsyncStorage.getItem(key);

            // Parse the existing data (or initialize an empty array if it's the first time)
            let existingArray = existingData ? JSON.parse(existingData) : [];

            // Check if the existing data is an array; if not, create an array with the existing value
            if (!Array.isArray(existingArray)) {
                existingArray = [existingArray];
            }

            // Define the job ID to check
            const jobIdToCheck = value.jobId;

            // Find the index of the object with the specified job ID in the existing array
            const index = existingArray.findIndex((item: { jobId: any; }) => item.jobId === jobIdToCheck);

            if (index !== -1) {
                // Remove the object with the specified job ID from the existing array
                existingArray.splice(index, 1);
                console.log('Object removed from existing array');
            } else {
                console.log('Object with jobId not found in existing array');
            }

            // Save the updated array back to local storage
            await AsyncStorage.setItem(key, JSON.stringify(existingArray));
            console.log('Data appended successfully');
        } catch (error) {
            console.error('Error appending data:', error);
            throw error;
        }
    },

    async deleteJobFromStorage(key: string) {
        try {
            await AsyncStorage.removeItem(key);
            console.log(`Data with key '${key}' removed successfully`);
        } catch (error) {
            console.error(`Error removing data with key '${key}':`, error);
            throw error;
        }
    },

    async getAllItemsFromStorage() {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const allItems = await AsyncStorage.multiGet(allKeys);

            // Parse each item's value from JSON
            const parsedItems = allItems.map(([key, value]) => {
                return { key, value: JSON.parse(value || 'null') };
            });

            return parsedItems;
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    },

    //To save new data to storage, for single Data, it will overwrite previously saved otherwise use append above

    // const saveJobToStorage = async (key: string, value: any) => {
    //   try {
    //     await AsyncStorage.setItem(key, JSON.stringify(value));
    //     console.log('Data saved successfully');
    //   } catch (error) {
    //     console.error('Error saving data:', error);
    //     throw error;
    //   }
    // };

    addListener(eventName: string, callback: AsyncStorageCallback) {
        if (!AsyncStorageManager.listeners[eventName]) {
            AsyncStorageManager.listeners[eventName] = [];
        }
        AsyncStorageManager.listeners[eventName].push(callback);
    },

    removeListener(eventName: string, callback: AsyncStorageCallback) {
        const listeners = AsyncStorageManager.listeners[eventName];
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    },

    emitEvent(eventName: string, payload: AsyncStorageEvent) {
        const listeners = AsyncStorageManager.listeners[eventName] || [];
        listeners.forEach(callback => callback(payload));
    },
};

export { AsyncStorageEvent }

export default AsyncStorageManager;
