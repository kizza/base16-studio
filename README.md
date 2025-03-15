# Base16-studio

#### Preview, discover and tweak base16 themes joyfully #####
With live updates in your terminal, and color dials at your fingertips!

![Base16 Studio](https://github.com/kizza/base16-studio/assets/1088717/15be6316-15f3-4645-aacc-7675c86c8b9b)

I love the amazing themes created by the community and use a variety of their plugins to achieve a consistent theme across my tooling 🙏
I must confess however, I sometimes feel the need to just _tweak one of two_ subtle shades depending on my setup - I know, I have a problem - but I find this is a great solution (and it's fun!).

- **Tweak and save your favourite themes** - or just play and see what you come up with
- **Search and narrow your themes** easily (supports regex also)
- **Curate your themes** by _favouriting_ or _ignoring_ (there's a lot these days!)
- **Edit with granularity** - click on a color name to _zoom in_ and edit with precision
- **Toggle "show changes"** to go back-and-forth between your intended changes and the original
- **"Reset" your changes** back to the original (and try again!)

### Behind the scenes
- 🎨 Themes pulled (and refreshed) from tinted-themes [base16-schemes](https://github.com/tinted-theming/base16-schemes)
- 🚀 Runs locally via [nextjs](https://nextjs.org/)
- 💅 Colors tweaked via [react-colorful](https://omgovich.github.io/react-colorful/)
- 🛠️ Builds (hydrates) themes for [base16-shell, base16-nvim and base16-vim](https://github.com/kizza/base16-studio/tree/main/src/templates)

### How to run it

This is ultimately just a [nextjs](https://nextjs.org/) app - so you can boot it locally via...
```bash
yarn && yarn dev
```

A browser should open at `http://localhost:8080/`.  Click "download" in the left panel to clone and navigate the base16 schemes locally 👌

### Requirements

- Requires [tmux](https://github.com/tmux/tmux/wiki) to source color previews within terminal (uses `tmux new-window "source ${path}"` to achieve new color palette seamlessly)
