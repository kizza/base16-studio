import _ from "lodash";
import { Base16, Hex, HexWithHash, Palette, RGB, WithHexSuffix, WithRGB } from "../types";
import { keys } from "./functional";

export const asHexWithHash = (colour: string): HexWithHash => `#${colour.replace('#', '')}`;
export const asHex = (colour: string): Hex => colour.replace('#', '');
export const asTerminal = (colour: string) => colour.replace("#", "").match(/.{1,2}/g)!.join("/");

export const DEFAULT_COLOURS = {
  base00: "383838", base01: "404040", base02: "606060", base03: "6f6f6f",
  base04: "808080", base05: "dcdccc", base06: "c0c0c0", base07: "ffffff",
  base08: "dca3a3", base09: "dfaf8f", base0A: "e0cf9f", base0B: "5f7f5f",
  base0C: "93e0e3", base0D: "7cb8bb", base0E: "dc8cc3", base0F: "000000",
}

export const isBase = (key: string) => DEFAULT_COLOURS[key] !== undefined

export const DEFAULT_SCHEME = {name: "", author: "", slug: "", ...DEFAULT_COLOURS}

export const CONTEXT: Record<Base16, {label: string, description: string}> = {
  base00: {label: "Background", description: ""},
  base01: {label: "Lighter background", description: "Current line and gutter"},
  // Backgrounds
  base06: {label: "Lighter foreground", description: "Editor text"},
  base02: {label: "Selection", description: "Selection and tab bar"},
  base03: {label: "Bright black", description: "Line numbers"},
  base04: {label: "Darker forground", description: "Darker accents (comments, file type)"},
  base05: {label: "Foreground", description: "Primary text"},
  // Accents
  base07: {label: "Bright white", description: ""},
  base09: {label: "Accent", description: "Punctuation. Integers, boolean, constants"},
  // Colours
  base08: {label: "Red", description: ""},
  base0A: {label: "Yellow", description: ""},
  base0B: {label: "Green", description: ""},
  base0C: {label: "Cyan", description: ""},
  base0D: {label: "Blue", description: ""},
  base0E: {label: "Magenta", description: ""},
  base0F: {label: "Keywords", description: "Keywords (function and return)"},
}

const withHexSuffix = <T extends Record<string, string>>(palette: T): WithHexSuffix<T> =>
  keys(palette).reduce((acc, key) => ({...acc, [`${String(key)}-hex`]: palette[key]}), {} as T)

export const withExpandedHexPortions = <T extends Record<string, string>>(palette: T): WithRGB<T> => {
  const splat = _.chain(palette)
    .mapValues(asHex)
    .mapValues(hex => Array.from(hex.match(/.{2}/g) || []))
    .mapValues(hexTuples => _.zip(['r', 'g', 'b'], hexTuples))
    .mapValues(hexTuples => hexTuples.reduce((acc, [hexKey, hexTuple]) => ({...acc, [hexKey]: hexTuple}), {}))
    .value() as Record<keyof T, RGB>

  return keys(splat).reduce((acc, key) => (
    {...acc,
      [`${String(key)}-r`]: splat[key].r,
      [`${String(key)}-g`]: splat[key].g,
      [`${String(key)}-b`]: splat[key].b,
    }
  ), {} as T)
}

export const splatPalette = (palette: Palette) => ({
  ...withHexSuffix(palette),
  ...withExpandedHexPortions(withHexSuffix(palette)),
})
