import { switchStyles } from "@/pages";
import { Switch as MuiSwitch, styled } from "@mui/material";

interface PropTypes {}

const shouldForwardProp = (_prop: string) => true

const Switch = styled(MuiSwitch, { shouldForwardProp })<PropTypes>(({}) => ({
  '& .MuiSwitch-thumb': {
    ...switchStyles.off
  },
  '& .Mui-checked .MuiSwitch-thumb': {
    ...switchStyles.on
  }
}));

export default Switch
