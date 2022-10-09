// form
import { useFormContext, Controller } from 'react-hook-form'
// @mui
import { Autocomplete, Chip, TextField, TextFieldProps, Typography } from '@mui/material'
import throttle from 'lodash/throttle'
import React, { ReactNode } from 'react';
import axios from 'axios';
import { IStaffUser } from '@beta-titan/shared/data-types';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
  children?: React.ReactNode;
};

type Props = IProps & TextFieldProps;
interface PropsOptions {
  value: any, label: ReactNode
}

function staffArrayToOptions (staffs: Array<IStaffUser>): Array<PropsOptions> {
  return staffs.map((v:IStaffUser) => {
    return {
      value: v,
      label: (<><Typography color={'CaptionText'}>{v.name} </Typography> | <Typography color={'InfoText'}>{v.username}</Typography> | <Typography color='GrayText'>{v.emailid}</Typography></>)
    }
  })
}
function staffToOption (staff: IStaffUser) {
  return `${staff.username} (${staff.emailid})`
}

export default function RHFCurrentCenterStaffPickup({ name, children, ...other }: Props) {
  const { control } = useFormContext()
  const [options, setOptions] = React.useState<readonly IStaffUser[]>([]);
  const loaded = React.useRef(false)
  const [inputValue, setInputValue] = React.useState('')


  const fetch = React.useMemo(
    () =>
      throttle(
        (
          request: { input: string },
          callback: (results: readonly IStaffUser[]) => void,
        ) => {
          axios({
            method: 'post',
            baseURL: window.location.protocol + '//' + window.location.host,
            url: '/api/v1/users/get-users-info-piecely',
            data: {
              key: request.input,
            },
          }).then(res => {
            if (res.status === 200) {
              if (res.data.error) {
                callback([]);
              } else {
                callback(res.data.data)
              }
            }
          }).catch(e => {
            callback([]);
          })
        },
        1000,
      ),
    [],
  )

  React.useEffect(() => {
    let active = true
    
    if (inputValue === '') {
      setOptions([]);
      return undefined;
    }

    fetch({ input: inputValue }, (results: readonly IStaffUser[]) => {
      if (active) {
        let newOptions: readonly IStaffUser[] = [];
        if (results) {
          newOptions = [...newOptions, ...results];
        }
        setOptions(newOptions);
      }
    });
    
    return () => {
      active = false;
    };
  }, [inputValue, fetch])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          multiple
          id="tags-standard"
          options={options}
          getOptionLabel={(option) => staffToOption(option)}
          // value={value}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderTags={(value: readonly IStaffUser[], getTagProps) =>
            value.map((option: IStaffUser, index: number) => (
              <Chip variant="outlined" label={`${option.username} (${option.emailid})`} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={!!error}
              helperText={error?.message}
              {...other}
            />
          )}
          {...field}
          value={field.value}
          onChange={(e, data) => {
            const _data = [...new Map(data.map((m) => [m._id, m])).values()];
            field.onChange(_data)
          }}
        />
      )}
    />
  );
}
