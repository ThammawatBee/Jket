import { extendAuth } from "../service/jket"
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import SuccessToast from "./SuccessToast"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

interface RefreshTokenDialogProps {
  isOpenDialog: boolean
  setOpenDialog: (value: boolean) => void
}

const RefreshTokenDialog = ({ isOpenDialog, setOpenDialog }: RefreshTokenDialogProps) => {
  const navigate = useNavigate()
  const onCancel = () => {
    setOpenDialog(false)
    localStorage.removeItem('expiresAt')
  }
  const onConfirm = async () => {
    try {
      const response = await extendAuth()
      localStorage.setItem('accessToken', response.access_token)
      localStorage.setItem('expiresAt', response.expiresAt.toString())
      SuccessToast(("Extent session success"))
      setOpenDialog(false)
    } catch {
      toast.error('Extent session fail', {
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
      navigate('/login', { replace: true })
    }
  }

  return <Dialog.Root lazyMount
    open={isOpenDialog}
    size={"md"}>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Warning</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            Your session is about to expire.Do you need to extend it?
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger>
              <Button variant="outline" onClick={() => onCancel()}>Cancel</Button>
            </Dialog.ActionTrigger>
            <Dialog.ActionTrigger>
              <Button onClick={() => onConfirm()}>Confirm</Button>
            </Dialog.ActionTrigger>
          </Dialog.Footer>
          <Dialog.CloseTrigger onClick={() => onCancel()}>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
}

export default RefreshTokenDialog