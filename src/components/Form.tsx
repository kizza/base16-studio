import { routes } from '@/lib/api';
import { DEFAULT_SCHEME } from '@/lib/colour';
import { mapValues } from '@/lib/functional';
import { Base16, InitialData, Scheme, Theme, ThemeList } from '@/types';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Button, FormControlLabel, IconButton, Toolbar, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import Drawer, { WIDTH as drawerWidth } from "./Drawer";
import Main from './Main';
import Modal, { CLOSED_PROPS as CLOSED_MODAL_PROPS, PropsType as ModalProps } from "./Modal";
import Palette, { FavouriteChangeEvent, IgnoredChangeEvent, PaletteChangeEvent, PropsType as PaletteProps } from "./Palette";
import Switch from './Switch';
import FocusedColour from './FocusedColour';

export default function Form() {
  const [drawerLoading, setDrawerLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [previousDrawerOpen, setPreviousDrawerOpen] = useState(true)
  const [layout, setLayout] = useState<PaletteProps['layout']>('sorted')
  const [modalProps, setModalProps] = useState<ModalProps>(CLOSED_MODAL_PROPS)
  const [scheme, setScheme] = useState<Scheme>(DEFAULT_SCHEME);
  const [schemeDefault, setSchemeDefault] = useState<Scheme>(DEFAULT_SCHEME);
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [showChanges, setShowChanges] = useState<boolean>(true)
  const [themeList, _setThemeList] = useState<ThemeList>({local: [], base16schemes: []})
  const [focusedColour, _setFocusedColour] = useState<keyof Base16>(null)

  const api = routes((props) =>
    setModalProps({...CLOSED_MODAL_PROPS, ...props, open: true, onClose: closeModal})
  )

  const handleInitialData = (data: InitialData) => {
    setThemeList({local: data.local, base16schemes: data.base16schemes})
    return data;
  }

  useEffect(() => {
    showDrawerAsLoading().then(api.loadThemeList).then(handleInitialData)
      .then((initialData) => {
        const firstTheme = initialData.local.concat(initialData.base16schemes)[0]
        if (firstTheme) {
          api.readTheme(firstTheme).then(scheme => {
            if (scheme) {
              setSelectedTheme(firstTheme) // Just internal list selected item
              setScheme(scheme)
              setSchemeDefault(scheme)
            }
          })
        }
      })
  }, [])

  const setThemeList = (themeList: ThemeList) => {
    setDrawerLoading(false)
    _setThemeList(themeList)
  }

  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  const setFavourite = (event: FavouriteChangeEvent) => {
    api.setFavourite(event);
    updateThemeListMeta(event.scheme.slug, 'favourite', event.favourite)
  }

  const lookupPreviousTheme = (scheme: Scheme) => {
    const notIgnoredThemes = themeList.base16schemes.filter(each => each.ignored == false)
    const index = notIgnoredThemes.findIndex(each => each.slug == scheme.slug)
    return notIgnoredThemes[index - 1] || scheme
  }

  const setIgnored = (event: IgnoredChangeEvent) => {
    api.setIgnored(event);
    updateThemeListMeta(event.scheme.slug, 'ignored', event.ignored)
    if (event.ignored == true) { // Don't jump to the ignored list (stay in place)
      const nextSelected = lookupPreviousTheme(event.scheme)
      setSelectedTheme(nextSelected);
    }
  }

  const updateThemeListMeta = (slug: string, attribute: keyof Theme, checked: boolean) => {
    const updateAttribute = (theme: Theme) => ({...theme, [attribute]: checked})
    const ifSlugMatches = (fn: (theme: Theme) => Theme) => (theme: Theme) => theme.slug === slug ? fn(theme) : theme
    setThemeList(mapValues(themeList, list => list.map(ifSlugMatches(updateAttribute))))
    setSelectedTheme(updateAttribute(selectedTheme))
  }

  const toggleSort = (event: ChangeEvent<HTMLInputElement>) => {
    setLayout(event.target.checked ? 'sorted' : 'default')
  }

  const toggleShowChanges = (event: ChangeEvent<HTMLInputElement>) => {
    setShowChanges(event.target.checked)
    api.paintPalette(event.target.checked ? scheme : schemeDefault)
  }

  const resetPalette = () => {
    setScheme(schemeDefault)
    api.paintPalette(schemeDefault)
  }

  const showDrawerAsLoading = () => Promise.resolve(setDrawerLoading(true))

  const setFocusedColour = (key: keyof Base16) => {
    setPreviousDrawerOpen(drawerOpen)
    _setFocusedColour(key)
    setDrawerOpen(false)
  }

  const closeFocusedColour = () => {
    _setFocusedColour(null)
    setDrawerOpen(previousDrawerOpen)
  }

  const saveTheme = () => {
    getInput({
      title: "Save new theme as...",
      input: {label: "Theme name", placeholder: scheme.name},
      action: "Save",
    }).then(name => {
      api.addTheme(name, scheme).then(() => {
        showDrawerAsLoading().then(api.loadThemeList).then(handleInitialData)
      })
    })
  }

  const selectTheme = (theme: Theme) => {
    setSelectedTheme(theme) // Just internal list selected item
    api.paintTheme(theme).then(scheme => {
      if (scheme) {
        setScheme(scheme)
        setSchemeDefault(scheme)
      }
    })
  }

  const handlePaletteChange = (event: PaletteChangeEvent) => {
    setScheme(event.scheme)
    if (showChanges) api.paintPalette(event.scheme)
  }

  const confirmDownloadThemes = () => {
    getInput({
      title: 'Download base16-schemes from github?',
      description: 'This will clone the \'base16-schemes\' repository from the tinted-theming github repository.',
      input: 'boolean',
      action: "Download",
    }).then(refreshThemes)
  }

  const refreshThemes = () => showDrawerAsLoading().then(api.downloadThemes).then(handleInitialData)

  const closeModal = () =>  setModalProps(CLOSED_MODAL_PROPS)

  const getInput = (props: Partial<ModalProps>): Promise<string> => new Promise(resolve =>
    setModalProps({
      ...CLOSED_MODAL_PROPS,
      ...props,
      open: true,
      onClose: (input?: string) => {
        closeModal()
        input && resolve(input)
      }
    })
  )

  return (
    <>
      <AppBar position="fixed" color="secondary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton onClick={toggleDrawer} size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
            <MenuIcon color="primary"/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>Base16 Studio</Typography>
          <div className="space-x-4">
            {false && <FormControlLabel control={<Switch onChange={toggleSort} />} checked={layout=='sorted'} label="Sort" labelPlacement="start" />}
            <FormControlLabel control={<Switch onChange={toggleShowChanges} defaultChecked />} label="Show changes" labelPlacement="start" />
            <Button variant="outlined" color="primary" onClick={resetPalette}>Reset</Button>
            <Button variant="contained" onClick={saveTheme}>Save</Button>
          </div>
        </Toolbar>
      </AppBar>

      <Modal {...modalProps} />

      <div className="flex h-full">
        <Drawer open={drawerOpen}
          loading={drawerLoading}
          onSelect={selectTheme}
          onDownloadThemes={confirmDownloadThemes}
          onRefreshThemes={refreshThemes}
          selectedTheme={selectedTheme}
          themeList={themeList}
          width={drawerWidth} />

        <Main open={drawerOpen} drawerWidth={drawerWidth} className='h-full'>
          <Toolbar />
          {focusedColour && <FocusedColour
            paletteKey={focusedColour}
            scheme={scheme}
            onChange={handlePaletteChange}
            onClose={closeFocusedColour}
          />}
          {!focusedColour && selectedTheme && <Palette
            selectedTheme={selectedTheme}
            scheme={scheme}
            layout={layout}
            onChange={handlePaletteChange}
            onSetFavourite={setFavourite}
            onSetIgnored={setIgnored}
            onFocusColour={setFocusedColour}
          />}
        </Main>
      </div>
    </>
  )
}
