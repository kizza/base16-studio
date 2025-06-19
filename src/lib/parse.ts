import { filterKeys } from "@/lib/functional"
import { Palette, Scheme } from "@/types"
import { asHex } from "./colour"

export const parseFromLua = (buffer: string): Scheme | false => {
  const chunks = buffer.match(/{(.|\n)*base00(.|\n)*}/gm)
  if (chunks && chunks.length > 0) {
    const raw = chunks[0]
    const clean = raw.replace(/\n|\\|\s|{|}|'/g, "")
    const tokens = clean.split(",")
    const pairs = tokens.map(t => t.split("="))
    return pairs.reduce((acc, pair) => ({...acc, [pair[0]]: asHex(pair[1])}), {}) as Scheme
  }
  return false
}

export const parseFromYaml = (buffer: string): Scheme | false => {
  const parsed = buffer
    .split('\n')
    .map(line => line.trim()) // Remove left padding for colours
    .filter(line => /^\w+:/.test(line)) // Only populated lines
    .filter(line => !/^palette+:/.test(line)) // Remove palette key (as orphaned parent of colours)
    .map(line => line.split(':'))
    .map(([head, ...tail]) => [head, tail.join(':')])
    .map(([key, val]) => [key, val.split('"')[1]])
    .reduce((acc, [key, val]) => ({...acc, [key]: val}), {}) as Palette & {scheme: string, author: string}

  return {
    ...filterKeys(parsed, key => key !== 'scheme')
  } as Scheme
}

export const parseFromBash = (buffer: string): Scheme | false => {
  const configTest = /^color\w\w=".*"/
  const palette: Palette = buffer
    .split('\n')
    .filter(line => configTest.test(line))
    .map(line => ({
      key: toBase16Name(line.match(/^color\w\w/)[0]),
      hex: cleanFromTerminal(line.match(/"(.)*"/)[0]),
    }))
    .reduce((acc, each) => ({...acc, [each.key]: each.hex}), {} as Palette)

  const attributes = buffer
    .split('\n')
    .filter(line => /^# Scheme.*:/.test(line))
    .map(line => line.split(':'))
    .map(([head, ...tail]) => [head, tail.join(':')])
    .map(([key, val]) => [
      key.replace('# Scheme', '').trim(),
      val.trim(),
    ])
    .reduce((acc, pair) => ({...acc, [pair[0]]:pair[1]}), {}) as {name: string, author: string}

  return {...palette, ...attributes};
}

const toBase16Name = (key: string) => {
  const translate: Record<string, keyof Palette> = {
    color00: 'base00', color01: 'base08', color02: 'base0B', color03: 'base0A', color04: 'base0D', color05: 'base0E', color06: 'base0C', color07: 'base05', color08: 'base03', color15: 'base07', color16: 'base09', color17: 'base0F', color18: 'base01', color19: 'base02', color20: 'base04', color21: 'base06',
  }
  return translate[key]
}

const cleanFromTerminal = (text: string) => text.replaceAll(/("|\/)/g, "")

export const themeParser = (ext: string) => ({
  lua: parseFromLua,
  yaml: parseFromYaml,
  sh: parseFromBash,
}[ext])
