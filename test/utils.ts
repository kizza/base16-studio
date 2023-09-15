import fs from 'fs'
import path from 'path'

export const loadFixture = (filepath: string) =>
  fs.promises.readFile(path.join(__dirname, 'fixtures', filepath))
