export function prettyDate(prop: string) {
    return new Date(prop).toLocaleString("pt-BR").replace(",", " às")
}
export function prettyDay(prop: string) {
    return new Date(prop).toLocaleDateString("pt-BR")
}

export function prettyTime(prop: string) {
    return new Date(prop).toLocaleTimeString("pt-BR")
}
