import { useDispatch } from 'react-redux'
import { addToast } from '../../store/slices/toasts'

export const useToast = () => {
  const dispatch = useDispatch()

  return {
    showToast: ({ message, type = 'info', duration = 3000 }) => {
      dispatch(addToast({ message, type, duration }))
    }
  }
}