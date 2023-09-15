import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { KeyboardEvent, useEffect, useState } from 'react';

export const CLOSED_PROPS: PropsType = {
  open: false,
  title: '',
  description: '',
  action: 'OK',
  onClose: ()=>{},
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #eee',
  boxShadow: 24,
  p: 3,
};

export type Callback = (input: string) => void

type InputParams = 'boolean' | InputField

interface InputField {
  label: string,
  placeholder?: string,
  multiline?: boolean,
}

export interface PropsType {
  open: boolean
  title: string
  description: string
  action: string
  onClose: (value?: string) => void
  input?: InputParams
}

export default function InputModal(props: PropsType) {
  const {action, description, onClose, open, title, input: inputParams} = props
  const [input, setInput] = useState<string>("");

  const clearingInput = (fn: Function) => {
    fn()
    setInput("")
  }

  const inputIsField = (inputParams: InputParams): inputParams is InputField =>
    typeof inputParams === "object"

  // Set input placeholder in state
  useEffect(() => {
    if (inputIsField(inputParams)) setInput(inputParams.placeholder)
  }, [inputParams])

  const field = inputIsField(inputParams) ? inputParams : false

  const response = () => inputIsField(inputParams) ? input : "ok"
  const cancel = () => clearingInput(() => onClose())
  const ok = () => clearingInput(() => onClose(response()))
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key == 'Enter') {
      event.preventDefault()
      ok()
    }
  }

  return (
    <Modal open={open} onClose={cancel}>
      <Box sx={style} className="space-y-4 rounded-xl">
        <Typography variant="h6" component="h2" className="text-xl">
          {title}
        </Typography>
        {description && <Typography variant="body1" component="p" className="text-md text-gray-600">
          {description}
        </Typography>}
        {field ? <TextField
          autoFocus
          fullWidth
          label={field.label}
          multiline={field.multiline}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          rows={field.multiline ? 5 : 1}
          value={input}
          variant="filled"
        /> : <br />}
        <div className="text-right space-x-4">
          { inputParams !== undefined && <Button variant="outlined" onClick={cancel}>Cancel</Button>}
          <Button variant="contained" type="submit" onClick={ok}>{action}</Button>
        </div>
      </Box>
    </Modal>
  );
}
