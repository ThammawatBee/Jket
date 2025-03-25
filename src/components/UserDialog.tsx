import { Button, CloseButton, Dialog, Field, Input, NativeSelect, Portal } from "@chakra-ui/react"

interface UserDialogProps {
  isOpenDialog: boolean
  setOpenDialog: (value: boolean) => void
}

const UserDialog = ({ isOpenDialog, setOpenDialog }: UserDialogProps) => {
  return <Dialog.Root lazyMount open={isOpenDialog} size={"lg"}>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Add new User</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Field.Root marginBottom="15px">
              <Field.Label>Username</Field.Label>
              <Input name="username" />
            </Field.Root>
            <Field.Root marginBottom="15px">
              <Field.Label>Name</Field.Label>
              <Input name="name" />
            </Field.Root>
            <Field.Root marginBottom="15px">
              <Field.Label>Division</Field.Label>
              <Input name="division" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Role</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  placeholder="Select role"
                >
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            </Dialog.ActionTrigger>
            <Button onClick={() => setOpenDialog(false)}>Save</Button>
          </Dialog.Footer>
          <Dialog.CloseTrigger onClick={() => setOpenDialog(false)}>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
}

export default UserDialog