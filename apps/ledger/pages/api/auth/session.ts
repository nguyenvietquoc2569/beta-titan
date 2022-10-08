import { withSession, withUserParse } from '@beta-athena/beta/backend'

export default withSession(withUserParse(async (req, res) => {
  const session = req.loginSession

  if (session) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.status(200).json({
      session,
    })
  } else {
    res.status(403).json({
    })
  }
}))
