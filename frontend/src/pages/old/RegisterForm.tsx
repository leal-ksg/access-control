import { FormEvent, useState } from "react";
import { Input } from "../../components/old/Input";
import { Select } from "../../components/old/Select";
import { Button } from "../../components/old/Button";

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accessLevel: string;
}

const ACCESS_LEVEL_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "aluno", label: "Aluno" },
];

export default function RegisterForm() {
  const [values, setValues] = useState<RegisterFormValues>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accessLevel: "",
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    console.log(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-[50vw] rounded-2xl border border-slate-200 p-8 mx-auto mt-30"
    >
      <h1 className="text-xl font-bold text-slate-900">Criar uma conta</h1>

      <Input
        label="Nome completo:"
        type="text"
        placeholder="Digite seu nome completo"
        required
        value={values.fullName}
        onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
      />

      <Input
        label="E-mail:"
        type="email"
        placeholder="Digite seu e-mail"
        required
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
      />

      <Input
        label="Senha:"
        type="password"
        placeholder="Digite sua senha novamente"
        required
        value={values.password}
        onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
      />

      <Input
        label="Confirmar senha:"
        type="password"
        placeholder="Digite sua senha novamente"
        required
        value={values.confirmPassword}
        onChange={(e) => setValues((v) => ({ ...v, confirmPassword: e.target.value }))}
      />

        <Select
          label="Nível de acesso"
          required
          placeholder="Selecione"
          options={ACCESS_LEVEL_OPTIONS}
          value={values.accessLevel}
          onChange={(e) => setValues((v) => ({ ...v, accessLevel: e.target.value }))}
        />

      <Button type="submit" variant="solid">
        Finalizar cadastro
      </Button>
    </form>
  );
}
