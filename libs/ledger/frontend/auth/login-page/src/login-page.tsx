import { Image, Logo, Page, useResponsive } from '@beta-titan/ledger/frontend/utilities/core-components'
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Alert, Tooltip, Container, Typography, CircularProgress, Button } from '@mui/material';
import { LoginForm } from 'libs/ledger/frontend/auth/login-page/src/login-form';
import { useCallback, useEffect, useState } from 'react';
import { IStaffLoginSession } from '@beta-titan/shared/data-types'
import { fetcher } from '@beta-titan/ledger/frontend/utilities/shared';
// import Button fom 'libs/ledger/frontend/utilities/ui-settings-fe/src/theme/overrides/Button';


// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

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

export const LoginPage = () => {
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  const [session, setSession] = useState<IStaffLoginSession | null>(null)
  const [returnUrl, setReturnUrl] = useState<string | null>(null)
  const [checkingSession, setCheckingSession] = useState(false)

  useEffect(() => {
    checkLoginStatus()
    getReturnUrl()
  }, [])

  const checkLoginStatus = useCallback(() => {
    setCheckingSession(true)
    fetcher('/api/auth/session', {
    }).then(({ code, data }) => {
      setCheckingSession(false)
      if (code === 200) {
        setSession(data.session)
      } else {
        setSession(null)
      }
    })
  }, [])

  const getReturnUrl = () => {
    if (getParameterByName('RETURNURL', window.location.href)) {
      setReturnUrl(getParameterByName('RETURNURL', window.location.href))
    }
  }

  return <Page title='Login To Beta System'>
    <RootStyle>
      <HeaderStyle>
        <Logo />
      </HeaderStyle>
      {mdUp && (
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <Image
            visibleByDefault
            disabledEffect
            src="/images/illustration_login.png"
            alt="login"
          />
        </SectionStyle>
      )}

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Sign in to Betaschool System
              </Typography>
              {
                checkingSession &&
                <Typography sx={{ color: 'text.secondary' }}>
                  Loading the session data ...
                </Typography>
              }
              {
                !checkingSession && !session &&
                <Typography sx={{ color: 'text.secondary' }}>
                  Enter your details below.
                </Typography>
              }
              {
                !checkingSession && session &&
                <Typography sx={{ color: 'text.secondary' }}>
                  You logged into system
                </Typography>
              }

            </Box>

            {/* <Tooltip title={capitalCase(method)} placement="right">
                  <Image
                    disabledEffect
                    alt={method}
                    src={`https://minimal-assets-api-dev.vercel.app/assets/icons/auth/ic_${method}.png`}
                    sx={{ width: 32, height: 32 }}
                  />
                </Tooltip> */}
          </Stack>

          {
            checkingSession && <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          }
          {
            !checkingSession && !session && <>
              <LoginForm onSuccess={ () => {
                checkLoginStatus()
                if (returnUrl) {
                  window.location.href=returnUrl
                } else {
                  window.location.href='/home'
                }
              }}/>
            </>
          }

          {
            !checkingSession && session && <>
              <Stack direction="row">
                <div style={{
                  display: 'flex',
                  alignContent: 'center'
                }}>
                  <Typography variant="h5" sx={{ color: 'text.secondary' }}>Welcome! &nbsp;</Typography>
                  <Typography variant="h5">
                    {session.user.username}
                  </Typography>
                </div>
              </Stack>
              <Button
                href='/home'
                sx={{
                    marginTop: '20px'
                  }}  variant="contained">
                    Go to Home
              </Button>
              <Button
                href='/auth/logout'
                sx={{
                    marginTop: '20px'
                  }}  variant="text">
                    Not you? Log out
              </Button>

            </>
          }

        </ContentStyle>
      </Container>
    </RootStyle>
  </Page>
}

function getParameterByName(name: string, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
