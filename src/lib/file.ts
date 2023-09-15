import path from 'path';
import fs from 'fs'

export const getExt = (file: string) =>
  path.extname(file).toLowerCase().replace('.', '')

export const hasExt = (ext: string) => (file: string) => getExt(file) == ext

export const pathToSlug = (filePath: string) => path.basename(filePath).replace(/\.[^.]+$/, '')

export const readdirSync = (dir: string) => {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
}
