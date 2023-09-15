import { execute } from "@/lib/shell";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { themeList } from "./index";
import { maybeErrored } from "@/lib/api";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  res.status(200).json(themeList());
}

export default maybeErrored(handler)
