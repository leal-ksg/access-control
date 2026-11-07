import React, { useState } from "react";
import { UserLogin } from "../models/interfaces";
import { useAuth } from "../auth/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../routes/routes";
import Input from "../components/Input";
import axios from "axios";
import { LockKeyhole, ShieldCheck, ArrowRight, LoaderCircle, Boxes } from "lucide-react";

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

            navigate(
                location.state?.from?.pathname ?? routes.dashboard.path,
                { replace: true }
            )
        } catch (error: unknown) {
            console.error("Erro ao realizar login:", error)

            setError(
                axios.isAxiosError(error)
                    ? error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Não foi possível realizar o login."
                    : "Credenciais inválidas"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-5">

            {/* Background decorativo */}
            <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]" />
            <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]" />

            <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border-4 border-white/10 bg-white shadow-2xl lg:grid-cols-2">

                {/* Painel esquerdo */}
                <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 p-12 text-white lg:flex">

                    <div className="absolute -right-20 top-20 h-72 w-72 rounded-full border border-white/10" />
                    <div className="absolute -right-10 top-32 h-52 w-52 rounded-full border border-white/10" />
                    <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-2xl" />

                    <div className="flex flex-col gap-[50%]">
                        <div className="relative z-10 flex items-center gap-3">
                            <img
                                src="/icon.png"
                                className="h-7 w-7 object-contain"
                            />
                            <span className="text-xl font-bold tracking-wide">
                                Controle de Acesso
                            </span>
                        </div>

                        <div className="relative z-10">
                            <h1 className="mb-6 text-4xl font-bold leading-tight">
                                Gerencie seus armários com segurança e praticidade.
                            </h1>

                            <p className="max-w-sm text-base leading-relaxed text-blue-100/70">
                                Uma plataforma centralizada para controlar armários, usuários e permissões de acesso e para visualizar registros de eventos.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">

                    <div className="mb-10">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 lg:hidden">
                            <Boxes size={30} />
                        </div>

                        <span className="text-md font-semibold uppercase tracking-widest text-blue-700 font-mono-custom">
                            Bem-vindo de volta
                        </span>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                            Faça seu login
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-slate-500">
                            Entre com suas credenciais para acessar o sistema.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6"
                    >
                        <Input
                            label="E-mail"
                            name="email"
                            id="email"
                            type="email"
                            placeholder="seuemail@exemplo.com"
                            required
                            value={values.email}
                            onChange={updateField}
                            autoComplete="username"
                        />

                        <Input
                            label="Senha"
                            name="password"
                            id="password"
                            type="password"
                            placeholder="Digite sua senha"
                            required
                            value={values.password}
                            onChange={updateField}
                            autoComplete="current-password"
                        />

                        {error && (
                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                <ShieldCheck size={19} className="mt-0.5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-4 font-semibold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle size={20} className="animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    Entrar
                                    <ArrowRight
                                        size={20}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 border-t border-slate-100 pt-6">
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                            <LockKeyhole size={14} />
                            Acesso restrito a usuários autorizados
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
