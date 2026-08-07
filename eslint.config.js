import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    files: ['**/*.{js,ts,mts,tsx,vue}']
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**', '.github/**']
  },

  ...pluginVue.configs['flat/essential'],

  ...vueTsEslintConfig(),

  skipFormatting
]
