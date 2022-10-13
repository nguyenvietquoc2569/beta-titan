import { Avatar, Label, TableEmptyRows, TableHeadCustom, useTable, useTabs } from '@beta-titan/ledger/frontend/utilities/core-components';
import { useLangContext } from '@beta-titan/ledger/frontend/utilities/ui-layout-fe';
import { Scrollbar } from '@beta-titan/ledger/frontend/utilities/ui-settings-fe';
import { IKanbanBoard } from '@beta-titan/shared/data-types';
import { Box, Button, Card, CircularProgress, Container, Divider, FormControlLabel, Grid, Stack, Switch, Tab, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tabs } from '@mui/material'
import { forwardRef, ForwardRefExoticComponent, Ref, RefAttributes, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import axios from 'axios';

const STATUS_OPTIONS = ['all', 'active', 'disabled'];

interface Props {
  onEditClick: (_code: string) => void
}

type RefType<T> = (T extends ForwardRefExoticComponent<Props & RefAttributes<infer T2>> ? T2 : never) | null;
export type KanbanBoardManagerTableRef = RefType<typeof KanbanBoardManagerTable>

export const KanbanBoardManagerTable = forwardRef(({onEditClick}: Props, ref: Ref<{
  reload: () => void
}>) => {
  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');
  const [boards, setBoards] = useState<Array<IKanbanBoard>>([])
  const { tt } = useLangContext()
  const [isLoading, setLoading] = useState(false)
  const theme = useTheme()
  
  const dataFiltered = useMemo(() => {
    return boards.filter(board => {
      if (filterStatus === STATUS_OPTIONS[0]) {
        return !!board
      }
      if (filterStatus === STATUS_OPTIONS[1]) {
        return board.deactive === false
      }
      if (filterStatus === STATUS_OPTIONS[2]) {
        return board.deactive === true
      }
      return true
    })
  }, [boards, filterStatus])

  const TABLE_HEAD = [
    { id: 'id', label: tt(['Mã', 'Code']), align: 'left' },
    { id: 'name', label: tt(['Tên', 'Name']), align: 'left' },
    { is: 'isActive', label: tt(['Hoạt động']), align: 'left'},
    { id: 'action' },
  ];

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const denseHeight = dense ? 52 : 72;

  const reload = () => {
    setLoading(true)
    axios({
      method: 'post',
      baseURL: window.location.protocol + '//' + window.location.host,
      url: '/api/v1/kanban/get-board-list',
      data: {
      },
    }).then(res => {
      setLoading(false)
      if (res.status === 200) {
        if (res.data.error) {
          setBoards([])
          // message.error(res.data.error[t('language')])
        } else {
          setBoards(res.data.data)
          // setCount(res.data.count)
        }
      }
    }).catch(e => {
      setLoading(false)
      // message.error(e.toString())
      // setError(e.toString());
      setBoards([])
      // message.error(res.data.error[t('language')])
    })
  }

  useImperativeHandle(
    ref,
    () => ({
      reload,
    }),
  )

  useEffect(() => {
    reload() 
  }, [])

  return <Card>
    <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        value={filterStatus}
        onChange={onChangeFilterStatus}
        sx={{ px: 2, bgcolor: 'background.neutral' }}
      >
        {STATUS_OPTIONS.map((tab) => (
          <Tab disableRipple key={tab} label={tab} value={tab} />
        ))}
    </Tabs>
    <Divider />
    <Scrollbar>
      <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
        <Table size={dense ? 'small' : 'medium'}>
          <TableHeadCustom
            order={order}
            orderBy={orderBy}
            headLabel={TABLE_HEAD}
            rowCount={boards.length}
            // numSelected={selected.length}
            // onSort={onSort}
            // onSelectAllRows={(checked) =>
            //   onSelectAllRows(
            //     checked,
            //     tableData.map((row) => row.id)
            //   )
            // }
          />
          <TableBody>
            {!isLoading && dataFiltered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover key={row._id}>
                  <TableCell align="left">
                    <Grid container spacing="1" alignItems="center">
                    {row.logo && <Avatar src={row.logo}></Avatar>}
                    <span style={{ padding: 5 }}>{row.code}</span>
                    </Grid>
                    </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={(row.deactive && 'error') || 'success'}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {!row.deactive ? tt(['Đang hoạt đông', 'Active']) : tt(['Ngừng hoạt động', 'Disabled'])}
                    </Label>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => onEditClick(row.code)}>{tt(['Sửa', 'Edit'])}</Button>
                  </TableCell>
                </TableRow>
              ))}
            <TableEmptyRows
              height={denseHeight}
              emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
            />
            {(isLoading ) && <Container sx={{
              padding: 5,
              alignContent: 'center',
              textAlign: 'center'
            }}><CircularProgress /></Container>}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
    <Box sx={{ position: 'relative' }}>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={dataFiltered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />

      <FormControlLabel
        control={<Switch checked={dense} onChange={onChangeDense} />}
        label="Dense"
        sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
      />
    </Box>
  </Card>
})

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

