import { maybeErrored } from '@/lib/api';
import { sourceThemeFile, writeTheme } from "@/lib/theme";
import { Scheme } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Payload {
  scheme: Scheme
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const payload = JSON.parse(req.body) as Payload

  return writeTheme({name: 'Scratch', slug: 'new', scheme: payload.scheme})
    .then(_ => sourceThemeFile('new.sh'))
    .then(_ => res.status(200).send({}))
}

export default maybeErrored(handler)
