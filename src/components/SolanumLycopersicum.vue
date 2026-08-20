<script setup lang="ts">
import { usePomodoro } from '../composables/usePomodoro'
import { APP_CONFIG } from '../config'
import { useBrowserNotification } from '../composables/useBrowserNotification'

const {
  formattedTime,
  isRunning,
  start,
  pause,
  restore,
  skip,
  pomodoroCount,
  currentStage,
  switchToPomodoro,
  switchToLongBreak,
  switchToShortBreak,
  isPlayerReady
} = usePomodoro()

const {
  toggleNotification,
  requestAndEnableNotification,
  browserNotificationPermission,
  allowedNotification
} = useBrowserNotification()
</script>

<template>
  <header>
    <div v-if="browserNotificationPermission !== 'unsupported'">
      <button
        type="button"
        @click="toggleNotification"
        :hidden="browserNotificationPermission !== 'granted'"
        class="button--only-icon"
      >
        <svg class="header__icon" role="presentation" aria-hidden="true">
          <use
            :href="`${APP_CONFIG.baseUrl}icons.svg#${allowedNotification ? `mdi-bell` : `mdi-bell-off-outline`}`"
          ></use>
        </svg>
        <span class="visually-hidden">Toggle Notifications</span>
      </button>
      <button
        type="button"
        @click="requestAndEnableNotification"
        v-if="browserNotificationPermission !== 'granted'"
        class="button--only-icon header__permission-button"
        :class="{
          'header__permission-button--disabled': browserNotificationPermission === 'denied'
        }"
        :aria-disabled="browserNotificationPermission === 'denied'"
      >
        <small v-if="browserNotificationPermission === 'denied'" class="header__notification-info"
          >Notifications are disabled. Allow them in your browser settings.</small
        >
        <span v-else class="visually-hidden">Allow notifications</span>
        <svg class="header__icon" role="presentation" aria-hidden="true">
          <use :href="`${APP_CONFIG.baseUrl}icons.svg#mdi-bell-cancel-outline`"></use>
        </svg>
      </button>
    </div>
  </header>
  <main id="center">
    <div class="hero">
      <div class="intervals">
        <button
          type="button"
          class="intervals__button"
          :class="{ 'intervals__button--featured': currentStage === 'pomodoro' }"
          :aria-pressed="currentStage === 'pomodoro'"
          @click="switchToPomodoro"
        >
          Pomodoro
        </button>
        <button
          type="button"
          class="intervals__button"
          :class="{ 'intervals__button--featured': currentStage === 'shortBreak' }"
          :aria-pressed="currentStage === 'shortBreak'"
          @click="switchToShortBreak"
        >
          Short Break
        </button>
        <button
          type="button"
          class="intervals__button"
          :class="{ 'intervals__button--featured': currentStage === 'longBreak' }"
          :aria-pressed="currentStage === 'longBreak'"
          @click="switchToLongBreak"
        >
          Long Break
        </button>
      </div>
      <time class="display" role="timer">
        {{ formattedTime }}
      </time>
      <div class="controls">
        <button type="button" @click="restore" class="button--only-icon" :hidden="!isRunning">
          <svg class="controls__icon" role="presentation" aria-hidden="true">
            <use :href="`${APP_CONFIG.baseUrl}icons.svg#mdi-restore`"></use>
          </svg>
          <span class="visually-hidden">Restore</span>
        </button>
        <button
          type="button"
          @click="start"
          class="controls__start-button"
          :disabled="!isPlayerReady"
          :hidden="isRunning"
        >
          {{ isPlayerReady ? 'START' : 'LOADING...' }}
        </button>
        <button
          type="button"
          @click="pause"
          class="controls__start-button"
          :disabled="!isRunning"
          :hidden="!isRunning"
        >
          PAUSE
        </button>
        <button type="button" @click="skip" class="button--only-icon" :hidden="!isRunning">
          <svg class="controls__icon" role="presentation" aria-hidden="true">
            <use :href="`${APP_CONFIG.baseUrl}icons.svg#mdi-skip-next`"></use>
          </svg>
          <span class="visually-hidden">Skip</span>
        </button>
      </div>
    </div>
    <div>
      <p>
        <code>#{{ pomodoroCount }}</code>
      </p>
      <p>Do it!</p>
    </div>
  </main>

  <div class="ticks"></div>

  <section id="next-steps">
    <div id="docs">
      <svg class="icon" role="presentation" aria-hidden="true">
        <use :href="`${APP_CONFIG.baseUrl}icons.svg#documentation-icon`"></use>
      </svg>
      <h2>Solanum Lycopersicum</h2>
      <p>Your pomodoro timer without ads</p>
      <ul>
        <li>
          <a
            rel="noopener noreferrer"
            href="https://www.youtube.com/watch?v=X4VbdwhkE10&list=PL6NdkXsPL07Il2hEQGcLI4dg_LTg7xA2L"
            target="_blank"
          >
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use :href="`${APP_CONFIG.baseUrl}icons.svg#mdi-youtube`"></use>
            </svg>
            Explore playlist
          </a>
        </li>
        <li>
          <a
            rel="noopener noreferrer"
            href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
            target="_blank"
          >
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use :href="`${APP_CONFIG.baseUrl}icons.svg#mdi-wikipedia`"></use>
            </svg>
            Learn more
          </a>
        </li>
      </ul>
    </div>
    <div id="social">
      <svg class="icon" role="presentation" aria-hidden="true">
        <use :href="`${APP_CONFIG.baseUrl}icons.svg#social-icon`"></use>
      </svg>
      <h2>Connect with us</h2>
      <p>Join the Solanum Lycopersicum community</p>
      <ul>
        <li>
          <a
            rel="noopener noreferrer"
            href="https://github.com/edmundoCA/SolanumLycopersicum"
            target="_blank"
          >
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use :href="`${APP_CONFIG.baseUrl}icons.svg#github-icon`"></use>
            </svg>
            GitHub
          </a>
        </li>
      </ul>
    </div>
    <aside class="yt-wrapper">
      <div id="player"></div>
    </aside>
  </section>

  <div class="ticks"></div>
  <section id="spacer"></section>
</template>
