import { fData, FormProvider, RHFCurrentCenterStaffPickup, RHFTextField, RHLabelCreateList, UploadAvatar } from '@beta-titan/ledger/frontend/utilities/core-components'
import { Box, Card, Grid, Typography } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { useLangContext } from '@beta-titan/ledger/frontend/utilities/ui-layout-fe'
import { IKanbanBoard } from '@beta-titan/shared/data-types'
import { useState } from 'react'
import axios from 'axios'
import * as CryptoJS from 'crypto-js';
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const sanitize = require("sanitize-filename")

type FormValuesProps = IKanbanBoard
interface Props {
  board: IKanbanBoard
}

export const BoardEditUI = ({board}: Props) => {
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
    name: Yup.string().required(ttt('Tên không thể để trống', 'Name is required')),
    description: Yup.string().required(ttt('Chú giải không thể để trống', 'Description is required')),
    birthday: Yup.date().required(ttt('Ngày sinh không thể để trống', 'Birthday is required')),
    phone: Yup.string().required(ttt('Điện thoại không thể để trống', 'Phone number is required')),
    address: Yup.string().required(ttt('Địa chỉ không thể để trống', 'Address is required')),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(BoardSchema),
    defaultValues: board,
  });

  const _onSubmit = (data: FormValuesProps) => {
    console.log('test')
    try {
      onSubmit(data)
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
                  {ttt('Cho phép file:  *.jpeg, *.jpg, *.png, *.gif', 'Allowed *.jpeg, *.jpg, *.png, *.gif')}
                  <br /> {ttt('Dung lượng tối đa', 'max size of')} {fData(3145728)}
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
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <RHFTextField name="name" label={ttt('Tên Board', "Board name")} />
            <RHFTextField name="description" label={ttt('Mô tả', "Description")} />
            <RHFCurrentCenterStaffPickup name='workingStaffs' label={ttt('Thành viên', "Members")}
              placeholder={ttt('Nhập username', "input username")}
            />
            <RHFCurrentCenterStaffPickup name='managers' label={ttt('Quản trị board', "Board Managers")}
              placeholder={ttt('Nhập username', "input username")}
            />
            <RHLabelCreateList name='labels' label={ttt('Danh sách tags', 'tags list')} />
          </Box>
        </Card>
      </Grid>
    </Grid>
  </FormProvider>
}