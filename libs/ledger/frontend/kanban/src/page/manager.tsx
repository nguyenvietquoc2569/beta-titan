import { HeaderBreadcrumbs, Iconify } from '@beta-titan/ledger/frontend/utilities/core-components';
import { useLangContext } from '@beta-titan/ledger/frontend/utilities/ui-layout-fe';
import { useSettings } from '@beta-titan/ledger/frontend/utilities/ui-settings-fe';
import { Button, Container } from '@mui/material';
import { useState } from 'react';
import { BoardNewModal } from '../components/board-edit-ui/board-new-modal/board-new-modal';
import { KanbanBoardManagerTable } from '../components/manager/kanban-board-manager-table';

export const KanbanManagerPage = () => {
  const { themeStretch } = useSettings();
  const [isOpenModal, setOpenModal] = useState(false)
  const { tt } = useLangContext()


  return <Container maxWidth={themeStretch ? false : 'xl'} sx={{padding: 0}}>
    <HeaderBreadcrumbs
      heading={tt(['Quản lý Bảng Kanban', 'Kanban Board Management'])}
      links={[
        { name: 'Dashboard', href: '/home' },
        { name: 'Kanban' },
      ]}
      action={<>
        {/* <NextLink href={'/home/edu/courses/new-course'} passHref> */}
        <Button
          variant="contained"
          startIcon={<Iconify icon={'eva:plus-fill'} />}
          onClick={() => setOpenModal(!isOpenModal)}
        >
          {tt(['Tạo Bảng Mới', 'New Kanban Board'])}
        </Button>
        {/* </NextLink> */}

        {/* <Button sx={{ marginLeft: '10px' }} onClick={loadCourse} variant="contained" startIcon={<Iconify icon={'jam:refresh'} />}>
          {tt(['Làm Tươi', 'Refresh'])}
        </Button> */}
      </>
      }
    />
    <KanbanBoardManagerTable />
    <BoardNewModal isOpenModal={isOpenModal} onClose={()=> {setOpenModal(false)}}></BoardNewModal>
  </Container>
}
