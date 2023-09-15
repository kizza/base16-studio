import { maybeErrored } from '@/lib/api';
import { clearSettings } from '@/lib/settings';
import type { NextApiRequest, NextApiResponse } from 'next';

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' })
    return
  }

  res.status(200).json(clearSettings());
}

export default maybeErrored(handler)
