import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Locker } from "../../models/interfaces";
import { http } from "../../api/http";
import { routes } from "../../routes/routes";
import LoadingElement from "../../components/Loading";
import ErrorElement from "../../components/Error";
import Title from "../../components/Title";
import ReturnButton from "../../components/ReturnButton";
import Input from "../../components/Input";
import SaveButton from "../../components/SaveButton";

interface FormData {
    name: string
    location: string
}

export default function LockerEdit() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [locker, setLocker] = useState<Locker | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [saving, setSaving] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const [form, setForm] = useState<FormData>({
        name: "",
        location: ""
    })

    useEffect(() => {
        async function getLocker() {
            if (!id) {
                setError("ID do armário não informado")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError("")

                const { data } = await http.get<Locker>(`${routes.api.lockers}/${id}`)

                setLocker(data)

                setForm({
                    name: data.name,
                    location: data.location
                })
            } catch (error) {
                console.error("Erro ao carregar armário:", error)
                setError("Não foi possível carregar os dados do armário")
            } finally {
                setLoading(false)
            }
        }

        getLocker()
    }, [id])

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")

        if (!id) {
            setError("ID do armário não foi informado")
            return
        }

        try {
            setSaving(true)
            await http.patch(`${routes.api.lockers}/${id}`, form)
        } catch (error) {
            console.error("Erro ao atualizar armário:", error)
            setError("Não foi possível atualizar o armário")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <LoadingElement texto="página de edição do armário" />
    }

    if (error && !locker) {
        return <ErrorElement error={error} />
    }

    if (!locker) {
        return <ErrorElement error="Armário não encontrado" />
    }

    return (<>
        <Title texto="Editar armário" />
        <ReturnButton />

        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
        >
            <div className="flex flex-col gap-5 mx-50 my-10">
                <Input
                    id="name"
                    name="name"
                    label="Nome:"
                    placeholder="Nome do armário"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    id="location"
                    name="location"
                    label="Local:"
                    placeholder="Localização do armário"
                    value={form.location}
                    onChange={handleChange}
                    required
                />
            </div>

            {error && <ErrorElement error={error} centered />}

            <SaveButton saving={saving} />
        </form>
    </>)
}