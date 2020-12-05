import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import { ScrollView, TouchableNativeFeedback } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import { API_URL, CURR_FMT } from '../utilities/constants';

const Home = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProducts()
    }, []);
    
    const getProducts = async () => {
        setLoading(true)

        const headers = {
            headers: {
                token: 'Da0sxRC4'
            } 
        }

        try {
            await Axios.get(`${API_URL}produk`, headers)
                        .then(res => setProducts(res.data));   
            setLoading(false)
        } catch (e) {
            Alert.alert(e.message);
        }
    }

    return (
        <View style={ styles.container }>
            <ScrollView>
                <Spinner 
                    visible={loading}
                />
                <View style={ styles.cardContainer }>
                {
                    products.map((product, key) => {
                        return (
                            <View style={ styles.cardWrapper } key={key}>
                                <TouchableNativeFeedback
                                    style={ styles.card }
                                    onPress={() => {
                                        navigation.navigate('Detail', {
                                            id: product.id
                                        })
                                    }}
                                >
                                    <Image
                                        source={{ uri: `http://nikahyuk.carissacargo.com/assets/img/api/produk/${ product.gambar }` }} 
                                        style={styles.imgCard} 
                                    />
                                    <View style={styles.cardTextWrapper}>
                                        <Text
                                            ellipsizeMode={'tail'} 
                                            numberOfLines={1} 
                                            style={styles.cardTextTitle}
                                        >
                                            { product.nama }
                                        </Text>
                                        <Text style={styles.cardTextSubtitle}>{ product.kategori }</Text>
                                        <Text style={styles.cardTextPrice}>{ CURR_FMT.format(product.harga) }</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        )
                    })
                }
                </View>
            </ScrollView>
        </View>
    )
}

export default Home

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
    }
})
