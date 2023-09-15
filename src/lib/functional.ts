export const keys = <T>(object: T) => Object.keys(object) as (keyof T)[]

export const filterKeys = <T>(object: T, filter: (match: keyof T) => boolean) =>
  keys(object).filter(filter).reduce((acc, key) => ({...acc, [key]: object[key]}), {} as T)

export const mapValues = <R>(object: R, fn: (input: any)=>R[keyof R]): R =>
  keys(object).reduce((acc, key) =>({...acc, [key]: fn(object[key])}), {} as R)
