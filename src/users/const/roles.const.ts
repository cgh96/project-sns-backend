export const Roles = {
  /** 관리자 */
  ADMIN: 'ADMIN',
  /** 사용자 */
  USER: 'USER',
} as const;

export type TRoles = (typeof Roles)[keyof typeof Roles];
