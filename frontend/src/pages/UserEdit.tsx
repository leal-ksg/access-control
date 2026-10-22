import { ChangeEvent, FormEvent, useState } from "react";
import Input from "../components/Input";
import Select from "../components/Select";
import Title from "../components/Title";
import ReturnButton from "../components/ReturnButton";

interface UserForm {
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    nivelAcesso: string;
}

const niveisAcesso = [
    { value: "admin", label: "Administrador" },
    { value: "gerente", label: "Gerente" },
    { value: "usuario", label: "Usuário" },
];

export default function UserEdit() {
    const [form, setForm] = useState<UserForm>({
        nome: "",
        sobrenome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        nivelAcesso: "",
    });
    const [erro, setErro] = useState("");

    function handleChange(
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (form.senha !== form.confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setErro("");
        console.log("Dados enviados:", form);
        // chamada à API aqui
    }

    return (
        <section className=" w-full max-w-4xl px-6 py-10">
            <Title texto="Editar usuário" />
            <ReturnButton />
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 ">
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                    <Input
                        id="nome"
                        name="nome"
                        label="Nome:"
                        placeholder="Nome do usuário"
                        value={form.nome}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="sobrenome"
                        name="sobrenome"
                        label="Sobrenome:"
                        placeholder="Sobrenome do usuário"
                        value={form.sobrenome}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        id="email"
                        name="email"
                        type="email"
                        label="E-mail:"
                        placeholder="email@email.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <div className="hidden md:block" />

                    <Input
                        id="senha"
                        name="senha"
                        type="password"
                        label="Senha:"
                        placeholder="Nova senha"
                        value={form.senha}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="confirmarSenha"
                        name="confirmarSenha"
                        type="password"
                        label="Confirmar senha:"
                        placeholder="Confirme a nova senha"
                        value={form.confirmarSenha}
                        onChange={handleChange}
                        required
                    />

                    <Select
                        id="nivelAcesso"
                        name="nivelAcesso"
                        label="Nível de acesso"
                        options={niveisAcesso}
                        value={form.nivelAcesso}
                        onChange={handleChange}
                        required
                    />
                </div>

                {erro && (
                    <p className="text-center text-red-500" role="alert">
                        {erro}
                    </p>
                )}

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="w-full max-w-xs rounded-full bg-slate-900 px-6 py-3 text-lg font-medium text-white transition hover:bg-slate-800"
                    >
                        Salvar alterações
                    </button>
                </div>
            </form>
        </section>
    );
}   