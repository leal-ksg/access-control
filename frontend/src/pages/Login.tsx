import React, { useState } from "react";
import { UserLogin } from "../models/interfaces";
import { useAuth } from "../auth/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../routes/routes";
import Input from "../components/Input";
import axios from "axios";
import Header from "../components/Header";
import Title from "../components/Title";

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [values, setValues] = useState<UserLogin>({
        email: "",
        password: ""
    })
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    function updateField(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target

        setValues(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError("")

        try {
            await login(values)
            navigate(location.state?.from?.pathname ?? routes.dashboard.path, { replace: true })
        } catch (error: unknown) {
            console.error("Erro ao realizar login:", error)
            setError(
                (axios.isAxiosError(error))
                    ? error.response?.data?.message || error.response?.data?.error
                    : "Credenciais inválidas"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-8 p-4">
            <h1 className="max-w-lg text-center text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
                Acesso de Controle
                <span className="block">PIPA IFMAKERS</span>
            </h1>
            <form
                className="flex flex-col w-full gap-6 sm:gap-10 max-w-lg p-6 sm:p-8 border rounded-4xl shadow-[0_0_10px_rgba(0,0,0,.5)]"
                onSubmit={handleSubmit}
            >
                <Title texto="Faça seu login" centered marginless />
                <Input
                    label={"E-mail"}
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    required
                    value={values.email}
                    onChange={updateField}
                    autoComplete="username"
                />
                <Input
                    label={"Senha"}
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    required
                    value={values.password}
                    onChange={updateField}
                    autoComplete="current-password"
                />
                {!loading && error && (
                    <p className="text-md text-[var(--red)]">
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-4xl bg-[var(--color-primary)] p-5 text-white font-semibold hover:bg-[var(--color-secondary)] transition disabled:opacity-50 text-lg"
                >
                    {loading ? "Entrando" : error ? "Tentar novamente" : "Entrar"}
                </button>
            </form>
        </div>
    )
}