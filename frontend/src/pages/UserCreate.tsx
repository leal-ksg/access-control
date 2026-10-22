import { ChangeEvent, FormEvent, useState } from "react";
import Input from "../components/Input";
import Select from "../components/Select";
import Title from "../components/Title";

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

export default function UserCreate() {
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
    }

    return (
        <section className="w-full max-w-4xl px-6 py-10">
            <Title texto="Criar uma conta" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                    <Input
                        id="nome"
                        name="nome"
                        label="Nome:"
                        placeholder="Digite seu nome completo"
                        value={form.nome}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="sobrenome"
                        name="sobrenome"
                        label="Sobrenome:"
                        placeholder="Digite seu sobrenome"
                        value={form.sobrenome}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        id="email"
                        name="email"
                        type="email"
                        label="E-mail:"
                        placeholder="Digite seu e-mail"
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
                        placeholder="Digite sua senha"
                        value={form.senha}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="confirmarSenha"
                        name="confirmarSenha"
                        type="password"
                        label="Confirmar senha:"
                        placeholder="Digite sua senha novamente"
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
                        className="w-full max-w-xs rounded-full bg-lime-300 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-lime-400"
                    >
                        Criar usuário
                    </button>
                </div>
            </form>
        </section>
    );
}