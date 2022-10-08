import Head from 'next/head'
import { getEnvConfig } from '@beta-titan/shared/utilities';
import React from 'react';
import { LoginPage } from '@beta-titan/ledger/frontend/auth/login-page';

export const getServerSideProps = ((async function ({ req, res, asPath, pathname }) {
  // const { req, query, res, asPath, pathname } = context;
  let host
  if (req) {
    host = req.headers.host // will give you localhost:3000
  }

  const domain = host.replace('www.','').split(':')[0]
  const envConfig = getEnvConfig();

  return {
    props: {
      envConfig: envConfig
    }
  }
}))

function _LoginPage(props) {
  return <>
    <LoginPage />
  </>
}

export default _LoginPage

