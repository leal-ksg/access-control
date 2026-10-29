import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import Input from "../components/Input"
import Select from "../components/Select"
import Title from "../components/Title"
import ReturnButton from "../components/ReturnButton"
import { useNavigate, useParams } from "react-router-dom"
import { User } from "../models/interfaces"
import { prettyRole, UserRole } from "../models/enums"
import { routes } from "../routes/routes"
import { http } from "../api/http"
import LoadingElement from "../components/Loading"
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

export default function UserEdit() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
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

    useEffect(() => {
        async function getUser() {
            if (!id) {
                setError("ID do usuário não informado")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError("")

                const { data } = await http.get<User>(`${routes.api.users}/${id}`)

                setUser(data)

                setForm({
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    password: "",
                    passwordConfirm: "",
                    role: data.role
                })
            } catch (error) {
                console.error("Erro ao carregar usuário:", error)
                setError("Não foi possível carregar os dados do usuário")
            } finally {
                setLoading(false)
            }
        }

        getUser()
    }, [id])

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

        if (!id) {
            setError("ID do usuário não informado.")
            return
        }

        if (form.password || form.passwordConfirm) {
            if (form.password !== form.passwordConfirm) {
                setError("As senhas não são iguais.")
                return
            }
        }

        const payload = {
            name: form.name,
            surname: form.surname,
            email: form.email,
            role: form.role,
            ...(form.password ? { password: form.password } : {})
        }

        try {
            setSaving(true)
            await http.patch(`${routes.api.users}/${id}`, payload)
            navigate(routes.users.path)
            navigate(-1)
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error)
            setError("Não foi possível atualizar o usuário")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <LoadingElement texto="página de edição do usuário" />
    }

    if (error && !user) {
        return <ErrorElement error={error} />
    }

    if (!user) {
        return <ErrorElement error="Usuário não encontrado" />
    }

    return (<>
        <Title texto="Editar usuário" />
        <ReturnButton />

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 ">
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
                    placeholder="Deixe em branco para manter a atual"
                    value={form.password}
                    onChange={handleChange}
                />
                <Input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    label="Confirmar senha:"
                    placeholder="Confirme a nova senha"
                    value={form.passwordConfirm}
                    onChange={handleChange}
                />
            </div>

            {error && (
                <div className="text-center">
                    <ErrorElement error={error} />
                </div>
            )}

            <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full max-w-xs rounded-full bg-slate-900 px-6 py-3 text-lg font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving ? "Salvando..." : "Salvar alterações"}
                </button>
            </div>
        </form>
    </>)
}   