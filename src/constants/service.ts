export const OPEN = "open"

export const ALL_PROJECTS = "all-projects"

export const ALL_RECEIVED_ROLLING_PAPERS = "all-received-rolling-papers"

export const PROFILE_EDIT = "edit"

export const ROUTE = {
  MAIN: "/",
  MY_PAGE: "/my",
  MY_SETTING: "/my/setting",
  MY_SETTING_PROFILE: `/my/setting?${OPEN}=${PROFILE_EDIT}`,
  MY_PROJECTS: `/my?${OPEN}=${ALL_PROJECTS}`,
  MY_ROLLING_PAPERS: `/my?${OPEN}=${ALL_RECEIVED_ROLLING_PAPERS}`,
  OAUTH_MIDDLEWARE: "/oauth-middleware",
  ACCOUNT_INQUIRY: "/account-inquiry",
  ROLLING_PAPER_CREATION: "/rolling-paper/creation",
  ROLLING_PAPER_EDIT: "/rolling-paper/edit",
  ROLLING_PAPER_VIEW: "/rolling-paper/view",
} as const

export const DOMAIN = "http://letterszip.online" // TODO: ssl 적용하면 변경
