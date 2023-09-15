export const source = (path: string) => {
  console.log(`Sourcing '${path}'`);
  execute(`tmux new-window "source ${path}"; ln -fs ${path} ~/.base16_theme`);
}

export const execute = (command: string) => {
  const execSync = require('child_process').execSync;
  return execSync(command, {stdio: [0, 1, 2], encoding: 'utf-8' });
}
