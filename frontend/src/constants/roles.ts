export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.USER]: "User",
  [USER_ROLES.ADMIN]: "Administrator",
};

