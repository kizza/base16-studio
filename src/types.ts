import { DEFAULT_COLOURS } from "./lib/colour"

export interface ApiResponse {
  message?: string
}

export interface Settings {
  favourites: Theme['label'][]
  ignored: Theme['label'][]
  path: string
}

export interface Theme {
  label: string,
  path: string,
  slug: string,
  favourite?: boolean,
  ignored?: boolean,
}

export interface InitialData {
  local: Theme[]
  base16schemes: Theme[]
  settings: Settings
}

export interface ThemeList {
  local: Theme[]
  base16schemes: Theme[]
  // ignored: Theme[]
}

// Colours primatives
export type Base16 = keyof typeof DEFAULT_COLOURS
export type Hex = string
export type HexWithHash = string
export type RGB = {r: string, g: string, b:string}

// Base16 template
export type Palette = Record<Base16, Hex>
export type Scheme = Palette & {name: string, author: string, slug: string}

export const paletteHasContext = (palette: Palette | Scheme): palette is Scheme =>
  typeof (palette as any).name !== undefined

// Mapped base16 template keys appending `-hex`
export type WithHexSuffix<T> = { [P in keyof T as `${ string & P}-hex`]: Hex }

// Mapped base16 template keys appending `-r`, `-g` and `-b`
export type WithRGB<T> = { [P in keyof T as `${ string & P}-${keyof RGB}`]: Hex }

// Fully splatted colour variables base00-hex, base00-hex-r, base00-hex-g ...
export type SplattedPalette = Record<keyof WithHexSuffix<Palette> | keyof WithRGB<WithHexSuffix<Palette>>, Hex>
