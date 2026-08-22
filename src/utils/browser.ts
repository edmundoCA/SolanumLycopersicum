export function notify(title: string, text: string) {
  const notification = new Notification(title, {
    body: text,
    icon: '/favicon.ico'
  })

  return notification
}
