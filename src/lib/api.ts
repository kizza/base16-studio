import { PropsType as ModalProps } from '@/components/Modal';
import { FavouriteChangeEvent, IgnoredChangeEvent } from '@/components/Palette';
import { InitialData, Scheme, Theme, ThemeList } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type Handler = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>

export const maybeErrored = ((handler: Handler): Handler =>
  (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return handler(req, res)
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }
)

export type MessageHandler = (params: Partial<ModalProps>) => void

export const handleApiResponse = (onMessage: MessageHandler) => (response: Response) => new Promise<any>(resolve => {
  response.json().then(payload => {
    if (response.status > 200 || payload.message) {
      onMessage({
        title: payload.title || `Hmmmm ${response.status}`,
        description: payload.message || 'Unknown error',
      })
    } else {
      resolve(payload)
    }
  })
})

export const routes = (onApiMessage: MessageHandler) => {
  const parseResponse = handleApiResponse(onApiMessage)

  const loadThemeList = (): Promise<InitialData> =>
    fetch("/api/list", {method: "get"}).then(parseResponse)

  const downloadThemes = () =>
    fetch("/api/list/download", {method: "get"}).then(parseResponse)

  const addTheme = (name: string, scheme: Scheme) =>
    fetch("/api/add", {body: JSON.stringify({name, scheme}), method: "post"})
      .then(parseResponse)

  const paintPalette = (scheme: Scheme) =>
    fetch("/api/build", {body: JSON.stringify({scheme: scheme}), method: "post"}).then(parseResponse)

  const readTheme = (theme: Theme) =>
    fetch("/api/read", {body: JSON.stringify({theme}), method: "post"})
      .then(parseResponse)
      .then(payload => payload.scheme)

  const paintTheme = (theme: Theme): Promise<Scheme> =>
    fetch("/api/apply", {body: JSON.stringify({theme}), method: "post"})
      .then(parseResponse)
      .then(payload => payload.scheme)

  // Settings

  const setFavourite = ({favourite, scheme}: FavouriteChangeEvent): Promise<ThemeList> =>
    fetch("/api/settings/favourite", {body: JSON.stringify({scheme, favourite}), method: "post"}).then(parseResponse)

  const setIgnored = ({ignored, scheme}: IgnoredChangeEvent): Promise<ThemeList> =>
    fetch("/api/settings/ignored", {body: JSON.stringify({scheme, ignored}), method: "post"}).then(parseResponse)

  return {
    loadThemeList,
    downloadThemes,
    paintPalette,
    readTheme,
    paintTheme,
    addTheme,
    setFavourite,
    setIgnored,
  }
}
