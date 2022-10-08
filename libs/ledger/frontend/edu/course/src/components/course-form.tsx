import { FormProvider, RHFTextField } from '@beta-titan/ledger/frontend/utilities/core-components'
import { ICourse } from '@beta-titan/shared/data-types';
import { Box, Card, Stack } from '@mui/material'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useLangContext, useLoading } from '@beta-titan/ledger/frontend/utilities/ui-layout-fe';
import { LoadingButton } from '@mui/lab';
import { checkSomeConditionForCourse } from './course-form-helper';
import { useCallback } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useSession } from '@beta-titan/ledger/frontend/utilities/shared';

// interface FormValuesProps extends Omit<UserManager, 'avatarUrl'> {
//   avatarUrl: CustomFile | string | null;
// }

type FormValuesProps = ICourse

type Props = {
  isEdit: boolean;
  currentCourse?: ICourse;
  onClose?: () => void
};

export const CourseForm = ({currentCourse, isEdit, onClose}: Props) => {

  const {session} = useSession()
  const {tt} = useLangContext()
  const {setLoading} = useLoading()

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    code: Yup.string().required(tt(['Mã khoá học là trường bắt buộc', 'Code is required'])).test({
      message: tt(['Mã khoá học đã được sử dụng', 'Code was used by other course']),
      test: async(code) => {
        const count = await checkSomeConditionForCourse(`{"code":"${code}"}`, isEdit ? (currentCourse?._id || '') : '')
        return count === 0
      }
    }),
    name: Yup.string().required(tt(['Tên khoá học là trường bắt buộc','Name is required'])).test({
      message: tt(['Tên khoá đã được sử dụng', 'Name was used by other course']),
      test: async(name) => {
        const count = await checkSomeConditionForCourse(`{"name":"${name}"}`, isEdit ? (currentCourse?._id || '') : '')
        return count === 0
      }
    }),
    numSession: Yup.number().required(tt(['Số buổi là trường bắt buộc', 'Number of Sesison is required'])),
    numHours: Yup.number().required(tt(['Số giờ trên 1 buổi', 'Number of Hours is required'])),
    price: Yup.number().positive(tt(['Giá không hợp lệ', 'Price is invalid'])).required(tt(['Giá của khoá học', 'Price is required'])),
  });

  const defaultValues: ICourse = {
    _id: currentCourse?._id || '',
    code: currentCourse?.code || '',
    name: currentCourse?.name || '',
    numSession: currentCourse?.numSession || 30,
    numHours: currentCourse?.numHours || 1.5,
    center: currentCourse?.center ||  session.workingCenter,
    description: currentCourse?.description || '',
    price: currentCourse?.price || 4500000,
    isActive: true,
    changeHistory: []
  }

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const submitAnewCourse = useCallback((courseNew: ICourse) => {
    setLoading(true)
    axios({
      method: 'post',
      baseURL: window.location.protocol + '//' + window.location.host,
      url: '/api/v1/edu/courses/new',
      data: {
        course: courseNew
      },
    }).then(res => {
      setLoading(false)
      if (res.status === 200) {
        onClose && onClose()
        enqueueSnackbar(`${tt(['Đã thêm khoá học', 'Added course'])}`)
      }
    }).catch((e: Error) => {
      enqueueSnackbar(`${tt(['Lỗi đã xảy ra', 'error happened'])}: ${e.message}`, {
        variant: "error"
      });
    })
  }, [setLoading, onClose, tt, enqueueSnackbar])
  
  return <FormProvider methods={methods} onSubmit={handleSubmit((data: FormValuesProps)=>{!isEdit && submitAnewCourse(data); console.log(data)})}>
    <Card sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'grid',
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
        }}
      >
        <RHFTextField name="code" label={tt(['Mã khoá học', 'Course Code'])} />
        <RHFTextField name="name" label={tt(['Tên khoá học', 'Course Name'])} />
        <RHFTextField name="numSession" label={tt(['Số buổi học', 'Number of Session'])} />
        <RHFTextField name="numHours" label={tt(['Số giờ mỗi buổi', 'Hours/sesion'])} />
        <RHFTextField name="price" label={tt(['Giá khoá học (VNĐ)', 'Price (VNĐ)'])} />
        {/* <RHFTextField name="phoneNumber" label="Phone Number" /> */}
      </Box>
      <Box
        sx={{
          mt: 3,
          display: 'grid',
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
        }}
      >
        <RHFTextField name="description" label={tt(['Mô tả', 'Description'])} multiline/> 
      </Box>
      <Stack alignItems="flex-end" sx={{ mt: 3 }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {!isEdit ? tt(['Tạo khoá học', 'Create course']) : tt(['Lưu thay đổi', 'Save Changes'])}
        </LoadingButton>
      </Stack>
    </Card>
  </FormProvider>
}