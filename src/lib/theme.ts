import { Scheme, SplattedPalette, Theme } from '@/types';
import fs from 'fs';
import path from 'path';
import { asHexWithHash, isBase, splatPalette } from './colour';
import { getExt, hasExt, pathToSlug, readdirSync } from './file';
import { filterKeys, keys, mapValues } from './functional';
import { themeParser } from './parse';
import { source } from './shell';

const { readFile, writeFile } = fs.promises

export const sluggify = (text: string) => text.trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();

export const themePath = (file: string) => path.join(process.cwd(), 'themes', file);

export const templatePath = (file: string) => path.join(process.cwd(), 'src', 'templates', file);

const asTheme = (dir: string) => (filename: string): Theme => ({
  label: filename.replace(/\.[^.]+$/, ''),
  path: path.join(dir, filename),
  slug: filename.replace(/\.[^.]+$/, ''),
})

export const localThemes = () =>  {
  const dir = path.join(process.cwd(), 'themes')
  return readdirSync(dir)
    .filter(hasExt('sh'))
    .map(asTheme(dir))
    .filter(theme => theme.label != 'template')
}

export const base16schemes = () => {
  const dir = path.join(process.cwd(), 'thirdparty', 'base16-schemes');
  return readdirSync(dir)
    .filter(hasExt('yaml'))
    .map(asTheme(dir))
}
type NewTheme = {name: string, slug: string, scheme: Scheme}
type NewThemeProps = SplattedPalette & {
  'scheme-name': string,
  'scheme-author': string,
  'scheme-slug': string,
}

const cheapMoustache = (template: string, attributes: Record<string, string>) =>
  keys(attributes).reduce(
    (acc, key) => acc.replaceAll(`{{${key}}}`, attributes[key]),
    template
  );

const ENCODING = { encoding: 'utf8' as BufferEncoding }

const writeThemeFile = (template: string, themeProps: Record<string, string>, path: string) =>
  readFile(templatePath(template), ENCODING).then((buffer) =>
    writeFile(themePath(path), cheapMoustache(buffer, themeProps), ENCODING)
      .then(() => `Done writing ${path}`)
  )

export const writeTheme = ({name, slug, scheme}: NewTheme) => {
  console.log(`Writing theme ${slug}`)
  const palette = filterKeys(scheme, isBase)
  const themeProps: NewThemeProps = {
    ...splatPalette(palette),
    'scheme-name': name,
    'scheme-author': scheme.author || process.env.AUTHOR,
    'scheme-slug': slug,
  }
  const themePropsWithHash = {...themeProps, ...splatPalette(mapValues(palette, asHexWithHash))}

  return Promise.allSettled([
    writeThemeFile('base16-shell.mustache', themeProps, `${slug}.sh`),
    writeThemeFile('base16-vim.mustache', themeProps, `vim/${slug}.vim`),
    writeThemeFile('base16-nvim.mustache', themePropsWithHash, `vim/${slug}.nvim`),
  ])
}

export const readThemeFile = (path: string) =>
  readFile(path, ENCODING).then((buffer) => {
    const parser = themeParser(getExt(path))
    const scheme = parser(buffer)
    if (scheme) {
      return {...scheme, slug: pathToSlug(path)}
    } else {
      return Promise.reject('No scheme found')
    }
  });

export const sourceThemeFile = (file: string) => source(themePath(file))
