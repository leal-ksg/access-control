export function prettyDate(prop: string) {
    return new Date(prop).toLocaleString("pt-BR").replace(",", " às")
}