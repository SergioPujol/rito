import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ProductosScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Productos</Text>
        </View>
    );
};

export default ProductosScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8fcbbc',
        color: '#fff'
    },
});