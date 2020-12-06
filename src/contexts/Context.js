import Axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '../utilities/constants';
const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartTotal, setCartTotal] = useState([]);
    const [cartTotalPrice, setCartTotalPrice] = useState([]);
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getCartTotal()
        getCartTotalPrice()
        getCart()
    }, [])

    const dispatch = async (action) => {
        if (action.type == 'UPDATE_CART') {
            setLoading(true)
            await getCartTotal()
            await getCartTotalPrice()
            await getCart()
            setLoading(false)
        }
    }

    const getCartTotal = async () => {

        try {
            await Axios
            .get(
                `${API_URL}jumlah_booking_temp`,
                {
                    params: { 
                        id_kustomer: 35
                    }, 
                    headers: { 
                        token: 'Da0sxRC4' 
                    }
                }
            )
            .then(res => {
                setCartTotal(res.data)
            })
            .catch(() => {
                setCartTotal(0)
            })
        } catch (e) {
            setLoading(false)
            Alert.alert(e.message)
        }
    }

    const getCartTotalPrice = async () => {

        try {
            await Axios
            .get(
                `${API_URL}booking_total_temp`,
                {
                    params: { 
                        id_kustomer: 35
                    }, 
                    headers: { 
                        token: 'Da0sxRC4' 
                    }
                }
            )
            .then(res => {
                setCartTotalPrice(res.data[0])
            })
            .catch(() => {
                setCartTotalPrice(0)
            })
        } catch (e) {
            setLoading(false)
            Alert.alert(e.message);
        }
    }

    const getCart = async () => {
        const data = {
            headers: {
                token: 'Da0sxRC4'
            },
            params: {
                id_kustomer: 35
            }
        }

        try {
            await Axios.get(`${API_URL}booking_temp`, data)
                        .then(res => {
                            setCarts(res.data)
                        });
        } catch (e) {
            setLoading(false)
            Alert.alert(e.message);
        }
    }

    return (
        <CartContext.Provider value={{ cartTotal, cartTotalPrice, carts, dispatch, loading }}>
            { children }
        </CartContext.Provider>
    )
}

export { CartContext, CartProvider }