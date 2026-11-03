export default function SaveButton({ saving }: { saving: boolean }) {
    return (
        <div className="flex justify-center">
            <button
                type="submit"
                disabled={saving}
                className="w-full max-w-xs rounded-full bg-slate-900 px-6 py-3 text-lg font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {saving ? "Salvando..." : "Salvar alterações"}
            </button>
        </div>
    )
}