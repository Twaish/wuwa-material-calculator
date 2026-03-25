export const Tags = {
  OWNED: 'owned',
  FAVORITE: 'favorite',
} as const

export type Tag = (typeof Tags)[keyof typeof Tags]
