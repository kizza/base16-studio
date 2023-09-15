import { Box, BoxProps, styled } from "@mui/material";
import { useEffect, useState } from "react";

type PropTypes = BoxProps


type FadePropTypes = {
  show: boolean
}

const shouldForwardProp = (prop: string) => !['show'].includes(prop)

const FadeBox = styled(Box, {shouldForwardProp})<FadePropTypes>(({show, theme}) => ({
  opacity: 0,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(show && {
    transition: theme.transitions.create('opacity', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
      delay: theme.transitions.duration.leavingScreen,
    }),
    opacity: 1,
  })
}))

export default (props: PropTypes) => {
  const { children, ...attributes} = props
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  return <FadeBox show={show} {...attributes}>
    {children}
  </FadeBox>
}
