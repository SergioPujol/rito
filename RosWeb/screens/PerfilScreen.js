import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PerfilScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Perfil</Text>
        </View>
    );
};

export default PerfilScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8fcbbc',
        color: '#fff'
    },
});