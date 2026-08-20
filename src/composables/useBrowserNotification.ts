import { ref, onMounted } from 'vue'
import type { Stage } from './usePomodoro'

export type BrowserNotificationPermission = NotificationPermission | 'unsupported'
const browserNotificationPermission = ref<BrowserNotificationPermission>('default')
const allowedNotification = ref<boolean>(false)

export function useBrowserNotification() {
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
    allowedNotification.value = !allowedNotification.value
  }

  async function requestAndEnableNotification() {
    await requestPermission()

    if (browserNotificationPermission.value === 'granted') allowedNotification.value = true
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
    showNotification,
    requestAndEnableNotification
  }
}
