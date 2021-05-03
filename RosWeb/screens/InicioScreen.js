import React from 'react';
import { ImageBackground, View, Text, Button, StyleSheet } from 'react-native';

const InicioScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Inicio</Text>
        </View>
    );
};

export default InicioScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8fcbbc',
        color: '#fff'
    },
});