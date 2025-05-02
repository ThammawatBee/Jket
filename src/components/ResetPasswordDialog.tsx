/* eslint-disable no-lone-blocks */
import * as Yup from 'yup';
import { useFormik } from "formik"
import { toast } from "react-toastify"
import SuccessToast from './SuccessToast';
import useAuthStore from '../store/authStore';
import { Button, Dialog, Field, Input, Portal } from '@chakra-ui/react';

interface ResetPasswordDialogProps {
  isOpenDialog: boolean
  setOpenDialog: (value: boolean) => void
}


const ResetPasswordDialog = ({ isOpenDialog, setOpenDialog }: ResetPasswordDialogProps) => {
  const { resetPassword } = useAuthStore()
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Password is required.')
        .min(8, 'Password must be at least 8 characters.')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .matches(/[0-9]/, 'Password must contain at least one number.')
        .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.'),
    }),
    onSubmit: async (value) => {
      try {
        await resetPassword(value.password)
        SuccessToast(("Reset password success"))
        setOpenDialog(false)
      } catch (error: any) {
        toast.error('Reset password error,please try again', {
          style: { color: '#18181B' },
          position: "top-right",
          autoClose: 3500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    },
  });

  return <Dialog.Root lazyMount
    open={isOpenDialog}
    size={"lg"}
    onExitComplete={() => {
      formik.resetForm()
    }}>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <form onSubmit={formik.handleSubmit}>
            <Dialog.Header>
              <Dialog.Title>Reset Password</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root marginBottom="15px" invalid={!!formik.touched.password && !!formik.errors.password}>
                <Field.Label>Password</Field.Label>
                <Input value={formik?.values?.password} onBlur={formik.handleBlur} onChange={e => { formik.setFieldValue("password", e.currentTarget.value) }} />
                <Field.ErrorText>{formik.errors.password}</Field.ErrorText>
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Button type="submit">Submit</Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
}

export default ResetPasswordDialog