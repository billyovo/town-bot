export interface SetWinnerOptions {
    server: string,
    playerName: string,
    gameName: string
}

export interface CreateWinnerOptions extends SetWinnerOptions {
    UUID: string,
    date: Date
}