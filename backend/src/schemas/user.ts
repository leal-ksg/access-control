import * as z from "zod"
import { Role } from "../generated/prisma/enums"

export const createUserSchema = z.object({
  name: z.string("Informe o nome do usuário").min(1, "O nome do usuário é obrigatório"),
  surname: z.string("Informe o sobrenome do usuário").min(1, "O sobrenome do usuário é obrigatório"),
  email: z.email("Informe um e-mail válido"),
  password:  z.string("Informe a senha do usuário").min(1, "A senha do usuário é obrigatória"),
  role: z.enum(Role, "Informe um perfil válido para o usuário")
})

export const updateUserSchema = createUserSchema.partial().extend({
    active: z.boolean("O campo 'ativo' deve ser verdadeiro ou falso").optional().nullable()
})