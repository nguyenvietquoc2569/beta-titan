// form
import { useFormContext, Controller, Control, useWatch } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps } from '@mui/material';
import { getCitiesOption, getDistristOption, getWardOption } from '../../utils/location/locationUtils';
import { useEffect, useMemo, useState } from 'react';

// ----------------------------------------------------------------------

type IProps = {
  provinceName: string,
  provinceLabel: string,
  districtName: string,
  districtLabel: string,
  wardname: string,
  wardlabel: string,
};

type Props = IProps & TextFieldProps;

export default function RHFSelectAddress({ ...other }: Props) {
  const { control } = useFormContext();
  const {
    provinceName,
    provinceLabel,
    districtName,
    districtLabel,
    wardname,
    wardlabel,
  } = other

  const city = useWatch({
    control: control,
    name: provinceName
  })

  const district = useWatch({
    control: control,
    name: districtName
  })

  const ward = useWatch({
    control: control,
    name: wardname
  })

  console.log(city, district, ward)

  const [districtOptions, setDistrictOptions] = useState<Array<{value: string, label: string}>>([])
  useEffect(() => {
    getDistristOption(city).then(options => {
      setDistrictOptions(options)
    })
  }, [city])

  const [wardOptions, setWardOptions] = useState<Array<{value: string, label: string}>>([])
  useEffect(() => {
    getWardOption(city, district).then(options => {
      setWardOptions(options)
    })
  }, [city, district])


  return (
    <>
    <Controller
      name={provinceName}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{ native: true }}
          error={!!error}
          helperText={error?.message}
          label={provinceLabel}
          {...other}
        >
          {getCitiesOption().map((_city) => (
                <option key={_city.value} value={_city.value}>
                  {_city.label}
                </option>
              ))}
        </TextField>
      )}
    />
    <Controller
      name={districtName}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{ native: true }}
          error={!!error}
          helperText={error?.message}
          label={districtLabel}
          {...other}
        >
          {districtOptions.map((city) => (
            <option selected={district===city.value} key={city.value} value={city.value}>
              {city.label}
            </option>
          ))}
        </TextField>
      )}
    />
    <Controller
      name={wardname}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{ native: true }}
          error={!!error}
          helperText={error?.message}
          label={wardlabel}
          {...other}
        >
          {wardOptions.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
        </TextField>
      )}
    />
    </>
  );
}
