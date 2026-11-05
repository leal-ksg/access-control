import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Toaster } from "sonner";

export default function RootLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Toaster
                position="top-right"
                richColors
                expand
                visibleToasts={3}
                duration={3000}
                toastOptions={{
                    className: "text-base p-4 min-w-[350px]",
                    style: {
                        fontSize: "16px",
                        padding: "16px",
                        borderRadius: "16px",
                        minWidth: "350px"
                    }
                }}
            />
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="min-w-0 flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}