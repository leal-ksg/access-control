// O usuário root só é visível para outro root. Para os demais perfis ele
// some de listagens, perfis, permissões e eventos.
type MaybeRoot = { isRoot?: boolean | null } | undefined;

export function isRootUser(user: MaybeRoot): boolean {
  return user?.isRoot === true;
}

// Filtro Prisma para a tabela User: vazio para root, oculta root para o resto.
export function visibleUsersWhere(requester: MaybeRoot) {
  return isRootUser(requester) ? {} : { isRoot: false };
}
