import { Button, CloseButton, Dialog, Field, Input, NativeSelect, Portal } from "@chakra-ui/react"
import * as Yup from 'yup';
import { useFormik } from "formik"
import { toast } from "react-toastify"
import { ServiceError } from "../interface/Error"
import useUserStore from "../store/userStore";
import SuccessToast from "./SuccessToast";
interface UserDialogProps {
  isOpenDialog: boolean
  setOpenDialog: (value: boolean) => void
}


const UserDialog = ({ isOpenDialog, setOpenDialog }: UserDialogProps) => {
  const { createUser } = useUserStore()

  const formik = useFormik({
    initialValues: {
      username: '',
      name: '',
      division: '',
      role: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required.'),
      name: Yup.string().required('Name is required.'),
      division: Yup.string().required('Division is required.'),
      role: Yup.string().required('Role is required.'),
    }),
    onSubmit: async (value) => {
      try {
        await createUser({
          ...value,
        })
        SuccessToast("Create equipment success")
        setOpenDialog(false)
      } catch (error: any) {
        const errorData = error.data as ServiceError
        if (errorData.errorKey === 'USERNAME_IS_ALREADY_EXIST') {
          toast.error('Username is already exist', {
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
        else {
          toast.error('Create or edit user error,please try again', {
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
      }
    },
  });
  return <Dialog.Root lazyMount open={isOpenDialog} size={"lg"}
    onExitComplete={() => {
      formik.resetForm()
    }}>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <form onSubmit={formik.handleSubmit}>
            <Dialog.Header>
              <Dialog.Title>Add new User</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root marginBottom="15px" invalid={!!formik.touched.username && !!formik.errors.username}>
                <Field.Label>Username</Field.Label>
                <Input value={formik?.values?.username} onBlur={formik.handleBlur} onChange={e => { formik.setFieldValue("username", e.currentTarget.value) }} />
                <Field.ErrorText>{formik.errors.username}</Field.ErrorText>
              </Field.Root>
              <Field.Root marginBottom="15px" invalid={!!formik.touched.name && !!formik.errors.name}>
                <Field.Label>Name</Field.Label>
                <Input value={formik?.values?.name} onBlur={formik.handleBlur} onChange={e => { formik.setFieldValue("name", e.currentTarget.value) }} />
                <Field.ErrorText>{formik.errors.name}</Field.ErrorText>
              </Field.Root>
              <Field.Root marginBottom="15px" invalid={!!formik.touched.division && !!formik.errors.division}>
                <Field.Label>Division</Field.Label>
                <Input value={formik?.values?.division} onBlur={formik.handleBlur} onChange={e => { formik.setFieldValue("division", e.currentTarget.value) }} />
                <Field.ErrorText>{formik.errors.division}</Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={!!formik.touched.role && !!formik.errors.role}>
                <Field.Label>Role</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    placeholder="Select role"
                    onBlur={formik.handleBlur}
                    onChange={(e) => formik.setFieldValue("role", e.currentTarget.value)}
                    name="role"
                  >
                    <option value="admin">Admin</option>
                    <option value="operator">Operator</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                <Field.ErrorText>{formik.errors.role}</Field.ErrorText>
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
              </Dialog.ActionTrigger>
              <Button type="submit">Save</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger onClick={() => setOpenDialog(false)}>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
}

export default UserDialog