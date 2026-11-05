import axios from "axios";
import { toast } from "sonner";

export function notifyError(error: unknown, fallback: string) {
    console.error(error)

    const message = axios.isAxiosError(error)
        ? error.response?.data.message || error.response?.data.error || fallback
        : fallback

    toast.error(message)
}