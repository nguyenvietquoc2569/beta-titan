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

function staffToOption (staff: IStaffUser) {
  return `${staff.username} (${staff.emailid})`
}

export default function RHFCurrentCenterSingleStaffPickup({ name, children, ...other }: Props) {
  const { control } = useFormContext()
  const [options, setOptions] = React.useState<readonly IStaffUser[]>([]);
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
          id="single_people_pick_up"
          options={options}
          getOptionLabel={(option) => staffToOption(option)}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
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
            field.onChange(data)
          }}
        />
      )}
    />
  );
}
