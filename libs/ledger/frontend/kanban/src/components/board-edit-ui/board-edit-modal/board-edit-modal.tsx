import { DialogAnimate } from '@beta-titan/ledger/frontend/utilities/ui-settings-fe'
import { DialogTitle } from '@mui/material'
import { ReactNode } from 'react'
import { BoardEditUI } from '../board-edit-ui/board-edit-ui'
interface Props {
  isOpenModal: boolean,
  onClose: () => void,
  title: ReactNode
}
export const BoardEditModal = ({isOpenModal, onClose, title }: Props) => {
  return <DialogAnimate maxWidth='lg' open={isOpenModal} onClose={onClose}>
  <DialogTitle>{title}</DialogTitle>
  <BoardEditUI></BoardEditUI>
</DialogAnimate>
}