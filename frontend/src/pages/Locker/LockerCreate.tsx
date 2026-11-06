import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { http } from "../../api/http"
import { routes } from "../../routes/routes"
import ErrorElement from "../../components/Error"
import Title from "../../components/Title"
import ReturnButton from "../../components/ReturnButton"
import Input from "../../components/Input"
import SaveButton from "../../components/SaveButton"
import { Device } from "../../models/interfaces"
import Select from "../../components/Select"
import { toast } from "sonner"

interface FormData {
    name: string
    location: string
    deviceId: string
}

export default function LockerCreate() {
    const navigate = useNavigate()
    const [saving, setSaving] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [devices, setDevices] = useState<Device[]>([])

    const [form, setForm] = useState<FormData>({
        name: "",
        location: "",
        deviceId: ""
    })

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    function handleSelectChange(name: string, value: string) {
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")

        const payload = {
            name: form.name,
            location: form.location,
            deviceId: form.deviceId || null
        }

        try {
            setSaving(true)
            await http.post(routes.api.lockers, payload)
            toast.success("Armário cadastrado com sucesso!")
            navigate(routes.lockers.path)
        } catch (error) {
            console.error("Erro ao criar novo armário:", error)
            setError("Não foi possível criar o armário")
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        async function getDevices() {
            try {
                const { data } = await http.get<Device[]>(routes.api.devices)
                setDevices(data)
            } catch (error) {
                console.error("Erro ao carregar dispositivos:", error)
                setError("Não foi possível carregar os dispositivos")
            }
        }

        getDevices()

        console.log(devices)
    }, [])

    return (<>
        <Title texto="Criar um armário" />
        <ReturnButton />
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 my-6 md:mx-10 md:my-10 xl:mx-50">
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
                <Select
                    id="deviceId"
                    name="deviceId"
                    label="Dispostivo:"
                    value={form.deviceId}
                    onChange={handleSelectChange}
                    options={[
                        { value: "", label: "Nenhum dispositivo" },
                        ...devices.map(d => ({
                            value: d.id,
                            label: `${d.macAddress} ${d.isOnline ? "(ON)" : "(OFF)"}`
                        }))
                    ]}
                />
            </div>

            {error && <ErrorElement error={error} centered />}

            <SaveButton saving={saving} />
        </form>
    </>)
}