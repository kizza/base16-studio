import { maybeErrored } from '@/lib/api';
import { sluggify, sourceThemeFile, writeTheme } from "@/lib/theme";
import type { NextApiRequest, NextApiResponse } from 'next';
import { Scheme } from '../../types';

interface Payload {
  name: string
  scheme: Scheme
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const {name, scheme} = JSON.parse(req.body) as Payload
  const slug = sluggify(name)
  return writeTheme({name: name, slug: slug, scheme: scheme})
    .then(_ => sourceThemeFile(slug))
    .then(_ => res.status(200).send({}))
}

export default maybeErrored(handler)
