import { Tabs } from 'expo-router';
import PressableIcon from '@/components/PressableIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#9c9ef0ff',
        tabBarInactiveTintColor: '#f8f5f5ff',
        tabBarStyle: {
          backgroundColor: '#606FEF',
          borderTopWidth: 0,
          borderTopColor: '#000000',
          height: 60,
        },
         tabBarItemStyle: {
          padding: 6,
          marginTop: -8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size, focused }) => (
            <PressableIcon
              name={focused ? 'home' : 'home-outline'}
              size={size}
              activeColor={color}
              inactiveColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="historique"
        options={{
          title: 'Historique',
          tabBarIcon: ({ color, size, focused }) => (
            <PressableIcon
              name={focused ? 'time' : 'time-outline'}
              size={size}
              activeColor={color}
              inactiveColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color, size, focused }) => (
            <PressableIcon
              name={focused ? 'search' : 'search-outline'}
              size={size}
              activeColor={color}
              inactiveColor={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => (
            <PressableIcon
              name={focused ? 'person' : 'person-outline'}
              size={size}
              activeColor={color}
              inactiveColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}