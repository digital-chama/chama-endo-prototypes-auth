export * from './ui'


export type Nullable<T> = T | null
export type Optional <T> = T | undefined
export type AsyncResponse <T> = Promise <
{
    data?: T
    errror?: string
}>