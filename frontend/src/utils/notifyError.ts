import axios from "axios";
import { toast } from "sonner";

export function getErrorMessage(error: unknown, fallback: string): string {
    return axios.isAxiosError(error)
        ? error.response?.data.message || error.response?.data.error || fallback
        : fallback
}

export function notifyError(error: unknown, fallback: string) {
    console.error(error)
    toast.error(getErrorMessage(error, fallback))
}
