import { mapValues } from '@/lib/functional';
import { Theme, ThemeList } from '@/types';
import CancelIcon from "@mui/icons-material/Clear";
import ThemesIcon from '@mui/icons-material/ColorLens';
import DownloadIcon from '@mui/icons-material/Download';
import ScratchIcon from '@mui/icons-material/EditNote';
import IgnoreIcon from '@mui/icons-material/FilterAltOff';
import LocalIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from "@mui/icons-material/Search";
import FavouriteIcon from '@mui/icons-material/Star';
import { Box, CircularProgress, Divider, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Drawer as MuiDrawer, TextField, Toolbar, Tooltip } from '@mui/material';
import { useState } from 'react';
import ListSubheaderButton from './ListSubheaderButton';

export const WIDTH = 320

export interface PropsType {
  onSelect: (theme: Theme) => void
  onDownloadThemes: () => void
  onRefreshThemes: () => void
  loading: boolean
  open: boolean
  selectedTheme: Theme | null
  themeList: ThemeList
  width: number
}

interface ListProps {
  icon?: JSX.Element
  label: string
  list: Theme[]
  subheader?: JSX.Element
  button?: JSX.Element
  emptyState?: string
}

export default function Drawer(props: PropsType) {
  const { onSelect, onDownloadThemes, onRefreshThemes, loading, open, selectedTheme, themeList, width } = props;
  const handleSelect = (theme: Theme) => onSelect && onSelect(theme)
  const isSelected = (theme: Theme) => theme.path === selectedTheme?.path
  const scratchTheme = themeList.local.find(theme => theme.label == 'new')

  const [filter, setFilter] = useState("")
  const filterRegex = new RegExp(filter)
  const filtered = (themes: Theme[]) => themes.filter(theme => filter === '' || filterRegex.test(theme.label))
  const filteredThemeList = mapValues(themeList, filtered)

  const list = ({label, list, subheader, button, icon, emptyState}: ListProps) => {
    return <List subheader={
      subheader || <ListSubheader color="primary" component="div" className="flex items-align pr-0">
        <ListItemIcon sx={{minWidth: 32, alignItems: 'center'}}>{icon}</ListItemIcon>
        <div className='flex space-x-1'>
          <div className='font-bold'>{label}</div>
          {list.length > 0 && <div className="text-gray-500">({list.length})</div>}
        </div>
        {button}
      </ListSubheader>
    }>
      {list.map(theme => (
        <ListItem key={theme.label} disablePadding>
          <ListItemButton autoFocus={filter === '' && isSelected(theme)} onClick={() => handleSelect(theme)} selected={isSelected(theme)}>
            <ListItemText primary={theme.label} />
          </ListItemButton>
        </ListItem>
      ))}
      {emptyState && list.length === 0 &&
        <p className="text-gray-500 text-sm italic m-0 px-4 py-2">
          {filter ? '...' : emptyState}
        </p>}
    </List>
  }

  const sortThemes = (a: Theme, b: Theme) => {
    const x = a.slug.toLowerCase();
    const y = b.slug.toLowerCase();
    if(x>y){return 1;}
    if(x<y){return -1;}
    return 0;
  };

  const allThemes = filteredThemeList.local.concat(filteredThemeList.base16schemes).sort(sortThemes)
  const favouriteThemes = allThemes.filter(theme => theme.favourite === true)
  const localThemes = filteredThemeList.local.filter(theme => theme.favourite === false)
  const base16list = filteredThemeList.base16schemes.filter(theme => theme.favourite === false && theme.ignored === false)
  const ignoredList = filteredThemeList.base16schemes.filter(theme => theme.ignored === true)

  const lists = () => (
    <Box role="presentation">
      <List>
        <div className="p-1 pt-2">
          <TextField
            fullWidth
            label='Filter'
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (<InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>),
              endAdornment: filter && (<IconButton onClick={() => setFilter("")}><CancelIcon/></IconButton>)
            }}
          />
        </div>
        {false && scratchTheme && (
          <Tooltip title="All edits and changes" placement="right">
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleSelect(scratchTheme)} selected={isSelected(scratchTheme)}>
                <ListItemText primary="Scratch" />
                <ListItemIcon sx={{minWidth: 32}}>
                  <ScratchIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
        )}
      </List>
      <Divider />
      {favouriteThemes.length > 0 && list({
        label: 'Favourites',
        list: favouriteThemes,
        icon : <FavouriteIcon color="primary" />,
        emptyState: 'No favourites yet',
      })}
      <Divider />
      {localThemes.length > 0 && list({
        label: 'Local schemes',
        list: localThemes.filter(theme=> theme.label !== 'new'),
        icon : <LocalIcon color="primary" />,
        emptyState: 'Created themes will appear here',
      })}
      <Divider />
      {(base16list.length > 0 || filter == '') && list({
        label: 'Base16-schemes',
        list: base16list,
        icon : <ThemesIcon color="primary" />,
        button: themeList.base16schemes.length === 0
            ? <ListSubheaderButton label="Download" icon={<DownloadIcon />} onClick={onDownloadThemes} />
            : <ListSubheaderButton label="Refresh" icon={<RefreshIcon />} onClick={onRefreshThemes} />,
        emptyState: 'Click above to download base16 schemes',
      })}
      <Divider />
      {ignoredList.length > 0 && list({
        label: 'Ignored',
        list: ignoredList,
        icon : <IgnoreIcon color="primary" />,
        emptyState: 'No ignored schemes',
      })}
      {allThemes.length == 0 && <p className='p-2 px-4 text-md'>None found</p>}
    </Box>
  );

  return (
    <MuiDrawer
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
        },
      }}
      anchor="left"
      open={open}
      variant="persistent"
    >
      <Toolbar />
      <div className="overflow-auto h-full">{
        loading
          ? <div className="flex h-full justify-center items-center"><CircularProgress /></div>
          : lists()
      }</div>
    </MuiDrawer>
  );
}
