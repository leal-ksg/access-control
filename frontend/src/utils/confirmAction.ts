import { toast } from "sonner"

export function confirmAction(message: string): Promise<boolean> {
    return new Promise((resolve) => {
        function cleanup() {
            window.removeEventListener("keydown", handleKeyDown)
            toast.dismiss(toastId)
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Enter") {
                e.preventDefault()
                cleanup()
                resolve(true)
            }
            if (e.key === "Escape") {
                cleanup()
                resolve(false)
            }
        }

        const toastId = toast(message, {
            duration: Infinity,
            action: {
                label: "Confirmar",
                onClick: () => resolve(true)
            },
            cancel: {
                label: "Cancelar",
                onClick: () => resolve(false)
            },
            onDismiss: () => resolve(false)
        })

        window.addEventListener("keydown", handleKeyDown)
    })
}