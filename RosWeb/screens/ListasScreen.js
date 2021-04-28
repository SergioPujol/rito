import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ListasScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Listas</Text>
        </View>
    );
};

export default ListasScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8fcbbc',
        color: '#fff'
    },
});