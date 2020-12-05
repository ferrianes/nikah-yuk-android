import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Cart from './pages/Cart';
import { Icon } from 'react-native-elements';
import { CartContext, CartProvider } from './contexts/Context';

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <CartContext.Consumer>
      {
        value => {
          return (
            <Tab.Navigator>
              <Tab.Screen 
                name='Home' 
                component={Home}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon 
                      name='home'
                      color={color} 
                      size={size} 
                    />
                  ),
                }} 
              />
              <Tab.Screen 
                name='Cart' 
                component={Cart} 
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon 
                      name='shopping-cart'
                      color={color} 
                      size={size} 
                    />
                  ),
                  tabBarBadge: value.cartTotal,
                }}   
              />
            </Tab.Navigator>
          )
        }
      }
    </CartContext.Consumer>
  )
}

const Stack = createStackNavigator();

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name='Home' 
            component={HomeTabs} 
          />
          <Stack.Screen 
            name='Detail'
            component={ Detail }
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  )
}

export default App