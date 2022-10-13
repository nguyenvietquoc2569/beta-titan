import { HeaderBreadcrumbs, Iconify } from '@beta-titan/ledger/frontend/utilities/core-components';
import { useLangContext } from '@beta-titan/ledger/frontend/utilities/ui-layout-fe';
import { useSettings } from '@beta-titan/ledger/frontend/utilities/ui-settings-fe';
import { Button, Container } from '@mui/material';
import { useState } from 'react';
import { BoardEditModal } from '../components/board-edit-ui/board-edit-modal/board-edit-modal';
import { BoardNewModal } from '../components/board-edit-ui/board-new-modal/board-new-modal';
import { KanbanBoardManagerTable, KanbanBoardManagerTableRef } from '../components/manager/kanban-board-manager-table';

export const KanbanManagerPage = () => {
  const { themeStretch } = useSettings();
  const [isOpenModal, setOpenModal] = useState(false)
  const [isOpenEditModal, setOpenEditModal] = useState(false)
  const [codeEdit, setCodeEdit] = useState('')
  const { tt } = useLangContext()

  let tableRef: KanbanBoardManagerTableRef

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
    <KanbanBoardManagerTable ref={(c) => tableRef = c} onEditClick={(_code: string) => {
      setCodeEdit(_code)
      setOpenEditModal(true)
    }} />
    <BoardNewModal isOpenModal={isOpenModal} onClose={()=> {setOpenModal(false); tableRef?.reload()}}></BoardNewModal>
    <BoardEditModal
      isOpenModal={isOpenEditModal}
      onClose={() => { setOpenEditModal(false); setCodeEdit(''); tableRef?.reload() }}
      code={codeEdit}
    ></BoardEditModal>
  </Container>
}
