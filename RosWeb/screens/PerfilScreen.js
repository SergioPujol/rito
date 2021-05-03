import React from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const PerfilScreen = ({ navigation }) => {
    const [text, onChangeText] = React.useState("Inserte la IP del robot");
    const [number, onChangeNumber] = React.useState(null);
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}

            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '70%' }}>
                <TouchableOpacity style={{
                    backgroundColor: colors.secondary,
                    width: '40%',
                    height: 40,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...style.shadow
                }} onPress={() => { }}>
                    <Text>CONECTAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    backgroundColor: colors.secondary,
                    width: '45%',
                    height: 40,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...style.shadow
                }} onPress={() => {}}>
                    <Text>DESCONECTAR</Text>
                </TouchableOpacity>
            </View>
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
        flexDirection: 'column',
        color: '#fff'
    },
    input: {
        height: 40,
        width: '70%',
        borderBottomWidth: 2,
        marginBottom: 10,
        fontSize: 16
    },
});

const style = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
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
    untinted: "#748c94",
    white: '#fff'
}