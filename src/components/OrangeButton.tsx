import {
  Button,
  ButtonProps,
  forwardRef,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react'
import { ForwardedRef } from 'react'

export const OrangeButton = forwardRef(
  (props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const theme = useTheme()
    const styleProps = useColorModeValue(
      {
        bg: theme.colors.orange[400],
        color: 'white',
        _hover: {
          bg: theme.colors.orange[500],
          _disabled: {
            bg: theme.colors.otog,
          },
        },
        _active: { bg: theme.colors.orange[700] },
      },
      {
        bg: theme.colors.orange[500],
        color: 'white',
        _hover: {
          bg: theme.colors.orange[400],
          _disabled: {
            bg: theme.colors.otog,
          },
        },
        _active: { bg: theme.colors.orange[200] },
      }
    )

    return <Button {...styleProps} {...props} ref={ref} />
  }
)
