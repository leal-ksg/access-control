import { ChangeEvent, FormEvent, useState } from "react"
import Input from "../components/Input"
import Select from "../components/Select"
import Title from "../components/Title"
import ReturnButton from "../components/ReturnButton"
import { prettyRole, UserRole } from "../models/enums"
import { useNavigate } from "react-router-dom"
import { routes } from "../routes/routes"
import { http } from "../api/http"
import ErrorElement from "../components/Error"

interface FormData {
    name: string
    surname: string
    email: string
    password: string
    passwordConfirm: string
    role: UserRole
}

const roles = Object.values(UserRole).map((role) => ({
    value: role,
    label: prettyRole(role)
}))

export default function UserCreate() {
    const navigate = useNavigate()
    const [saving, setSaving] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const [form, setForm] = useState<FormData>({
        name: "",
        surname: "",
        email: "",
        password: "",
        passwordConfirm: "",
        role: UserRole.STUDENT,
    })

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    function handleRoleChange(value: string) {
        setForm((prev) => ({
            ...prev,
            role: value as UserRole
        }))
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")

        if (form.password !== form.passwordConfirm) {
            setError("As senhas não coincidem.")
            return
        }

        const payload = {
            name: form.name,
            surname: form.surname,
            email: form.email,
            password: form.password,
            role: form.role
        }

        try {
            setSaving(true)
            await http.post(routes.api.users, payload)
            navigate(routes.users.path)
        } catch (error) {
            console.error("Erro ao criar novo usuário:", error)
            setError("Não foi possível criar o usuário")
        } finally {
            setSaving(false)
        }
    }

    if (error) {
        return <ErrorElement error={error} />
    }

    return (
        <>
            <Title texto="Criar um usuário" />
            <ReturnButton />
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mx-50 my-10">
                    <Input
                        id="name"
                        name="name"
                        label="Nome:"
                        placeholder="Nome do usuário"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="surname"
                        name="surname"
                        label="Sobrenome:"
                        placeholder="Sobrenome do usuário"
                        value={form.surname}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        label="E-mail:"
                        placeholder="email@email.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <Select
                        id="role"
                        name="role"
                        label="Nível de acesso"
                        options={roles}
                        value={form.role}
                        onChange={handleRoleChange}
                        required
                    />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        label="Senha:"
                        placeholder="Senha do usuário"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="passwordConfirm"
                        name="passwordConfirm"
                        type="password"
                        label="Confirmar senha:"
                        placeholder="Confirme a senha do usuário"
                        value={form.passwordConfirm}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && (
                    <p className="text-center text-red-500" role="alert">
                        {error}
                    </p>
                )}

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full max-w-xs rounded-full bg-slate-900 px-6 py-3 text-lg font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? "Criando..." : "Criar usuário"}
                    </button>
                </div>
            </form>
        </>
    )
}