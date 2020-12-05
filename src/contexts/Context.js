import Axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '../utilities/constants';
const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartTotal, setCartTotal] = useState([]);
    const [carts, setCarts] = useState([]);

    const getCartTotal = async () => {
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
            .then(res => setCartTotal(res.data))
            .catch(() => setCartTotal(0))
    }

    const dispatch = async (action) => {
        if (action.type == 'UPDATE_CART') {
            await getCartTotal()
            await getCart()
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
            Alert.alert(e.message);
        }
    }

    useEffect(() => {
        getCartTotal()
        getCart()
    }, [])

    return (
        <CartContext.Provider value={{ cartTotal, carts, dispatch }}>
            { children }
        </CartContext.Provider>
    )
}

export { CartContext, CartProvider }