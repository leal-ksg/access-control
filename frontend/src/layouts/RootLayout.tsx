import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Toaster } from "sonner";

export default function RootLayout() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [collapsed, setCollapsed] = useState<boolean>(() => {
        try {
            return localStorage.getItem("sidebarCollapsed") === "true"
        } catch {
            return false
        }
    })

    function toggleCollapse() {
        setCollapsed(prev => {
            try {
                localStorage.setItem("sidebarCollapsed", String(!prev))
            } catch (error) {
                console.error("Erro ao salvar preferência do menu:", error)
            }
            return !prev
        })
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Toaster
                position="top-right"
                richColors
                expand
                visibleToasts={3}
                duration={3000}
                toastOptions={{
                    className: "text-base p-4",
                    style: {
                        fontSize: "16px",
                        padding: "16px",
                        borderRadius: "16px"
                    }
                }}
            />
            <Header onMenuClick={() => setMenuOpen((open) => !open)} />
            <div className="relative flex flex-1">
                <Sidebar
                    open={menuOpen}
                    collapsed={collapsed}
                    onClose={() => setMenuOpen(false)}
                    onToggleCollapse={toggleCollapse}
                />
                <main className="min-w-0 flex-1 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
