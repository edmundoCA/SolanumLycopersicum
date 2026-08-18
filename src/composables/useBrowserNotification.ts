import { ref, onMounted } from 'vue'
import type { Stage } from './usePomodoro'

export type BrowserNotificationPermission = NotificationPermission | 'unsupported'

export function useBrowserNotification() {
  const browserNotificationPermission = ref<BrowserNotificationPermission>('default')
  const allowedNotification = ref<boolean>(false)

  onMounted(() => {
    if ('Notification' in window) {
      browserNotificationPermission.value = Notification.permission
    } else {
      browserNotificationPermission.value = 'unsupported'
    }
  })

  async function requestPermission() {
    if (browserNotificationPermission.value === 'unsupported') return
    if (Notification.permission === 'granted') {
      browserNotificationPermission.value = 'granted'
      return
    }
    browserNotificationPermission.value = await Notification.requestPermission()
  }

  async function toggleNotification() {
    if (allowedNotification.value) {
      allowedNotification.value = false
      return
    }

    await requestPermission()
    allowedNotification.value = browserNotificationPermission.value === 'granted'
  }

  function showNotification(stage: Stage) {
    const notification = new Notification('Solanum Lycopersicum', {
      body: `HEY! Your ${stage} is over!`,
      icon: '/favicon.ico'
    })
    return notification
  }

  return {
    browserNotificationPermission,
    allowedNotification,
    toggleNotification,
    showNotification
  }
}
