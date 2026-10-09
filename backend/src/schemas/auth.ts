import * as z from "zod";

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido").min(1, "O e-mail é obrigatório"),
  password: z.string("Informe a senha").min(1, "A senha é obrigatória"),
});
