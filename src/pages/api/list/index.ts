import { maybeErrored } from "@/lib/api";
import { getSettings } from "@/lib/settings";
import { base16schemes, localThemes } from "@/lib/theme";
import { InitialData, Settings, Theme } from "@/types";
import type { NextApiRequest, NextApiResponse } from 'next';

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' })
    return
  }

  res.status(200).json(initialData());
}

export const initialData = (): InitialData => {
  const settings = getSettings();
  return {
    local: localThemes().map(withSettings(settings)),
    base16schemes: base16schemes().map(withSettings(settings)),
    settings: settings,
  }
}

const withSettings = ({favourites, ignored}: Settings) => (theme: Theme): Theme => ({
  ...theme,
  favourite: favourites.includes(theme.label),
  ignored: ignored.includes(theme.label),
})

export default maybeErrored(handler)
