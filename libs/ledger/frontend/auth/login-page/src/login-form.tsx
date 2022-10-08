import * as Yup from 'yup';
import { useState } from 'react';
// next
import NextLink from 'next/link';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
// import { PATH_AUTH } from '../../../routes/paths';
// hooks
// import useAuth from '../../../hooks/useAuth';
// import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
// import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox, Iconify } from '@beta-titan/ledger/frontend/utilities/core-components';
import { fetcher } from '@beta-titan/ledger/frontend/utilities/shared';

type FormValuesProps = {
  email: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};

export function LoginForm({
  onSuccess
}: {
  onSuccess: () => void
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false)
  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Username/Email is required'),
    password: Yup.string().required('Password is required'),
  });
  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    setLoading(true)
    fetcher('/api/auth/login', {
      body: JSON.stringify({
        username: data.email,
        password: data.password
      })
    }).then(({code,data}) => {
      setLoading(false)
      if (code === 400) {
        setError('afterSubmit', { ...new Error(), message: 'Bad request - 400' })
      }
      if (code === 0) {
        setError('afterSubmit', { ...new Error(), message: data.message })
      }
      if (code === 405) {
        setError('afterSubmit', { ...new Error(), message: "You already login, Please log out before relogging in" })
      }
      if (code === 403) {
        setError('afterSubmit', { ...new Error(), message: "Bad credential. Please try again"})
      }
      if (code === 200) {
        //successfully
        onSuccess()
      }
    })

    try {
      // await login(data.email, data.password);
    } catch (error) {
      console.error(error);

      reset();

      // if (isMountedRef.current) {
      //   setError('afterSubmit', { ...error, message: error.message });
      // }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email / Username" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isLoading}
      >
        Login
      </LoadingButton>
    </FormProvider>
  )

}