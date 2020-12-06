import Axios from 'axios';
import React, { useState } from 'react'
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import { CartContext } from '../contexts/Context';
import { API_URL, CURR_FMT } from '../utilities/constants';

const Cart = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [idBookingTemp, setIdBookingTemp] = useState('')
    const [hargaProduk, setHargaProduk] = useState(0)
    const [selectedProduct, setSelectedProduct] = useState('')
    const [loading, setLoading] = useState(false)

    const handleDelete = (id, harga, selectedProduct) => {
        setIdBookingTemp(id)
        setHargaProduk(harga)
        setSelectedProduct(selectedProduct)
        setModalVisible(true);
    }

    const AppModal = ({ value }) => {
        const handleDeletePress = async (id, idKustomer, harga) => {
            
            const headers = {
                headers: {
                    token: 'Da0sxRC4'
                } 
            }

            const updateTotalPrice = async () => {
                if (harga != 0) {
                    try {
                        const cartTotalPrice = value.cartTotalPrice.total - harga

                        const dataTotal = {
                            id_kustomer: idKustomer,
                            total: cartTotalPrice
                        }
                        await Axios
                            .put(`${API_URL}booking_total_temp`, dataTotal, headers)
                            .then( async () => {
                                setModalVisible(false);
                                setLoading(false);
                                await value.dispatch({type: 'UPDATE_CART'})
                                ToastAndroid.show("Produk sukses dihapus dari keranjang !", ToastAndroid.SHORT)
                            })
                            .catch(() => console.log(e.response))
                    } catch (e) {
                        setModalVisible(false);
                        setLoading(false);
                        Alert.alert(e.message)
                    }
                } else {
                    setModalVisible(false);
                    setLoading(false);
                    await value.dispatch({type: 'UPDATE_CART'})
                    ToastAndroid.show("Produk sukses dihapus dari keranjang !", ToastAndroid.SHORT)
                }
            }

            setLoading(true);
            setModalVisible(false);
            
            try {
                await Axios
                    .delete(`${API_URL}booking_temp`, { ...headers, params: { id } })
                    .then(async () => {
                        await updateTotalPrice()
                    })
                    .catch((e) => {
                        setModalVisible(false);
                        setLoading(false);
                        Alert.alert(e.response.message)
                    })
            } catch (e) {
                setModalVisible(false);
                setLoading(false);
                Alert.alert(e.message)
            }
        }

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure for delete item { selectedProduct } ?</Text>
                        <View style={ styles.buttonModalWrapper }>
                            <View style={{ ...styles.buttonWrapper, marginRight: 5 }}>
                                <Pressable
                                    android_ripple={{ 
                                        color: 'silver'
                                    }}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}
                                    style={ styles.buttonDelete }
                                >
                                    <Text style={ styles.buttonText }>Cancel</Text>
                                </Pressable>
                            </View>
                            <View style={ styles.buttonWrapper }>
                                <Pressable
                                    android_ripple={{ 
                                        color: 'silver'
                                    }}
                                    onPress={ async () => {
                                        await handleDeletePress(idBookingTemp, 35, hargaProduk)
                                    }}
                                    style={ styles.buttonDelete }
                                >
                                    <Text style={ styles.buttonText }>DELETE</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <CartContext.Consumer>
            {
                value => {
                    return (
                        <View style={ styles.container }>
                            <Spinner 
                                visible={(loading || value.loading) ? true : false}
                            />
                            <ScrollView>
                                <AppModal value={ value } />
                                <View style={ styles.cardContainer }>
                                {
                                    value.carts.map((cart, key) => {
                                        return (
                                            <View style={ styles.cardWrapper } key={key}>
                                                <View style={ styles.card } >
                                                    <Pressable
                                                        onPress={() => {
                                                            navigation.navigate('Detail', {
                                                                id: cart.id_produk
                                                            })
                                                        }}
                                                        style= { styles.imgCardWrapper }
                                                    >
                                                        <Image
                                                            source={{ uri: `http://nikahyuk.carissacargo.com/assets/img/api/produk/${ cart.gambar }` }} 
                                                            style={styles.imgCard} 
                                                        />
                                                    </Pressable>
                                                    <View style={styles.cardTextWrapper}>
                                                        <Text
                                                            ellipsizeMode={'tail'} 
                                                            numberOfLines={1} 
                                                            style={styles.cardTextTitle}
                                                        >
                                                            { cart.produk }
                                                        </Text>
                                                        <Text style={styles.cardTextSubtitle}>{ cart.kategori }</Text>
                                                        <Text style={styles.cardTextPrice}>{ CURR_FMT.format(cart.harga) }</Text>
                                                        <View style={ styles.buttonWrapper }>
                                                            <TouchableNativeFeedback
                                                                onPress={() => handleDelete(cart.id, cart.harga, cart.produk)} 
                                                                style={ styles.buttonDelete }
                                                            >
                                                                <Text style={ styles.buttonText }>DELETE</Text>
                                                            </TouchableNativeFeedback>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                                </View>
                            </ScrollView>
                            <View style={ styles.cartTotalPriceContainer }>
                                <Text>Total : { CURR_FMT.format(value.cartTotalPrice.total) }</Text>
                            </View>
                        </View>
                    )
                }
            }
        </CartContext.Consumer>
    )
}

export default Cart

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardContainer: {
        padding: 20,
    },
    cardWrapper: {
        borderRadius: 8,
        overflow: 'hidden',
        width: '100%',
        marginBottom: 10,
        elevation: 6,
    },
    card: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 8,
    },
    imgCardWrapper: {
        flexDirection: 'row',
    },
    imgCard: {
        height: '100%',
        width: 100,
        marginRight: 10
    },
    cardTextWrapper: {
        flex: 1,
        alignContent: 'stretch',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingVertical: 8,
        paddingRight: 14,
    },
    cardTextTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    cardTextSubtitle: {
        fontWeight: '300',
        color: '#8898aa'
    },
    cardTextPrice: {
        color: '#fb6340',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonWrapper: {
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
    },
    buttonDelete: {
        padding: 10,
        backgroundColor: 'salmon'
    },
    buttonText: {
        marginLeft: 'auto',
        marginRight: 'auto',
        color: 'white'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    cartTotalPriceContainer: {
        backgroundColor: '#fff',
        padding: 10,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    buttonModalWrapper: {
        flexDirection: 'row',
    }
})
