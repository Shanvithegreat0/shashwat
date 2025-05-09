import React, { useEffect } from 'react'
import { Alert, Snackbar, Stack } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { removeToast } from '../../store/slices/toasts'

const ToastContainer = () => {
  const dispatch = useDispatch()
  const toasts = useSelector(state => state.toast.toasts)

  useEffect(() => {
    toasts.forEach(toast => {
      setTimeout(() => {
        dispatch(removeToast(toast.id))
      }, toast.duration)
    })
  }, [toasts, dispatch])

  return (
    <Stack spacing={2} sx={{ position: 'fixed', top: 64, right: 24, width: 'auto', zIndex: 1205 }}>
      {toasts.map(toast => (
        <Snackbar
          key={toast.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => dispatch(removeToast(toast.id))}
            severity={toast.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  )
}

export default ToastContainer