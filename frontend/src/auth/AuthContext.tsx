import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { AuthContextData, User } from "../models/interfaces";
import { mockToken, mockUsers } from "../mocks/data";
import { http } from "../api/http";
import { routes } from "../routes/routes";
import clearSession from "../utils/clearSession";

const AuthContext = createContext<AuthContextData | null>(null)

// CORRIGIR ARQUIVO QUANDO LOGIN DO BACKEND ESTIVER DISPONÍVEL

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(mockToken) // MUDAR
    const [user, setUser] = useState<User | null>(mockUsers[0]) // MUDAR
    const [loading, setLoading] = useState<boolean>(true)

    function limparDados() {
        clearSession()
        setToken(null)
        setUser(null)
    }

    // DADOS REAIS
    // useEffect(() => {
    //     const storedToken = localStorage.getItem("token")
    //     const storedUser = localStorage.getItem("user")

    //     setToken(storedToken || null)

    //     try {
    //         setUser(storedUser ? JSON.parse(storedUser) : null)
    //     } catch (error) {
    //         console.error("Erro ao recuperar usuário", error)
    //         limparDados()
    //     }

    //     setLoading(false)
    // }, [])

    // MOCK
    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (storedToken) setToken(storedToken);

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (error) {
                console.error("Erro ao recuperar usuário", error)
                limparDados()
            }
        }

        setLoading(false)
    }, [])

    async function login() { // ARRUMAR FUNÇÃO
        try {
            // const { data } = await http.post(routes.login.path, {
            // ADICIONAR DADOS DE LOGIN
            // })
            const data = { token: mockToken, user: mockUsers[0] }

            // É ISSO QUE RECEBE?
            if (!data?.token) {
                throw new Error("Token ausente na resposta")
            }

            localStorage.setItem("token", data.token)
            setToken(data.token)

            // É ISSO QUE RECEBE?
            if (data?.user) {
                localStorage.setItem("user", JSON.stringify(data.user))
                setUser(data.user)
            } else {
                localStorage.removeItem("user")
                setUser(null)
            }
        } catch (error) {
            console.error("Erro no login", error)
            throw error
        }
    }

    function logout() {
        limparDados()
    }

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
            token,
            loading
        }),
        [token, user, loading]
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");

    return context
}