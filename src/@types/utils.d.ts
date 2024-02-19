export type Success<T> = {
    data: T,
    error?: null,
    success: true
}

export type Failure = {
    data: null,
    error: string,
    success: false
}
