import { ChangeEvent, FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { http } from "../../api/http"
import { routes } from "../../routes/routes"
import ErrorElement from "../../components/Error"
import Title from "../../components/Title"
import ReturnButton from "../../components/ReturnButton"
import Input from "../../components/Input"
import SaveButton from "../../components/SaveButton"

interface FormData {
    name: string
    location: string
}

export default function LockerCreate() {
    const navigate = useNavigate()
    const [saving, setSaving] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const [form, setForm] = useState<FormData>({
        name: "",
        location: "",
    })

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

        try {
            setSaving(true)
            await http.post(routes.api.lockers, form)
            alert("Armário cadastrado com sucesso!")
            navigate(routes.lockers.path)
        } catch (error) {
            console.error("Erro ao criar novo armário:", error)
            setError("Não foi possível criar o armário")
        } finally {
            setSaving(false)
        }
    }

    return (<>
        <Title texto="Criar um armário" />
        <ReturnButton />
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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