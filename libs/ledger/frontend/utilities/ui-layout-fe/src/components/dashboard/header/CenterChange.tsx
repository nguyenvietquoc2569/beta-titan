import { Fragment, useMemo, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Avatar, Typography, ListItemText, ListItemAvatar, MenuItem, Button, CircularProgress } from '@mui/material';
// utils
// _mock_
import { cssStyles, IconButtonAnimate, Scrollbar } from '@beta-titan/ledger/frontend/utilities/ui-settings-fe';
import { BadgeStatus, Iconify, MenuPopover, useResponsive } from '@beta-titan/ledger/frontend/utilities/core-components';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import { useCenterBaseGroup, useSession } from '@beta-titan/ledger/frontend/utilities/shared';
import { ICenterCodeTree } from '@beta-titan/shared/data-types';
import { ELanguage, ILangConvertFunc, useLangContext } from '../../multi-language/language-context';
import { useLoading } from '../../loading-backdrop/loading-backdrop-context';
import { fetcher } from '@beta-titan/ledger/frontend/utilities/shared';
// components

const CenterTitleStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.overline,
  borderRadius: theme.shape.borderRadius,
  paddingTop: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
  ...cssStyles(theme).bgBlur(),
}));

const MenuCenterTitleStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.overline,
  borderRadius: theme.shape.borderRadius,
  paddingTop: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
  // ...cssStyles(theme).bgBlur(),
}));


// ----------------------------------------------------------------------

const ITEM_HEIGHT = 45;

// ----------------------------------------------------------------------

export default function CenterChange() {
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const {current, t, changeLanguage, languageOptions} = useLangContext()
  const { session } = useSession()
  const isDesktop = useResponsive('up', 'lg');
  const {setLoading} = useLoading()

  const {result, isLoading} = useCenterBaseGroup(false)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const datatree = useMemo(() => generateTreeData(result || [], t), [result, t])

  const handleChangeCenter = async (codeSelected: string) => {
    if (codeSelected==='') {
      return
    }
    try {
      setLoading(true)
      const re: {
        code: number;
        data: any;
      } = await fetcher('/api/auth/switchcenter', { body: JSON.stringify({ code: codeSelected }) })
      setLoading(false)
      if (re.code === 200) {
        window.location.reload()
        // await mutate({isLoading: true}, true)
        // reduxSecureCommonActionSetLoadingDone(dispatch)
      } else {
        // reduxSecureCommonActionSetLoadingDone(dispatch)
        throw new Error()
      }
    } catch (e) {
      setLoading(false)
    } 
  }

  return (
    <>
      <Button
        variant='text'
        onClick={handleOpen}
        startIcon={<Iconify icon={'ep:school'} />}
      >
        <CenterTitleStyle>
          {t({ [ELanguage.VI]: session.workingCenter?.name || '', [ELanguage.EN]:   session.workingCenter?.eName || ''})}
          
        </CenterTitleStyle>
      </Button>


      <MenuPopover
        open={Boolean(open)}
        // arrow='top-left'
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 320,
          '& .MuiMenuItem-root': {
            px: 1.5,
            height: ITEM_HEIGHT,
            borderRadius: 0.75,
          },
        }}
      >
        {/* <Typography variant="h6" sx={{ p: 1.5 }}>
          Trung Tâm Hiện Tại
        </Typography> */}

        <Scrollbar sx={{ height: ITEM_HEIGHT * 6 }}>
          {
            isLoading && 
            <div style={{    
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'}}>
                <CircularProgress></CircularProgress>
            </div>
          }
          {
            result && <ITreeTo treeDatas={datatree} handleChangeCenter={handleChangeCenter}></ITreeTo>
          }
          {/* {_contacts.map((contact) => (
            <MenuItem key={contact.id}>
              <ListItemAvatar sx={{ position: 'relative' }}>
                <Avatar src={contact.avatar} />
                <BadgeStatus
                  status={contact.status}
                  sx={{ position: 'absolute', right: 1, bottom: 1 }}
                />
              </ListItemAvatar>

              <ListItemText
                primaryTypographyProps={{ typography: 'subtitle2', mb: 0.25 }}
                secondaryTypographyProps={{ typography: 'caption' }}
                primary={contact.name}
                secondary={contact.status === 'offline'}
              />
            </MenuItem>
          ))} */}
        </Scrollbar>
      </MenuPopover>
    </>
  );
}

function ITreeTo ({treeDatas, handleChangeCenter}: {treeDatas: Array<IDataTree>, handleChangeCenter: (s: string) => void}): JSX.Element {
  return <>{treeDatas.map(node => {
    return <Fragment key={`${node.title}`}>
      <MenuItem
        onClick={() => { handleChangeCenter(node.key) }}
        sx={{
          paddingTop:'0px',
          paddingBottom:'0px'
        }}
        divider
        >
        <div
          style={{
            marginLeft: `${node.level*20}px`
          }}
        >
        <CenterTitleStyle>
        {node.icon}  {node.title}
        </CenterTitleStyle>
      </div>
      </MenuItem>
    </Fragment>
  })}</>
}

function generateTreeData (centerCodeTree: Array<ICenterCodeTree>, t: ILangConvertFunc) {
  let  re: Array<IDataTree> = []
  for (const tree of centerCodeTree) {
    re = re.concat(fromCenterCodeTreeToTreeData(tree, 0, t))
  }
  return re
}

interface IDataTree {
  title: string,
  key: string,
  icon: JSX.Element,
  children: Array<IDataTree>,
  level: number
}

function fromCenterCodeTreeToTreeData (node: ICenterCodeTree, level: number, t: ILangConvertFunc): Array<IDataTree> {
  const _node: IDataTree = {
    title: t({ [ELanguage.VI]: node.mongoObject?.name || node.code, [ELanguage.EN]:  node.mongoObject?.eName || node.code}),
    key: node.code,
    icon: <Iconify icon={'ep:school'} />,
    children: [],
    level: level
  }

  let re = [_node]

  for (const child of node.children) {
    re = re.concat(fromCenterCodeTreeToTreeData(child, level + 1, t))
  }
  return re
}
