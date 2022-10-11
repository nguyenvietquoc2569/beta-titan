import { Button } from '@mui/material';
import { SnackbarMessage, SnackbarOrigin, useSnackbar, VariantType } from 'notistack';

export function useMessage () {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  return (message: SnackbarMessage, color: VariantType, anchor?: SnackbarOrigin) => {
    enqueueSnackbar(message, {
      variant: color,
      anchorOrigin: anchor
    })
  }
}
