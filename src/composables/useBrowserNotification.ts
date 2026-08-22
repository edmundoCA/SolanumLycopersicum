import { ref, onMounted } from 'vue'
import { notify } from '../utils/browser'

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
    allowedNotification.value = !allowedNotification.value
  }

  async function requestAndEnableNotification() {
    const wasDefault = browserNotificationPermission.value === 'default'

    await requestPermission()

    const wasPermissionSilentlySurpressed =
      wasDefault && browserNotificationPermission.value === 'default'

    if (wasPermissionSilentlySurpressed) {
      browserNotificationPermission.value = 'denied'
      return
    }

    if (browserNotificationPermission.value === 'granted') allowedNotification.value = true
  }

  function notifyIfAllowed(title: string, text: string) {
    if (browserNotificationPermission.value !== 'granted' || !allowedNotification.value) return
    notify(title, text)
  }

  return {
    browserNotificationPermission,
    allowedNotification,
    toggleNotification,
    notifyIfAllowed,
    requestAndEnableNotification
  }
}
