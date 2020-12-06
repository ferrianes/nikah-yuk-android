import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Alert, Button, Image, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import { CartContext } from '../contexts/Context';
import { API_URL } from '../utilities/constants';

const Detail = ({ route }) => {
    const { id } = route.params;
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProduct()
    }, []);
    
    const getProduct = async () => {
        setLoading(true)

        const data = {
            headers: {
                token: 'Da0sxRC4'
            },
            params: {
                id
            }
        }

        try {
            await Axios
                .get(`${API_URL}produk`, data)
                .then(res => {
                    setProduct(res.data[0])
                    setLoading(false)
                });
        } catch (e) {
            Alert.alert(e.message);
        }
    }

    const handleAddtoCart = async (id_kustomer, id_produk, harga, value) => {

        const headers = {
            headers: {
                token: 'Da0sxRC4'
            }
        }

        const submitCart = async () => {
            try {
                await Axios
                    .post(`${API_URL}booking_temp`, {id_kustomer, id_produk, jumlah: 1}, headers)
                    .then( async () => {
                        await value.dispatch({type: 'UPDATE_CART'})
                        setLoading(false)
                        ToastAndroid.show("Produk sukses ditambahkan ke keranjang !", ToastAndroid.SHORT)
                    })
            } catch (e) {
                setLoading(false)
                Alert.alert(e.message);
            }
        }

        const handleCartTotal = async (dataTotal, action) => {
            try {
                if (action === 'PUT') {
                    if (dataTotal.harga != 0) {
                        await Axios
                            .put(`${API_URL}booking_total_temp`, dataTotal, headers)
                            .then(async () => {
                                await submitCart();
                            })
                    } else {
                        await submitCart();
                    }
                } else if (action === 'POST')  {
                    await Axios
                        .post(`${API_URL}booking_total_temp`, dataTotal, headers)
                        .then(async () => {
                            await submitCart();
                        })
                }
            } catch (e) {
                setLoading(false)
                Alert.alert(e.message);
            }
        }

        const processAddToCart = async () => {
            const data = {
                headers: {
                    token: 'Da0sxRC4'
                },
                params: {
                    id_kustomer
                }
            }

            try {
                await Axios
                    .get(`${API_URL}booking_total_temp`, data)
                    .then(async res => {
                        let total = parseInt(res.data[0].total) + harga
                        
                        const dataTotal = {
                            id_kustomer,
                            total,
                            harga
                        }
    
                        await handleCartTotal(dataTotal, 'PUT');
                    })
                    .catch(async e => {
                        if (e.response.data.message === 'Booking Total tidak ditemukan') {
                            const headers = {
                                headers: {
                                    token: 'Da0sxRC4'
                                }
                            }
    
                            const dataTotal = {
                                id_kustomer,
                                total: harga
                            }
                            
                            await handleCartTotal(dataTotal, 'POST');
                        } else {
                            setLoading(false)
                            Alert.alert(e.response.data);
                        }
                    })
            } catch (e) {
                setLoading(false)
                Alert.alert(e.message);
            }
        }

        setLoading(true)

        try {
            await Axios
                .get(
                    `${API_URL}jumlah_booking_temp`,
                    {
                        params: { 
                            id_kustomer,
                            id_produk
                        }, 
                        headers: { 
                            token: 'Da0sxRC4' 
                        }
                    }
                )
                .then(() => {
                    setLoading(false)
                    Alert.alert('Maaf Produk sudah ada di keranjang');
                })
                .catch(async (e) => { 
                    const { response: { status: statusCode, data: { status, message }, data } } = e
                    if (
                        statusCode === 404 && 
                        status === false && 
                        message === 'Jumlah booking tidak ditemukan'
                    ) {
                        await processAddToCart()
                    } else {
                        setLoading(false)
                        Alert.alert(data);
                    }
                })
        } catch (e) {
            setLoading(false)
            Alert.alert(e.message);
        }
    }

    return (
        <CartContext.Consumer>
            {
                value => {
                    return (
                        <View style={ styles.container }>
                            <ScrollView>
                                <Spinner 
                                    visible={ loading }
                                />
                                <Image source={{ uri: `http://nikahyuk.carissacargo.com/assets/img/api/produk/${ product.gambar }` }} style={styles.imgCard} />
                                <View style={ styles.cardTextWrapper }>
                                    <Text style={ styles.cardTextTitle }>{ product.nama }</Text>
                                    <Text style={ styles.cardTextSubtitle }>{ product.kategori }</Text>
                                    <Text style={ styles.cardProductDesc }>Product Description</Text>
                                    <Text style={ styles.cardTextDesc }>{ product.deskripsi }</Text>
                                </View>
                            </ScrollView>
                            <View style={ styles.actionDetail }>
                                <Button
                                    title='Add to Cart'
                                    onPress={ () => handleAddtoCart(35, product.id, parseInt(product.harga), value) }
                                />
                            </View>
                        </View>
                    )
                }
            }
        </CartContext.Consumer>
    )
}

export default Detail

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    imgCard: {
        height: 300,
        width: '100%',
    },
    cardTextWrapper: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    cardTextTitle: {
        fontWeight: 'bold',
        fontSize: 30
    },
    cardTextSubtitle: {
        fontWeight: '300',
        color: '#8898aa'
    },
    cardProductDesc: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 20
    },
    cardTextDesc: {
        fontWeight: '300',
        color: '#8898aa'
    },
    actionDetail: {}
})
