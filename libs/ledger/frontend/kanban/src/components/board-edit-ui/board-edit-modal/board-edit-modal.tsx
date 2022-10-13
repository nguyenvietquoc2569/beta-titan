import { useMessage } from '@beta-titan/ledger/frontend/utilities/core-components'
import { useLangContext } from '@beta-titan/ledger/frontend/utilities/ui-layout-fe'
import { DialogAnimate } from '@beta-titan/ledger/frontend/utilities/ui-settings-fe'
import { CircularProgress, Container, DialogTitle } from '@mui/material'
import axios from 'axios'
import { ReactNode, useEffect, useState } from 'react'
import { BoardEditUI } from '../board-edit-ui/board-edit-ui'
interface Props {
  isOpenModal: boolean,
  onClose: () => void,
  code: string
}
export const BoardEditModal = ({isOpenModal, onClose, code }: Props) => {
  const [board, setBoard] = useState<any>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { tt, ttt } = useLangContext()
  const message = useMessage()

  const fetchTheBoard = () => {
    setIsLoading(false)
    axios({
      method: 'post',
      baseURL: window.location.protocol + '//' + window.location.host,
      url: '/api/v1/kanban/fetch-board',
      data: {
        code
      },
    }).then(res => {
      setIsLoading(false)
      if (res.status === 200) {
        if (res.data.error) {
          message(<>{ttt('Lỗi', 'Error')} {JSON.stringify(res.data.error)}</>, 'error')
          // return
        } else {
          setBoard(res.data.data)
        }
      }
    }).catch(e => {
      setIsLoading(false)
      message(<>{ttt('Lỗi', 'Error')} {JSON.stringify(e)}</>, 'error')
    })
  }

  const saveBoard = (data: any) => {
    setIsSubmitting(false)
    axios({
      method: 'post',
      baseURL: window.location.protocol + '//' + window.location.host,
      url: '/api/v1/kanban/save',
      data: {
        code: code,
        _board: data
      },
    }).then(res => {
      setIsSubmitting(false)
      if (res.status === 200) {
        if (res.data.error) {
          message(<>{ttt('Lỗi', 'Error')} {JSON.stringify(res.data.error)}</>, 'error')
          // return
        } else {
          message(<>{ttt('Edit Kanban Board thành công', 'Successful to create new kanban')} - {code}</>, 'default')
          onClose()
        }
      }
    }).catch(e => {
      setIsSubmitting(false)
      message(<>{ttt('Lỗi', 'Error')} {JSON.stringify(e)}</>, 'error')
    })
  }

  useEffect(() => {
    if (code) {
      fetchTheBoard()
    } else {
      setBoard(undefined)
    }
  }, [code])

  return <DialogAnimate maxWidth='lg' open={isOpenModal} onClose={onClose}>
  <DialogTitle>{tt(['Sửa bảng kanban', 'Edit Kanban Board'])} - {code}</DialogTitle>
  
  {
    (isLoading || !board ) ? <Container sx={{
      padding: 5,
      alignContent: 'center',
      textAlign: 'center'
    }}><CircularProgress /></Container> :
    <BoardEditUI
      board={board}
      submitText={ttt('Sửa Một Board', 'Edit the board')}
      submitData={saveBoard}
      isSubmitting={isSubmitting}
    ></BoardEditUI>
  }

</DialogAnimate>
}