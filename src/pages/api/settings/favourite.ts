import { FavouriteChangeEvent } from '@/components/Palette';
import { maybeErrored } from '@/lib/api';
import { addFavourite, removeFavourite } from '@/lib/settings';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Payload extends FavouriteChangeEvent {}

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only GET requests allowed' })
    return
  }

  const {favourite, scheme} = JSON.parse(req.body) as Payload
  const updateFavourite = favourite ? addFavourite : removeFavourite;

  res.status(200).json(updateFavourite(scheme));
}

export default maybeErrored(handler)
