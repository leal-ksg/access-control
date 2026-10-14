import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContextData, User, UserLogin } from "../models/interfaces";
import { http } from "../api/http";
import { routes } from "../routes/routes";
import clearSession from "../utils/clearSession";

const AuthContext = createContext<AuthContextData | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const limparDados = useCallback(() => {
        clearSession()
        setToken(null)
        setUser(null)
    }, [])

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        try {
            if (!storedToken || !storedUser) {
                limparDados()
                return
            }

            setUser(JSON.parse(storedUser))
            setToken(storedToken)
        }
        catch (error) {
            console.error("Erro ao recuperar sessão", error)
            limparDados()
        }
        finally {
            setLoading(false)
        }

    }, [limparDados])

    const login = useCallback(async ({ email, password }: UserLogin) => {
        try {
            const { data } = await http.post(routes.api.login, {
                email,
                password
            })

            if (!data?.token || !data.user) {
                throw new Error("Resposta de login inválida")
            }

            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            setToken(data.token)
            setUser(data.user)
        } catch (error) {
            throw error
        }
    }, [])

    const logout = useCallback(() => {
        limparDados()
    }, [limparDados])

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
            token,
            loading
        }),
        [user, login, logout, token, loading]
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