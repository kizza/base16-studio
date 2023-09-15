import { maybeErrored } from '@/lib/api';
import { source } from '@/lib/shell';
import { readThemeFile } from '@/lib/theme';
import { Theme } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { resolveOrWrite } from './read';

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
    .then(({path, scheme}) => {
        source(path)
        res.status(200).json({ scheme: scheme });
      })
}

export default maybeErrored(handler)
