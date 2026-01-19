import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector((state) => state.notification)

  if (message === null) {
    return null
  }

  return <div>{message}</div>
}

export default Notification
