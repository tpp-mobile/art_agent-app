import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys used by the app stores
const STORAGE_KEYS = [
  'art-agent-auth',
  'art-agent-shortlist',
  'art-agent-theme',
  'art-agent-app-notifications',
  'art-agent-collections',
  'art-agent-onboarding',
];

export async function resetAllDemoData(): Promise<void> {
  try {
    // Clear all app-specific keys
    await AsyncStorage.multiRemove(STORAGE_KEYS);
    console.log('Demo data reset successfully');
  } catch (error) {
    console.error('Error resetting demo data:', error);
    throw error;
  }
}

export async function getStorageInfo(): Promise<{ key: string; size: number }[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const info: { key: string; size: number }[] = [];

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      info.push({
        key,
        size: value ? value.length : 0,
      });
    }

    return info;
  } catch (error) {
    console.error('Error getting storage info:', error);
    return [];
  }
}
