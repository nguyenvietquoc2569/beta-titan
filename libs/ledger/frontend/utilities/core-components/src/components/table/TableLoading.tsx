// @mui
import { TableRow, TableCell } from '@mui/material';
import { m } from 'framer-motion';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
//
import Logo from '../Logo';
import LoadingContent from '../LoadingContent';
//

// ----------------------------------------------------------------------

export default function TableLoading() {
  return (
    <TableRow>
      <TableCell colSpan={12}>
        <LoadingContent title='Loading' />
      </TableCell>
    </TableRow>
  );
}
