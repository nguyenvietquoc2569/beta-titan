import { HeaderBreadcrumbs, Iconify, Label, TableEmptyRows, TableHeadCustom, TableNoData, useTable, useTabs } from '@beta-titan/ledger/frontend/utilities/core-components';
import { useLangContext, useLoading } from '@beta-titan/ledger/frontend/utilities/ui-layout-fe'
import { DialogAnimate, Scrollbar, useSettings } from '@beta-titan/ledger/frontend/utilities/ui-settings-fe';
import { ICourse } from '@beta-titan/shared/data-types';
import { Box, Button, Card, Checkbox, Container, DialogTitle, Divider, FormControlLabel, Switch, Tab, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tabs } from '@mui/material'
import axios from 'axios';
import { CourseForm } from '../components/course-form';
import NextLink from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles'

const STATUS_OPTIONS = ['all', 'active', 'banned'];

const TABLE_HEAD = [
  { id: 'name', label: 'Code', align: 'left' },
  { id: 'company', label: 'Company', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'isVerified', label: 'Verified', align: 'center' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

export const CoursePage = () => {
  const { themeStretch } = useSettings();
  const { tt } = useLangContext()
  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');
  const [courses, setCourses] = useState<Array<ICourse>>([])
  const { setLoading } = useLoading()
  const [isOpenModal, setOpenModal] = useState(false)

  const theme = useTheme();

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

  const loadCourse = useCallback(() => {
    setLoading(true)
    axios({
      method: 'get',
      baseURL: window.location.protocol + '//' + window.location.host,
      url: '/api/v1/edu/courses/get',
      data: {},
    }).then(res => {
      setLoading(false)
      if (res.status === 200) {
        setCourses(res.data.result)
      }
    }).catch(e => {
      setLoading(false)
    })
  }, [setLoading])

  useEffect(() => {
    loadCourse()
  }, [loadCourse])

  const dataFiltered = useMemo(() => {
    return courses
  }, [courses])

  const denseHeight = dense ? 52 : 72;

  const TABLE_HEAD = [
    { id: 'code', label: tt(['Mã', 'Code']), align: 'left' },
    { id: 'name', label: tt(['Tên', 'Name']), align: 'left' },
    { id: 'numSession', label: tt(['Số buổi', 'Number of Session']), align: 'left' },
    { id: 'numHours', label: tt(['Số giờ/buổi', 'Hours/session']), align: 'left' },
    { is: 'isActive', label: tt(['Hoạt động']), align: 'left'},
    { id: '' },
  ];
  

  return <Container maxWidth={themeStretch ? false : 'xl'}>
    <HeaderBreadcrumbs
      heading={tt(['Quản lý khoá học', 'Course Management'])}
      links={[
        { name: 'Dashboard', href: '/home' },
        { name: 'Course' },
      ]}
      action={<>
        {/* <NextLink href={'/home/edu/courses/new-course'} passHref> */}
        <Button
          variant="contained"
          startIcon={<Iconify icon={'eva:plus-fill'} />}
          onClick={() => setOpenModal(!isOpenModal)}
        >
          {tt(['Tạo khoá học', 'New Course'])}
        </Button>
        {/* </NextLink> */}

        <Button sx={{ marginLeft: '10px' }} onClick={loadCourse} variant="contained" startIcon={<Iconify icon={'jam:refresh'} />}>
          {tt(['Làm Tươi', 'Refresh'])}
        </Button>

      </>
      }
    />
    <Card>
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
              rowCount={courses.length}
              // numSelected={selected.length}
              onSort={onSort}
              // onSelectAllRows={(checked) =>
              //   onSelectAllRows(
              //     checked,
              //     tableData.map((row) => row.id)
              //   )
              // }
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover key={row._id}>
                    <TableCell align="left">{row.code}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.numSession}</TableCell>
                    <TableCell align="left">{row.numHours}</TableCell>
                    <TableCell align="left"><Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={(!row.isActive && 'error') || 'success'}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {row.isActive ? tt(['Đang hoạt đông', 'Active']) : tt(['Ngừng hoạt động', 'Disable'])}
                    </Label>
                  </TableCell>
                  </TableRow>
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, courses.length)}
              />

              {/* <TableNoData isNotFound={isNotFound} /> */}
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
    <DialogAnimate maxWidth='lg' open={isOpenModal} onClose={() => setOpenModal(false)}>
      <DialogTitle>New Course</DialogTitle>
      <CourseForm isEdit={false} onClose={() => { setOpenModal(false) }}></CourseForm>
    </DialogAnimate>
  </Container>
}

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
