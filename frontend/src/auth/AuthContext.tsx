import { createContext, useContext, useMemo, useState } from "react";
import { AuthContextData, User } from "../models/interfaces";
import { mockUsers } from "../mocks/data";

const AuthContext = createContext<AuthContextData | null>(null)

// AGUARDAR IMPLEMENTAÇÃO DE LOGIN DO BACKEND PRA CORRIGIR ESSE ARQUIVO
const mockUser = mockUsers[0] // mock

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(mockUser)

    function login() {
        console.log("Entrando")
        setUser(mockUser)
    }

    function logout() {
        console.log("Saindo")
        setUser(null)
    }

    const value = useMemo(
        () => ({ user, login, logout }),
        [user]
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