#!/bin/sh
# base16-shell (https://github.com/tinted-theming/base16-shell)
# Scheme name: Scheme name (light - variant)
# Scheme author: Tony O'Grady. Username (http://github.com/asdf)
# Template author: Tinted Theming (https://github.com/tinted-theming)
export BASE16_THEME={{scheme-slug}}

color00="0R/0G/0B" # Base 00 - Black
color01="8R/8G/8B" # Base 08 - Red
color02="BR/BG/BB" # Base 0B - Green
color03="AR/AG/AB" # Base 0A - Yellow
color04="DR/DG/DB" # Base 0D - Blue
color05="ER/EG/EB" # Base 0E - Magenta
color06="CR/CG/CB" # Base 0C - Cyan
color07="5R/5G/5B" # Base 05 - White
color08="3R/3G/3B" # Base 03 - Bright Black
color09=$color01 # Base 08 - Bright Red
color10=$color02 # Base 0B - Bright Green
color11=$color03 # Base 0A - Bright Yellow
color12=$color04 # Base 0D - Bright Blue
color13=$color05 # Base 0E - Bright Magenta
color14=$color06 # Base 0C - Bright Cyan
color15="7R/7G/7B" # Base 07 - Bright White
color16="9R/9G/9B" # Base 09
color17="FR/FG/FB" # Base 0F
color18="1R/1G/1B" # Base 01
color19="2R/2G/2B" # Base 02
color20="4R/4G/4B" # Base 04
color21="6R/6G/6B" # Base 06
color_foreground="5R/5G/5B" # Base 05
color_background="0R/0G/0B" # Base 00

if [ -n "$TMUX" ] || [ "${TERM%%[-.]*}" = tmux ]; then
  # Tell tmux to pass the escape sequences through
  # (Source: http://permalink.gmane.org/gmane.comp.terminal-emulators.tmux.user/1324)
  put_template() { printf '\033Ptmux;\033\033]4;%d;rgb:%s\033\033\\\033\\' $@; }
  put_template_var() { printf '\033Ptmux;\033\033]%d;rgb:%s\033\033\\\033\\' $@; }
  put_template_custom() { printf '\033Ptmux;\033\033]%s%s\033\033\\\033\\' $@; }
elif [ "${TERM%%[-.]*}" = "screen" ]; then
  # GNU screen (screen, screen-256color, screen-256color-bce)
  put_template() { printf '\033P\033]4;%d;rgb:%s\007\033\\' $@; }
  put_template_var() { printf '\033P\033]%d;rgb:%s\007\033\\' $@; }
  put_template_custom() { printf '\033P\033]%s%s\007\033\\' $@; }
elif [ "${TERM%%-*}" = "linux" ]; then
  put_template() { [ $1 -lt 16 ] && printf "\e]P%x%s" $1 $(echo $2 | sed 's/\///g'); }
  put_template_var() { true; }
  put_template_custom() { true; }
else
  put_template() { printf '\033]4;%d;rgb:%s\033\\' $@; }
  put_template_var() { printf '\033]%d;rgb:%s\033\\' $@; }
  put_template_custom() { printf '\033]%s%s\033\\' $@; }
fi

# 16 color space
put_template 0  $color00
put_template 1  $color01
put_template 2  $color02
put_template 3  $color03
put_template 4  $color04
put_template 5  $color05
put_template 6  $color06
put_template 7  $color07
put_template 8  $color08
put_template 9  $color09
put_template 10 $color10
put_template 11 $color11
put_template 12 $color12
put_template 13 $color13
put_template 14 $color14
put_template 15 $color15

# 256 color space
put_template 16 $color16
put_template 17 $color17
put_template 18 $color18
put_template 19 $color19
put_template 20 $color20
put_template 21 $color21

# foreground / background / cursor color
if [ -n "$ITERM_SESSION_ID" ]; then
  # iTerm2 proprietary escape codes
  put_template_custom Pg 555555 # foreground
  put_template_custom Ph 000000 # background
  put_template_custom Pi 555555 # bold color
  put_template_custom Pj 222222 # selection color
  put_template_custom Pk 555555 # selected text color
  put_template_custom Pl 555555 # cursor
  put_template_custom Pm 000000 # cursor text
else
  put_template_var 10 $color_foreground
  if [ "$BASE16_SHELL_SET_BACKGROUND" != false ]; then
    put_template_var 11 $color_background
    if [ "${TERM%%-*}" = "rxvt" ]; then
      put_template_var 708 $color_background # internal border (rxvt)
    fi
  fi
  put_template_custom 12 ";7" # cursor (reverse video)
fi

# clean up
unset -f put_template
unset -f put_template_var
unset -f put_template_custom
unset color00
unset color01
unset color02
unset color03
unset color04
unset color05
unset color06
unset color07
unset color08
unset color09
unset color10
unset color11
unset color12
unset color13
unset color14
unset color15
unset color16
unset color17
unset color18
unset color19
unset color20
unset color21
unset color_foreground
unset color_background

# Optionally export variables
if [ -n "$BASE16_SHELL_ENABLE_VARS" ]; then
  export BASE16_COLOR_00_HEX="{{base00-hex}}"
  export BASE16_COLOR_01_HEX="{{base01-hex}}"
  export BASE16_COLOR_02_HEX="{{base02-hex}}"
  export BASE16_COLOR_03_HEX="{{base03-hex}}"
  export BASE16_COLOR_04_HEX="{{base04-hex}}"
  export BASE16_COLOR_05_HEX="{{base05-hex}}"
  export BASE16_COLOR_06_HEX="{{base06-hex}}"
  export BASE16_COLOR_07_HEX="{{base07-hex}}"
  export BASE16_COLOR_08_HEX="{{base08-hex}}"
  export BASE16_COLOR_09_HEX="{{base09-hex}}"
  export BASE16_COLOR_0A_HEX="{{base0A-hex}}"
  export BASE16_COLOR_0B_HEX="{{base0B-hex}}"
  export BASE16_COLOR_0C_HEX="{{base0C-hex}}"
  export BASE16_COLOR_0D_HEX="{{base0D-hex}}"
  export BASE16_COLOR_0E_HEX="{{base0E-hex}}"
  export BASE16_COLOR_0F_HEX="{{base0F-hex}}"
fi
