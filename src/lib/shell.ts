import { Theme } from "@/types";

export const source = (slug: Theme['slug'], path: string) => {
  console.log(`Sourcing ${slug} from '${path}'`);
  const symlinkTheme = symlink(path, process.env.BASE16_SHELL_COLORSCHEME_PATH);
  const persistThemeName = `echo "${slug}" >| "${process.env.BASE16_SHELL_THEME_NAME_PATH}";`;
  execute(`tmux new-window "source ${path}"; ${symlinkTheme} ${persistThemeName}`);
}

export const symlink = (origin: string, destination: string) => {
  return `ln -fs "${origin}" "${destination}" >/dev/null;`;
}

export const execute = (command: string) => {
  const execSync = require('child_process').execSync;
  return execSync(command, {stdio: [0, 1, 2], encoding: 'utf-8' });
}
