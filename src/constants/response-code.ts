export const UNAUTHORIZED = 0

export const SIGN_UP = {
  SUCCESS: 1001,
  DUPLICATED_ID: 1011,
  DIFFERENT_PASSWORDS: 1012,
  INVALID_PASSWORD: 1013,
} as const

export const SIGN_IN = {
  SUCCESS: 1101,
  NONEXISTENT_ID: 1111,
  INVALID_PASSWORD: 1112,
} as const
