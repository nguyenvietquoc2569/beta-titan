// utils
// import createAvatar from '../utils/createAvatar';
//
import { useSession } from '@beta-titan/ledger/frontend/utilities/shared';
import { useMemo } from 'react';
import Avatar, { Props as AvatarProps } from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }: AvatarProps) {
  const { session } = useSession()

  const [processString, isSvgString] = useMemo(() => {
    let isSvgString = false
    if (session.user.avatar?.includes('<svg')) {
      const buff = new Buffer(session.user.avatar);
      const base64data = buff.toString('base64');
      isSvgString = (true)
      return [base64data, isSvgString]
    } 
    isSvgString = (false)
    return [session.user.avatar, isSvgString]
  }, [session])

  return ( 
    <Avatar
      src={isSvgString ? `data:image/svg+xml;base64,${processString}` : processString}
      alt={session.user.username}
      color={'default'}
      {...other}
    >
      {isSvgString ? <img alt={session.user.username} src={`data:image/svg+xml;base64,${processString}`} /> :
      <img alt={session.user.username} src={`${processString}`} />}
    </Avatar>
  );
}
