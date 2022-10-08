import { useLangContext } from '@beta-titan/ledger/frontend/utilities/ui-layout-fe'
import { DialogAnimate } from '@beta-titan/ledger/frontend/utilities/ui-settings-fe'
import { defaultIKanbanBoard } from '@beta-titan/shared/data-types'
import { DialogTitle } from '@mui/material'
import { ReactNode } from 'react'
import { BoardEditUI } from '../board-edit-ui/board-edit-ui'
interface Props {
  isOpenModal: boolean,
  onClose: () => void,
}
export const BoardNewModal = ({isOpenModal, onClose }: Props) => {
  const { tt } = useLangContext()


  return <DialogAnimate maxWidth='lg' open={isOpenModal} onClose={onClose}>
  <DialogTitle>{tt(['Tạo bảng kanban mới', 'New Kanban Board'])}</DialogTitle>
  <BoardEditUI board={defaultIKanbanBoard}></BoardEditUI>
</DialogAnimate>
}