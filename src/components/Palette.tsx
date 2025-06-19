import { CONTEXT, asHex } from '@/lib/colour';
import { switchStyles } from '@/pages';
import { Base16, Scheme, Theme } from '@/types';
import StarSolid from '@mui/icons-material/Star';
import { Button, FormControlLabel, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import { HexColorPicker } from 'react-colorful';
import { AnyColor } from 'react-colorful/dist/types';
import { keys } from '../lib/functional';
import FadeBox from './FadeBox';
import Switch from './Switch';

export interface PropsType {
  selectedTheme: Theme
  layout: 'default' | 'sorted'
  scheme: Scheme,
  onChange?: (event: PaletteChangeEvent) => void
  onSetFavourite?: (event: FavouriteChangeEvent) => void
  onSetIgnored?: (event: IgnoredChangeEvent) => void
  onFocusColour: (key: keyof Base16) => void
}

export interface PaletteChangeEvent {scheme: Scheme}
export interface FavouriteChangeEvent {scheme: Scheme, favourite: boolean}
export interface IgnoredChangeEvent {scheme: Scheme, ignored: boolean}
export interface FocusColourEvent {key: string}

function Palette(props: PropsType) {
  const { scheme, selectedTheme, layout, onFocusColour } = props

  const changePaletteColour = (name: string) => (colour: AnyColor) => {
    const newScheme = {...scheme, [name]: asHex(colour.toString())}
    props.onChange({scheme: newScheme})
  }

  const ignorable = selectedTheme && selectedTheme.path.indexOf('thirdparty') !== -1

  let order = keys(CONTEXT) as any as (string & keyof Base16)[]
  if (layout == 'sorted') {
    order.sort()
  }

  const Colour = ({paletteKey: key}: {paletteKey: string & keyof Base16}) => (
    <Paper className='m-1.5 p-2 shadow-sm space-y-1'>
      <div className='flex items-center mx-1 space-x-1'>
        <Button variant="text" size="small" className="w-full text-sm text-left m-0 block normal-case"
          onClick={() => onFocusColour(key)}>{CONTEXT[key].label}
        </Button>
        <p className='m-0 text-sm uppercase font-medium text-gray-400'>{key.replace('base', '')}</p>
      </div>
      <Tooltip
        title={CONTEXT[key].description}
        PopperProps={{modifiers: [{name: 'offset', options: {offset: [0, -30]}, }]}}
      >
        <div className='flex flex-col space-y-2 h-52' style={{backgroundColor: scheme[key]}}>
          <HexColorPicker className="" color={scheme[key]} onChange={changePaletteColour(key)} />
          <TextField
            variant='outlined'
            value={scheme[key]}
            size='small'
            fullWidth
            sx={{accentColor: scheme[key], '& .MuiInputBase-root': {backgroundColor: 'white'}}}
            onChange={(event: ChangeEvent<HTMLInputElement>) => changePaletteColour(key)(event.target.value)}
          />
        </div>
      </Tooltip>
    </Paper>
  )

  const iconSwitchStyles = {
    marginBottom: '-4px',
    '& .MuiButtonBase-root, & .MuiSvgIcon-root': {
      width: '34px',
      height: '34px',
    },
    '& .MuiSvgIcon-root': {
      filter: 'drop-shadow(1px 1px 2px rgb(0 0 0 / 0.4));'
    },
  }

  const Attribution = () =>
    scheme.name &&
      <div className='flex items-end overflow-hidden p-6 space-x-2 bg-white'>
        {scheme.name && <Typography key='title' variant='h5' component='h2' className='whitespace-nowrap'>
          {scheme.name}
        </Typography>}
        {scheme.author && <Typography key='author' variant='subtitle1' component='p' className='text-gray-500 whitespace-nowrap truncate'>
          by {scheme.author}
        </Typography>}
        <div className='flex flex-grow justify-end'>
          {ignorable && !selectedTheme.favourite &&
            <FormControlLabel
              sx={{ marginBottom: '-4px' }}
              control={<Switch
                checked={selectedTheme.ignored}
                onChange={(event: ChangeEvent<HTMLInputElement>) => props.onSetIgnored(
                  {ignored: event.target.checked, scheme}
                )} />}
              label={<Typography className='text-sm'>Ignore</Typography>}
              labelPlacement="start"
            />}
          {!selectedTheme.ignored && <FormControlLabel
            sx={iconSwitchStyles}
            control={<Switch
              checked={selectedTheme.favourite}
              onChange={(event: ChangeEvent<HTMLInputElement>) => props.onSetFavourite(
                {favourite: event.target.checked, scheme}
              )}
              icon=<StarSolid sx={{...switchStyles.off}}/>
              checkedIcon=<StarSolid color="primary" />
              />}
            label={<Typography className='text-sm'>Favourite</Typography>}
            labelPlacement="start"
          />}
        </div>
      </div>

  return <div className='flex flex-col h-full'>
    <Attribution />
    <div className='grid grid-flow-col justify-stretch h-10'>
      {order.map(key => <div key={`block-${key}`} style={{ background: `#${scheme[key]}`}}>&nbsp;</div>)}
    </div>
    <FadeBox className='flex flex-wrap px-3 py-6 h-full flex-grow overflow-auto'>
      {order.map(key => <Colour key={`colour-${key}`} paletteKey={key} /> )}
    </FadeBox>
  </div>
}

export default Palette
