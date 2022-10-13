import { useMessage } from '@beta-titan/ledger/frontend/utilities/core-components'
import { useLangContext } from '@beta-titan/ledger/frontend/utilities/ui-layout-fe'
import { DialogAnimate } from '@beta-titan/ledger/frontend/utilities/ui-settings-fe'
import { defaultIKanbanBoard } from '@beta-titan/shared/data-types'
import { DialogTitle } from '@mui/material'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { ReactNode, useState } from 'react'
import { BoardEditUI } from '../board-edit-ui/board-edit-ui'
interface Props {
  isOpenModal: boolean,
  onClose: () => void,
}
export const BoardNewModal = ({isOpenModal, onClose }: Props) => {
  const { tt, ttt } = useLangContext()
  const [isLoading, setIsLoading] = useState(false)
  const message = useMessage()

  const newBoard = (data: any) => {
    setIsLoading(false)
    axios({
      method: 'post',
      baseURL: window.location.protocol + '//' + window.location.host,
      url: '/api/v1/kanban/add-board-to-center',
      data: {
        data
      },
    }).then(res => {
      setIsLoading(false)
      if (res.status === 200) {
        if (res.data.error) {
          message(<>{ttt('Lỗi', 'Error')} {JSON.stringify(res.data.error)}</>, 'error')
          // return
        } else {
          message(<>{ttt('Tạo Kanban Board thành công', 'Successful to create new kanban')}</>, 'default')
          onClose()
        }
      }
    }).catch(e => {
      setIsLoading(false)
      message(<>{ttt('Lỗi', 'Error')} {JSON.stringify(e)}</>, 'error')
    })
  }

  return <DialogAnimate maxWidth='lg' open={isOpenModal} onClose={onClose}>
  <DialogTitle>{tt(['Tạo bảng kanban mới', 'New Kanban Board'])}</DialogTitle>
  <BoardEditUI
    board={defaultIKanbanBoard}
    submitData={newBoard}
    submitText={ttt('Tạo Một Board', 'Create New Board')}
    isSubmitting={isLoading}
  ></BoardEditUI>
</DialogAnimate>
}