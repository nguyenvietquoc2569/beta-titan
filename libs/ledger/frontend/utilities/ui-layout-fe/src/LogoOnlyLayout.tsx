import { ReactNode } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Logo } from '@beta-titan/ledger/frontend/utilities/core-components';
// components

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  children?: ReactNode;
};

export function LedgerLogoOnlyLayout({ children }: Props) {
  return (
    <>
      <HeaderStyle>
        <Logo />
      </HeaderStyle>
      {children}
    </>
  );
}
