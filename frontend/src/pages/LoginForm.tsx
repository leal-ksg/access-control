import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Input } from "../components/Input";
import { Checkbox } from "../components/Checkbox";
import { Button } from "../components/Button";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginForm() {
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
    rememberMe: false,
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    console.log(values);
  }

  return (
<form onSubmit={handleSubmit} className=" flex flex-col gap-6 w-[50vw] rounded-2xl border border-slate-200 p-8 mt-30 mx-auto">            <Input
        label="E-mail:"
        type="email"
        placeholder="Seu e-mail"
        required
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
      />

      <Input
        label="Senha:"
        type="password"
        placeholder="Sua senha"
        required
        value={values.password}
        onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
      />

      <div className="flex items-center justify-between">
        <Checkbox
          label="Lembrar meus dados"
          checked={values.rememberMe}
          onChange={(e) => setValues((v) => ({ ...v, rememberMe: e.target.checked }))}
        />
        
          <a href="#"
          className="flex items-center gap-1 text-sm text-slate-900 underline">
                  Esqueci minha senha
          <ArrowUpRight size={14} />
        </a>
      </div>

      <Button type="submit" variant="solid">
        Acessar
      </Button>

      <p className="text-center text-sm text-slate-600">Ou crie uma nova conta:</p>

      <Button type="button" variant="outline">
        Criar conta
      </Button>
    </form>
  );
}