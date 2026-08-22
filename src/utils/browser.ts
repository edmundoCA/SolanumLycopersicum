import { APP_CONFIG } from '../config'

export function notify(title: string, text: string) {
  const notification = new Notification(title, {
    body: text,
    icon: `${APP_CONFIG.baseUrl}favicon.svg`
  })

  return notification
}
