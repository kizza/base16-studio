import { Button } from "@mui/material"

export interface PropsType {
  label: string
  icon: JSX.Element
  onClick: () => void
}

export default ({ label, icon, onClick}: PropsType) =>
  <Button variant="text" size="small" onClick={() => onClick()} sx={{
    fontSize: '10px',
    lineHeight: '2px',
    height: '32px',
    margin: 'auto',
    marginRight: '8px',
    padding: '0px 8px',
    '& .MuiButtonBase-root': {
      padding: '0px',
      lineHeight: '20px',
    },
  }} startIcon={icon}>{label}</Button>
