import React, { useState, useEffect, useRef } from "react";
import { ImageBackground, View, Text, TouchableOpacity, Button, StyleSheet, Image, CheckBox, Modal } from 'react-native';
import Animated from 'react-native-reanimated';
import { Dimensions } from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
screenHeight = screenHeight - (screenHeight * 0.14)

const mapLength = { x: 9.2, y: 9.2 }


const bgImg = require('../assets/img/map.png')
function onPress(location) {
    console.log(location)
}

//, { transform: [{ scale: scaleValue }] }
const ModalPop = ({ visible, children }) => {
    const [showModal, setShowModal] = React.useState(visible);
    const scaleValue = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
        toggleModal();
    }, [visible]);
    const toggleModal = () => {
        if (visible) {
            setShowModal(true);
            Animated.spring(scaleValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,

            }).start();
        } else {
            setTimeout(() => setShowModal(false), 200);
            Animated.timing(scaleValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,

            }).start();
        }
    };
    return (
        <Modal transparent visible={showModal} >
            <View style={styles.modalBackground}>
                <Animated.View style={[styles.modalContainer,]}>

                    {children}
                </Animated.View>
            </View>
        </Modal>
    );
};



const RitoScreen = ({ navigation }) => {

    const [robotY, setRobotY] = React.useState(screenHeight);
    const [robotX, setRobotX] = React.useState((screenWidth / 2) - 20);
    //console.log(robotX)

    function cambiarCoordenadas(coordGazebo) {
        console.log(coordGazebo)
        let nx = (screenWidth / 2) - 20 + (screenWidth - 20) * (coordGazebo.y / mapLength.y);
        let ny = screenHeight - screenHeight * (coordGazebo.x / mapLength.x * (-1));


        let coordCambiadas = { x: nx, y: ny }

        return coordCambiadas;

    }
    //Aquí irá la lectura del topic
    function x() {
        let coordenadasGazeboInput = { x: -7, y: -4 }
        let coordReales = cambiarCoordenadas(coordenadasGazeboInput)
        setRobotX(coordReales.x)
        setRobotY(coordReales.y)
    }

    const [visible, setVisible] = React.useState(false);
    const [isSelected, setSelection] = React.useState(false);
    const [isSelected1, setSelection1] = React.useState(false);
    const [isSelected2, setSelection2] = React.useState(false);
    return (
        <View style={styles.container}>

            <ImageBackground source={bgImg} style={styles.image}>
                <View style={{
                    backgroundColor: '#00B185',
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    position: 'absolute',
                    top: robotY,
                    left: robotX
                }}
                ></View>
                <View style={styles.topBtnContainer}>
                    <TouchableOpacity
                        style={{
                            ...styles.btnTop, justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => { onPress("pescaderia"); x() }}
                    >
                        <Image source={require('../assets/icons/pescaderia.png')}
                            style={{
                                ...styles.btnTop,
                                width: 64,
                                height: 64,

                            }}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            ...styles.btnTop, justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => onPress("charcuteria")}
                    >
                        <Image source={require('../assets/icons/carne.png')}
                            style={{
                                ...styles.btnTop,
                                width: 64,
                                height: 64,

                            }}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.botBtnContainer}>
                    <TouchableOpacity style={{
                        backgroundColor: colors.primary,
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                        bottom: -40,
                        right: -15,
                        ...style.shadow
                    }} onPress={() => setVisible(true)}>
                        <Image source={require('../assets/icons/navigator.png')}
                            resizeMode='contain'
                            style={{
                                width: 48,
                                height: 48,
                                tintColor: colors.white,
                            }}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            ...styles.btnTop, justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => onPress("cajas")}
                    >
                        <Image source={require('../assets/icons/caja_registradora.png')}
                            style={{
                                ...styles.btnTop,
                                width: 84,
                                height: 84,

                            }}></Image>
                    </TouchableOpacity>

                </View>
                <View>
                    <ModalPop visible={visible}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => setVisible(false)}>
                                    <Image source={require("../assets/icons/cancel.png")} style={{ height: 20, width: 20, alignSelf: 'flex-end' }}></Image>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>Selecciona la ruta</Text>
                            </View>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <View style={styles.checkboxComponent}>
                                <CheckBox
                                    value={isSelected}
                                    onValueChange={setSelection}
                                    style={styles.checkbox}
                                />
                                <Text style={styles.label}>Pescaderia</Text>
                            </View>
                            <View style={styles.checkboxComponent} value={isSelected1} onValueChange={setSelection1}>
                                <CheckBox
                                    value={isSelected1}
                                    onValueChange={setSelection1}
                                    style={styles.checkbox}
                                />
                                <Text style={styles.label}>Charcuteria</Text>
                            </View>
                            <View style={styles.checkboxComponent}>
                                <CheckBox
                                    value={isSelected2}
                                    onValueChange={setSelection2}
                                    style={styles.checkbox}
                                />
                                <Text style={styles.label}>Cajas</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <TouchableOpacity style={{
                                backgroundColor: colors.secondary,
                                width: 70,
                                height: 40,
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                ...style.shadow
                            }}>
                                <Text>MOVER</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: colors.secondary,
                                    width: 70,
                                    height: 40,
                                    borderRadius: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    ...style.shadow,

                                }}>
                                <Text>PARAR</Text>
                            </TouchableOpacity>
                        </View>
                    </ModalPop>
                </View>

            </ImageBackground>
        </View >

    );
};

export default RitoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: '#fff',
        backgroundColor: '#eee'
    },
    image: {
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: '#eee',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    topBtnContainer: {
        width: '100%',
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: 15,

    },
    btnTop: {
        width: "30%",
        height: "100%",
    },
    botBtnContainer: {
        width: '100%',
        height: '15%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        bottom: -130,

    },
    btnBot: {
        width: "30%",
        height: "100%",
        backgroundColor: "#fff",


    },
    floatingbtn: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#000000'
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 20,
        elevation: 20,

    },
    header: {
        width: '100%',
        height: 40,
        justifyContent: 'center'
    },
    headerText: {
        alignSelf: 'flex-start',
        top: -22,
        fontSize: 22,
    },
    headerCross: {
        alignItems: 'flex-end',
    },
    checkboxContainer: {
        flexDirection: "column",
        marginBottom: 20,
    },
    checkboxComponent: {
        flexDirection: "row",
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
        fontSize: 16,
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