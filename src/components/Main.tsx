import { styled } from "@mui/material";

interface PropTypes {
  drawerWidth: number
  open: boolean
}

const shouldForwardProp = (prop: string) => !['open', 'drawerWidth'].includes(prop)

const Main = styled('main', { shouldForwardProp })<PropTypes>(({ theme, open, drawerWidth }) => ({
  flexGrow: 1,
  overflow: 'hidden',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export default Main
