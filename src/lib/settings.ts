import { Scheme, Settings } from "@/types";
import Conf from 'conf';
import { base16schemes } from "./theme";

export const IGNORED = ['3024', 'apathy', 'apprentice', 'bespin', 'black-metal', 'blueforest', 'blueish', 'brewer', 'bright', 'brogrammer', 'brushtrees', 'chalk', 'circus', 'colors', 'cupertino', 'da-one', 'darcula', 'darkviolet', 'dirtysea', 'edge-', 'embers', 'emil', 'equilibrium-', 'eva', 'evenok-dark', 'flat', 'framer', 'fruit-soda', 'github', 'greyscale-', 'harmonic16', 'heetch', 'icy', 'isotope', 'kanagawa', 'katy', 'kimber', 'lime', 'macintosh', 'marrakesh', 'material-', 'mellow-purple', 'nebula', 'nova', 'outrun-', 'papercolor-', 'pasque', 'pico', 'pinky', 'pop', 'primary-', 'primer-', 'purpledream', 'qualia', 'railscasts', 'rebecca', 'shades-of-purple', 'shadesmear-', 'shapeshifter', 'solarflare', 'spacemacs', 'still-alive', 'summercamp', 'summerfruit-', 'synth-midnight', 'tango', 'tube', 'unikitty-', 'vice', 'windows-', 'xcode-dusk', 'zen']

const defaultIgnored = () =>
  base16schemes().filter(
    theme => IGNORED.some((prefix: string) => theme.slug.startsWith(prefix))
  )

const defaultSettings: Settings = {
  favourites: [],
  ignored: defaultIgnored().map(theme => theme.slug),
  path: "",
}

const withStore = <T>(fn: (store: Conf) => T) => fn(new Conf({projectName: 'base16-studio'}));

export const getSettings = () => withStore<Settings>(store => ({
  ...defaultSettings,
  ...store.store,
  path: store.path,
}))

export const clearSettings = () => withStore<Settings>(store => {
  store.store = defaultSettings as Record<string, any>
  return getSettings()
})

type Mutation<T> = (attribute: T) => T

const mutateSetting = <T extends keyof Settings>(
  key: T, mutation: Mutation<Settings[typeof key]>,
) => {
  const existing = getSettings();
  const newValue = mutation(existing[key])
  return withStore<Settings>(store => {
    store.set(key, newValue)
    return {...existing, favourite: newValue}
  })
}

export const addFavourite = (scheme: Scheme) =>
  mutateSetting('favourites', existingFavourites => [...existingFavourites, scheme.slug])

export const removeFavourite = (scheme: Scheme) =>
  mutateSetting('favourites', existingFavourites => existingFavourites.filter(name => name !== scheme.slug))

export const addIgnored = (scheme: Scheme) =>
  mutateSetting('ignored', existingIgnored => [...existingIgnored, scheme.slug])

export const removeIgnored = (scheme: Scheme) =>
  mutateSetting('ignored', existingIgnored => existingIgnored.filter(name => name !== scheme.slug))

