import { fData, FormProvider, RHFCurrentCenterSingleStaffPickup, RHFCurrentCenterStaffPickup, RHFSwitch, RHFTextField, RHLabelCreateList, UploadAvatar } from '@beta-titan/ledger/frontend/utilities/core-components'
import { Box, Card, Grid, Stack, Typography } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { useLangContext } from '@beta-titan/ledger/frontend/utilities/ui-layout-fe'
import { IKanbanBoard, IStaffUser } from '@beta-titan/shared/data-types'
import { useState } from 'react'
import axios from 'axios'
import * as CryptoJS from 'crypto-js';
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const sanitize = require("sanitize-filename")

type FormValuesProps = any //IKanbanBoard
interface Props {
  board: IKanbanBoard,
  submitData: (data: IKanbanBoard) => void,
  submitText: string,
  isSubmitting: boolean
}

export const BoardEditUI = ({board, submitText, submitData, isSubmitting}: Props) => {
  const { ttt } = useLangContext()
  const [upLoadProgress, setUploadProgress] = useState<number | undefined>(undefined)
  const uploadFile = ({ authToken, uploadUrl, file, folder, host }: { host: string, authToken: string, uploadUrl: string, file: File, folder: string }, options: any) => {
    const { onSuccess, onError, onProgress } = options;
    if (file) {
      const newFileName = folder + sanitize(new Date().getTime() + '_' + file?.name).toLowerCase().replace(/\s/g, '_')
      console.log('file name : ', newFileName)
      const reader = new FileReader();
      reader.onload = function () {
        const hash = CryptoJS.SHA1(CryptoJS.enc.Latin1.parse(reader.result?.toString() || ''));
        // Data hashed. Now perform upload.
        const xhr = new XMLHttpRequest();

        xhr.addEventListener("load", function () {
          onSuccess(`${host}${newFileName}`)
        });
        xhr.addEventListener("error", function (error) {
          onError({ err: error })
        })
        xhr.addEventListener('progress', (event) => {
          const percent = Math.floor((event.loaded / event.total) * 90)
          onProgress(5 + percent)
        });

        xhr.upload.onprogress = (event) => {
          const percent = Math.floor((event.loaded / event.total) * 90);
          onProgress(5 + percent)
        }

        xhr.open("POST", uploadUrl);

        xhr.setRequestHeader("Content-Type", file.type);
        xhr.setRequestHeader("Authorization", authToken);
        xhr.setRequestHeader("X-Bz-File-Name", newFileName);
        xhr.setRequestHeader("X-Bz-Content-Sha1",hash.toString());

        const fileToSend = file;

        xhr.send(fileToSend);
      };
      reader.readAsBinaryString(file);
    }
  }
  const getUploadDetails = (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    onProgress(1);
    axios({
      method: 'post',
      baseURL: window.location.protocol + '//' + window.location.host,
      url: '/api/v1/multimedia/get-upload-link',
      data: {},
    }).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          const error = new Error('error /api/v1/multimedia/get-upload-link');
          onError({ err: error });
        } else {
          onProgress(5);
          uploadFile({ ...res.data.data, file, folder: 'avatar/' }, options)
        }
      }
    }).catch(err => {
      onError({ err })
    })
  };

  const BoardSchema = Yup.object().shape({

    name: Yup.string().required(ttt('T??n kh??ng th??? ????? tr???ng', 'Name is required')),
    description: Yup.string().required(ttt('M?? t??? kh??ng th??? ????? tr???ng', 'Description is required')),
    workingStaffs: Yup.array().min(1, ttt('Ph???i c?? ??t nh???t m???t nh??n vi??n', 'Can not be empty here')),
    managers: Yup.array().min(1, ttt('Ph???i c?? ??t nh???t m???t qu???n tr??? vi??n', 'Can not be empty here')).test('managers', ttt('Ng?????i qu???n tr??? ph???i n???m trong danh s??ch th??nh vi??n', 'Manager should be in the member list'), 
      (value, ctx) => {
        const { workingStaffs } = ctx.parent
        const workingStaffsId = workingStaffs.map((staff: IStaffUser) => staff._id)
        for (const staff of (value || [])) {
          if (!workingStaffsId.includes(staff._id)) return false
        }
        return true
      }),
    defaultAssignee: Yup.object().required(ttt('Ph???i c?? ??t nh???t m???t nh??n vi??n', 'Can not be empty here')).test('defaultAssignee', ttt('Ng?????i qu???n tr??? ph???i n???m trong danh s??ch th??nh vi??n', 'Manager should be in the member list'), 
      (value, ctx) => {
        if (!value) return false
        const { workingStaffs } = ctx.parent
        const workingStaffsId = workingStaffs.map((staff: IStaffUser) => staff._id)
        if (!workingStaffsId.includes(value['_id'])) return false
        return true
      }),
    labels: Yup.array().min(1, ttt('??t nh???t ph???i c?? 1 tag', 'at least 1 tag inputted'))

    // birthday: Yup.date().required(ttt('Ng??y sinh kh??ng th??? ????? tr???ng', 'Birthday is required')),
    // phone: Yup.string().required(ttt('??i???n tho???i kh??ng th??? ????? tr???ng', 'Phone number is required')),
    // address: Yup.string().required(ttt('?????a ch??? kh??ng th??? ????? tr???ng', 'Address is required')),
  });

  const methods = useForm<FormValuesProps>({
    resolver: async (data, context, options) => {
      // console.log(data)
      // let a = await (yupResolver(BoardSchema)(data, context, options))
      // console.log(a)
      return yupResolver(BoardSchema)(data, context, options)
    },
    defaultValues: board,
  });

  const _onSubmit = (data: FormValuesProps) => {
    try {
      submitData(data)
    } catch (error) {
      console.error(error);
    }
  }


  return <FormProvider methods={methods}  onSubmit={methods.handleSubmit(_onSubmit)}>
    <Grid container spacing={3}>
    <Grid item xs={12} md={4}>
        <Card sx={{ p: 3 }}>
          <Box sx={{ mb: 5 }}>
            <UploadAvatar
              inprogress={upLoadProgress}
              accept={{ 'image/*': [] }}
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  {ttt('Cho ph??p file:  *.jpeg, *.jpg, *.png, *.gif', 'Allowed *.jpeg, *.jpg, *.png, *.gif')}
                  <br /> {ttt('Dung l?????ng t???i ??a', 'max size of')} {fData(3145728)}
                </Typography>
              }
              file={methods.getValues('logo') || ''}
              onDropAccepted={(files) => {
                setUploadProgress(0)
                getUploadDetails({
                  file: files[0],
                  onProgress: setUploadProgress,
                  onSuccess: (filePath: string) => {
                    setUploadProgress(undefined)
                    console.log('da upload', filePath)
                    methods.setValue('logo', filePath)
                  }
                })
              }}
            />
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'grid',
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
            }}
          >
            <RHFTextField name="name" label={ttt('T??n Board', "Board name")} />
            <RHFSwitch name='deactive' label={ttt('D???ng ho???t ?????ng', "Disable the board")} />
            <RHFTextField name="description" label={ttt('M?? t???', "Description")} />
            <RHFCurrentCenterStaffPickup name='workingStaffs' label={ttt('Th??nh vi??n', "Members")}
              placeholder={ttt('Nh???p username', "input username")}
            />
            <RHFCurrentCenterStaffPickup name='managers' label={ttt('Qu???n tr??? board', "Board Managers")}
              placeholder={ttt('Nh???p username', "input username")}
            />
            <RHFCurrentCenterSingleStaffPickup name='defaultAssignee' label={ttt('nh??n vi??n m???c ?????nh', "Default assignee")}
              placeholder={ttt('Nh???p username', "input username")}
            />
            <RHLabelCreateList name='labels' label={ttt('Danh s??ch tags', 'tags list')} />
          </Box>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {submitText}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  </FormProvider>
}