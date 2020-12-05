import React from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { CartContext } from '../contexts/Context';
import { CURR_FMT } from '../utilities/constants';

const Cart = ({ navigation }) => {

    const handleDelete = () => {
    
    }

    return (
        <CartContext.Consumer>
            {
                value => {
                    return (
                        <View style={ styles.container }>
                            <ScrollView>
                                <View style={ styles.cardContainer }>
                                {
                                    value.carts.map((cart, key) => {
                                        return (
                                            <View style={ styles.cardWrapper } key={key}>
                                                <Pressable
                                                    style={ styles.card }
                                                    onPress={() => {
                                                        navigation.navigate('Detail', {
                                                            id: cart.id_produk
                                                        })
                                                    }}
                                                >
                                                    <Image
                                                        source={{ uri: `http://nikahyuk.carissacargo.com/assets/img/api/produk/${ cart.gambar }` }} 
                                                        style={styles.imgCard} 
                                                    />
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
                                                            <Pressable
                                                                android_ripple={{ 
                                                                    color: 'silver'
                                                                }}
                                                                onPress={() => handleDelete()} style={ styles.buttonDelete }
                                                            >
                                                                <Text style={ styles.buttonText }>DELETE</Text>
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                </Pressable>
                                            </View>
                                        )
                                    })
                                }
                                </View>
                            </ScrollView>
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
        width: '100%',
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
    }
})
