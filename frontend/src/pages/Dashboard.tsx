import Title from "../components/Title";
import { routes } from "../routes/routes";
import { useAuth } from "../auth/AuthContext";
import { UserRole } from "../models/enums";
import ExternalLink from "../components/ExternalLink";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const { user } = useAuth()
    const backendURL = import.meta.env.VITE_API_URL.split("/api")[0]
    const prismaURL = import.meta.env.VITE_PRISMA_STUDIO_URL
    const [prismaRunning, setPrismaRunning] = useState<boolean>(false)

    useEffect(() => {
        fetch(prismaURL, {
            mode: "no-cors"
        })
            .then(() => setPrismaRunning(true))
            .catch(() => setPrismaRunning(false))
    }, [prismaURL])

    return (<>
        <Title texto="Bem-vindo ao sistema!" />

        {user?.role === UserRole.ADMIN && (
            <div className="flex flex-col gap-5">
                <ExternalLink url={backendURL + routes.api.docs} text="Documentação do backend" />
                {prismaRunning && (
                    <ExternalLink url={prismaURL} text="Prisma Studio" />
                )}
            </div>
        )}

    </>)
}