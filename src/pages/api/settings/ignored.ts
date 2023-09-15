import { IgnoredChangeEvent } from '@/components/Palette';
import { maybeErrored } from '@/lib/api';
import { addIgnored, removeIgnored } from '@/lib/settings';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Payload extends IgnoredChangeEvent {}

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only GET requests allowed' })
    return
  }

  const {ignored, scheme} = JSON.parse(req.body) as Payload
  const updateIgnored = ignored ? addIgnored : removeIgnored;

  res.status(200).json(updateIgnored(scheme));
}

export default maybeErrored(handler)
