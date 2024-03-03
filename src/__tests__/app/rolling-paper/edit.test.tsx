import {render, screen} from "@testing-library/react"
import RollingPaperEdit from "@/app/rolling-paper/edit/[sharingCode]/page"
import {redirect} from "next/navigation"
import {ROUTE} from "@/constants/service"
import {createFetchMock, deleteFetchMock} from "@/__mocks__/window"
import {ROLLING_PAPER} from "@/constants/response-code"

const HEADER = "Header"
const REDIRECTION = "Redirection"
const CANVAS = "Canvas"

jest.mock("next/navigation", () => ({
  __esModule: true,
  redirect: jest.fn(),
}))
jest.mock("../../../components/Header.tsx", () => ({
  __esModule: true,
  default: () => <>{HEADER}</>,
}))
jest.mock("../../../components/rolling-paper/edit/Redirection.tsx", () => ({
  __esModule: true,
  default: () => <>{REDIRECTION}</>,
}))
jest.mock("../../../components/rolling-paper/edit/Canvas.tsx", () => ({
  __esModule: true,
  default: () => <>{CANVAS}</>,
}))

describe("RollingPaperEdit", () => {
  afterEach(() => {
    deleteFetchMock()
    jest.clearAllMocks()
  })

  it("공유코드가 존재하지 않으면 마이 페이지로 이동한다.", async () => {
    // given, when
    createFetchMock(
      jest.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            code: ROLLING_PAPER.INVITATION_CODE.QUERY_FAILURE,
            data: {id: "1"},
          }),
      })
    )

    render(await RollingPaperEdit({params: {sharingCode: "test"}}))

    // then
    expect(redirect).toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })

  it("공유코드가 존재하고 올바른 프로젝트 아이디면 헤더와 Canvas를 렌더링한다.", async () => {
    // given, when
    createFetchMock(
      jest.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            code: ROLLING_PAPER.INVITATION_CODE.QUERY_SUCCESS,
            data: {id: "1"},
          }),
      })
    )

    render(await RollingPaperEdit({params: {sharingCode: "test"}}))

    const header = screen.getByText(new RegExp(HEADER))
    const canvas = screen.getByText(new RegExp(CANVAS))

    // then
    expect(header).toBeInTheDocument()
    expect(canvas).toBeInTheDocument()
  })

  it("공유코드가 존재하지만 올바른 프로젝트 아이디가 아니면 Redirection를 렌더링한다.", async () => {
    // given, when
    createFetchMock(
      jest.fn().mockImplementation((url: string) => {
        if (url.includes("invite-code")) {
          return {
            json: () =>
              Promise.resolve({
                code: ROLLING_PAPER.INVITATION_CODE.QUERY_SUCCESS,
                data: {id: "1", destination: "", type: ""},
              }),
          }
        } else {
          return {
            json: () =>
              Promise.resolve({
                code: ROLLING_PAPER.INVITATION_CODE.QUERY_FAILURE,
                data: {},
              }),
          }
        }
      })
    )

    render(await RollingPaperEdit({params: {sharingCode: "test"}}))

    const redirection = screen.getByText(new RegExp(REDIRECTION))

    // then
    expect(redirection).toBeInTheDocument()
  })
})
