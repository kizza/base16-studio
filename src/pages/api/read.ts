import { maybeErrored } from '@/lib/api';
import { hasExt } from '@/lib/file';
import { readThemeFile, themePath, writeTheme } from '@/lib/theme';
import { Scheme, Theme } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Payload {
  theme: Theme
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const payload = JSON.parse(req.body) as Payload
  const theme = payload.theme

  return readThemeFile(theme.path)
    .then(resolveOrWrite(theme))
    .then(({scheme}) => {
      res.status(200).json({ scheme });
    })
}

export const resolveOrWrite = (theme: Theme) => (scheme: Scheme) =>
  hasExt('sh')(theme.path)
    ? {path: theme.path, scheme} // Already sourceable
    :  writeTheme({name: 'Scratch (from parse)', slug: 'new', scheme: scheme})
        .then(_ => ({path: themePath('new.sh'), scheme}))

export default maybeErrored(handler)
