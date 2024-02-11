import { useContext, createContext, useEffect, useState } from "react"
import { api } from "../lib/axios"
import { Alert } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage'

type Login = {
    email: string,
    password: string,
}

interface AuthState {
    signed: boolean,
    signIn: (data: Login) => void,
    signOut: () => void,
    user: any,
}

export const AuthContext = createContext<AuthState>(undefined!)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider(props: any) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchAuthData = async () => {
            const storageUser = await AsyncStorage.getItem("@Auth:user")
            const storageToken = await AsyncStorage.getItem("@Auth:token")
            if(storageUser && storageToken) {
                setUser(JSON.parse(storageUser))

                api.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${storageToken}`
            }
        }

        fetchAuthData()
    }, [])

    async function signIn({email, password}: Login) {
        const response = await api.post("/auth", {
            email,
            password
        })

        if(response.data.error) {
            Alert.alert(response.data.error)
        } else {
            const { token, user } = response.data
            setUser(user)
            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`

            await AsyncStorage.setItem("@Auth:token", token)
            await AsyncStorage.setItem("@Auth:user", JSON.stringify(user))
        }
    }

    const signOut = async () => {
        await AsyncStorage.clear()
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                signed: !!user,
                signIn,
                signOut
            }}
        >
            { props.children }
        </AuthContext.Provider>
    )
}