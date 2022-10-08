import { m } from 'framer-motion';
// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, CircularProgress } from '@mui/material';

// components
// import { MotionContainer, varBounce } from '../components/animate';
// assets
import { Image, Page } from '@beta-titan/ledger/frontend/utilities/core-components';
import { MotionContainer, varBounce } from '@beta-titan/ledger/frontend/utilities/ui-settings-fe';
import { useEffect, useState } from 'react';
import { fetcher } from '@beta-titan/ledger/frontend/utilities/shared';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LogoutPage() {
  const [error, setError] = useState<string>('')
  const [requestingLogout, setRequestingLogout] = useState(false)

  useEffect(() => {
    logoutRequest()
  }, [])

  const logoutRequest = () => {
    setRequestingLogout(true)
    fetcher('/api/auth/logout', {
    }).then(({ code, data }) => {
      setRequestingLogout(false)
      if (code === 200) {
        window.location.href='/'
      } else {
        setError(data.message)
      }
    })
  }
  return (
    <Page title="Logging out">
      <Container component={MotionContainer}>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph>
              Logging out
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>
              We are going to log you out of system <br/>
              {error}
              <br />
              <br />
              <CircularProgress></CircularProgress>
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Image
              visibleByDefault
              disabledEffect
              src="/images/illustration_login.png"
              alt="login"
            />
            {/* <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} /> */}
          </m.div>

        </ContentStyle>
      </Container>
    </Page>
  );
}
