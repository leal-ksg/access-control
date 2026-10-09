import { FormEvent, useState } from "react";
import { Input } from "../../components/old/Input";
import { Button } from "../../components/old/Button";

interface CabinetFormValues {
  name: string;
  location: string;
  content: string;
}

export default function CabinetForm() {
  const [values, setValues] = useState<CabinetFormValues>({
    name: "",
    location: "",
    content: "",
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
      <h1 className="text-xl font-bold text-slate-900">Armário</h1>

      <Input
        label="Nome"
        type="text"
        placeholder="Digite  o nome do armário"
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
      />

      <Input
        label="Local"
        type="text"
        placeholder="Digite o local do armário"
        value={values.location}
        onChange={(e) => setValues((v) => ({ ...v, location: e.target.value }))}
      />

      <Input
        label="Conteúdo"
        type="text"
        placeholder="Digite o conteúdo do armário"
        value={values.content}
        onChange={(e) => setValues((v) => ({ ...v, content: e.target.value }))}
      />

      <Button type="submit" variant="solid">
        Finalizar cadastro
      </Button>
    </form>
  );
}
