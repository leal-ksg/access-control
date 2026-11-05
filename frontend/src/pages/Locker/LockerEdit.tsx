import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Device, Locker } from "../../models/interfaces";
import { http } from "../../api/http";
import { routes } from "../../routes/routes";
import LoadingElement from "../../components/Loading";
import ErrorElement from "../../components/Error";
import Title from "../../components/Title";
import ReturnButton from "../../components/ReturnButton";
import Input from "../../components/Input";
import SaveButton from "../../components/SaveButton";
import Select from "../../components/Select";
import { toast } from "sonner";

interface FormData {
    name: string
    location: string
    deviceId: string
}

export default function LockerEdit() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [locker, setLocker] = useState<Locker | null>(null)
    const [devices, setDevices] = useState<Device[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [saving, setSaving] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const [form, setForm] = useState<FormData>({
        name: "",
        location: "",
        deviceId: ""
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
                    location: data.location,
                    deviceId: data.deviceId ?? ""
                })

                const response = await http.get<Device[]>(routes.api.devices)
                const availableDevices = response.data
                setDevices(data.device && !availableDevices.some(d => d.id === data.device?.id)
                    ? [...availableDevices, data.device]
                    : availableDevices
                )
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

    function handleSelectChange(name: string, value: string) {
        setForm(prev => ({
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

            const payload = {
                name: form.name,
                location: form.location,
                deviceId: form.deviceId || null
            }

            await http.patch(`${routes.api.lockers}/${id}`, payload)
            toast.success("Armário alterado com sucesso!")
            navigate(routes.lockers.path)
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
                <Select
                    id="deviceId"
                    name="deviceId"
                    label="Dispositivo:"
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