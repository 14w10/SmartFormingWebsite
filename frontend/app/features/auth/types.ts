interface AuthParam {
  /** @default `privateOnly` */
  pageType?: 'publicOnly' | 'privateOnly';
  roles?: UserRole[];
}

export type AuthParams = AuthParam | AuthParam[];
