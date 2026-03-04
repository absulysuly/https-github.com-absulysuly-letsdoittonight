const MAX_POST_LENGTH = 1000

export const sanitizePostContent = (value: string): string => value.replace(/\s+/g, ' ').trim().slice(0, MAX_POST_LENGTH)

