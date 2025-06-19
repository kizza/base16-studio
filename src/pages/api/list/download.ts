import { maybeErrored } from "@/lib/api";
import { execute } from "@/lib/shell";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { initialData } from "./index";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' })
    return
  }

  const repo = 'https://github.com/tinted-theming/schemes'
  const dest = path.join(process.cwd(), 'thirdparty', 'schemes');
  if (fs.existsSync(path.join(dest, '.git'))) {
    execute(`git --git-dir=${dest}/.git --work-tree=${dest} pull`)
  } else {
    execute(`git clone --depth=1 ${repo} ${dest}`)
  }

  res.status(200).json(initialData());
}

export default maybeErrored(handler)
