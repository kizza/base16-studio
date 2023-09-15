import { Base16, Scheme } from '@/types';
import { Button, TextField, Typography } from '@mui/material';
import { HexColorPicker } from 'react-colorful';
import { PaletteChangeEvent } from './Palette';
import { AnyColor } from 'react-colorful/dist/types';
import { CONTEXT, asHex } from '@/lib/colour';
import { ChangeEvent } from 'react';
import CloseIcon from '@mui/icons-material/Clear';

export interface PropsType {
  paletteKey: keyof Base16
  scheme: Scheme
  onChange?: (event: PaletteChangeEvent) => void
  onClose: (value?: string) => void
}

export default function FocusedColour(props: PropsType) {
  const {paletteKey: key, scheme, onClose} = props

  const changePaletteColour = (name: keyof Base16) => (colour: AnyColor) => {
    const newScheme = {...scheme, [name]: asHex(colour.toString())}
    props.onChange({scheme: newScheme})
  }

  return (
    <div className='flex flex-col p-6 space-y-2 w-full h-full pb-24' style={{backgroundColor: scheme[key]}}>
      <div className='flex items-center w-full space-x-4'>
        <div className='flex space-x-3 items-end flex-grow'>
          <Typography key='title' variant='h5' component='h2'>
            {CONTEXT[key].label}
          </Typography>
          <p className='m-0 text-lg uppercase font-medium text-gray-500'>{`Base ${(key as string).replace('base', '')}`}</p>
        </div>
        <Button size="large" endIcon={<CloseIcon />}
          onClick={() => onClose()}>Close
        </Button>
      </div>
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
  )
}
