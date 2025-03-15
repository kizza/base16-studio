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
  const slug = 'new';

  return writeTheme({name: 'Scratch', slug: slug, scheme: payload.scheme})
    .then(_ => sourceThemeFile(slug))
    .then(_ => res.status(200).send({}))
}

export default maybeErrored(handler)
