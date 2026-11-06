import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Toaster } from "sonner";

export default function RootLayout() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)

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
                <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
                <main className="min-w-0 flex-1 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
