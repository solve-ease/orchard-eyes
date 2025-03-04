import Alert from './Alert'
import { useAlert } from '../../context/AlertContext'

const AlertContainer = () => {
  const { alerts } = useAlert()

  return (
    <div className='fixed mx-4 top-5 left-0 right-0 z-[1112] flex flex-col items-center pt-4 space-y-2 pointer-events-none'>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          id={alert.id}
          type={alert.type}
          message={alert.message}
        />
      ))}
    </div>
  )
}
export default AlertContainer
