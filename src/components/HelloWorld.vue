<script setup lang="ts">
import viteLogo from '../assets/vite.svg'
import vueLogo from '../assets/vue.svg'

import { useStopwatch } from '../composables/useStopwatch'

const {
  formattedTime,
  isRunning,
  start,
  pause,
  restore,
  skip,
  pomodoroCount,
  baseUrl,
  currentStage,
  isPlayerReady
} = useStopwatch()
</script>

<template>
  <div id="player" class="visually-hidden"></div>
  <main id="center">
    <div class="hero">
      <div class="intervals">
        <button
          type="button"
          class="intervals__button"
          :class="{ 'intervals__button--featured': currentStage === 'pomodoro' }"
        >
          Pomodoro
        </button>
        <button
          type="button"
          class="intervals__button"
          :class="{ 'intervals__button--featured': currentStage === 'shortBreak' }"
        >
          Short Break
        </button>
        <button
          type="button"
          class="intervals__button"
          :class="{ 'intervals__button--featured': currentStage === 'longBreak' }"
        >
          Long Break
        </button>
      </div>
      <div class="display">
        {{ formattedTime }}
      </div>
      <div class="controls">
        <button type="button" @click="restore" class="controls__button" :hidden="!isRunning">
          <svg class="controls__icon" role="presentation" aria-hidden="true">
            <use :href="`${baseUrl}icons.svg#mdi-restore`"></use>
          </svg>
          <span class="visually-hidden">Restore</span>
        </button>
        <button
          type="button"
          @click="start"
          class="controls__button--featured"
          :disabled="!isPlayerReady"
          :hidden="isRunning"
        >
          {{ isPlayerReady ? 'START' : 'LOADING...' }}
        </button>
        <button
          type="button"
          @click="pause"
          class="controls__button--featured"
          :disabled="!isRunning"
          :hidden="!isRunning"
        >
          PAUSE
        </button>
        <button type="button" @click="skip" class="controls__button" :hidden="!isRunning">
          <svg class="controls__icon" role="presentation" aria-hidden="true">
            <use :href="`${baseUrl}icons.svg#mdi-skip-next`"></use>
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
        <use :href="`${baseUrl}icons.svg#documentation-icon`"></use>
      </svg>
      <h2>Solanum Lycopersicum</h2>
      <p>Your pomodoro timer without ads</p>
      <ul>
        <li>
          <a href="https://vite.dev/" target="_blank">
            <img class="logo" :src="viteLogo" alt="" />
            Explore Vite
          </a>
        </li>
        <li>
          <a href="https://vuejs.org/" target="_blank">
            <img class="button-icon" :src="vueLogo" alt="" />
            Learn more
          </a>
        </li>
      </ul>
    </div>
    <div id="social">
      <svg class="icon" role="presentation" aria-hidden="true">
        <use :href="`${baseUrl}icons.svg#social-icon`"></use>
      </svg>
      <h2>Connect with us</h2>
      <p>Join the Solanum Lycopersicum community</p>
      <ul>
        <li>
          <a href="https://github.com/vitejs/vite" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use :href="`${baseUrl}icons.svg#github-icon`"></use>
            </svg>
            GitHub
          </a>
        </li>
      </ul>
    </div>
  </section>

  <div class="ticks"></div>
  <section id="spacer"></section>
</template>
