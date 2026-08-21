import { ref, onMounted } from 'vue'

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

  return {
    browserNotificationPermission,
    allowedNotification,
    toggleNotification,
    requestAndEnableNotification
  }
}
