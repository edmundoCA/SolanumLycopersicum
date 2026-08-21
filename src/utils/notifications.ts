import type { Stage } from '../types'

export function showNotification(stage: Stage) {
  const notification = new Notification('Solanum Lycopersicum', {
    body: `HEY! Your ${stage} is over!`,
    icon: '/favicon.ico'
  })
  return notification
}
