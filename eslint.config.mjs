import { defaultConfig } from '@trickfilm400/eslint-shared-config';

export default [...defaultConfig, {
  rules: {
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
}];