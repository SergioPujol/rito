import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

import InicioScreen from '../screens/InicioScreen';
import PerfilScreen from '../screens/PerfilScreen';
import RitoScreen from '../screens/RitoScreen';
import ProductosScreen from '../screens/ProductosScreen';
import ListasScreen from '../screens/ListasScreen';


const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -30,
            justifyContent: 'center',
            alignItems: 'center',
            ...style.shadow
        }}
        onPress={onPress}
    >
        <View style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: colors.secondary,
            ...style.shadow

        }}>
            {children}
        </View>
    </TouchableOpacity>
)

const Tabs = () => {
    return (
        <Tab.Navigator tabBarOptions={{
            showLabel: false,
            style: {
                position: 'absolute',
                bottom: 25,
                left: 20,
                right: 20,
                elevation: 0,
                backgroundColor: '#fff',
                borderRadius: 15,
                height: 70,
                ...style.shadow

            }
        }}>
            <Tab.Screen name="Inicio" component={InicioScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 3 }}>
                        <Image source={require('../assets/icons/home.png')}
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? colors.primary : colors.untinted
                            }}></Image>
                        <Text style={{ color: focused ? colors.primary : colors.untinted, fontSize: 12 }}>Inicio</Text>
                    </View>
                ),
            }}>
            </Tab.Screen>
            <Tab.Screen name="Productos" component={ProductosScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 3 }}>
                        <Image source={require('../assets/icons/search.png')}
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? colors.primary : colors.untinted
                            }}></Image>
                        <Text style={{ color: focused ? colors.primary : colors.untinted, fontSize: 12 }}>Productos</Text>
                    </View>
                ),
            }}>
            </Tab.Screen>
            <Tab.Screen name="Rito" component={RitoScreen} options={{
                tabBarIcon: ({ focused }) => (

                    <Image source={require('../assets/icons/robotic.png')}
                        resizeMode='contain'
                        style={{
                            width: 36,
                            height: 36,
                            tintColor: '#fff',
                        }}></Image>
                ),
                tabBarButton: (props) => (
                    <CustomTabBarButton {...props} />
                )
            }}>
            </Tab.Screen>

            <Tab.Screen name="Listas" component={ListasScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 3 }}>
                        <Image source={require('../assets/icons/clipboard.png')}
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? colors.primary : colors.untinted
                            }}></Image>
                        <Text style={{ color: focused ? colors.primary : colors.untinted, fontSize: 12 }}>Listas</Text>
                    </View>
                ),
            }}>
            </Tab.Screen>
            <Tab.Screen name="Perfil" component={PerfilScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 3 }}>
                        <Image source={require('../assets/icons/user.png')}
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? colors.primary : colors.untinted
                            }}></Image>
                        <Text style={{ color: focused ? colors.primary : colors.untinted, fontSize: 12 }}>Perfil</Text>
                    </View>
                ),
            }}>
            </Tab.Screen>
        </Tab.Navigator>
    )
}

const style = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            with: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
});

const colors = {
    secondary: "#FAC001",
    primary: "#00B185",
    untinted: "#748c94"
}

export default Tabs;