import {render, screen, fireEvent} from "@testing-library/react"
import Redirection from "@/components/rolling-paper/edit/Redirection"
import {useRouter} from "next/navigation"
import {TProps as TPortalProps} from "@/components/Portal"
import {ROUTE} from "@/constants/service"

const REDIRECTING = "redirecting"
const SHARING_CODE = "test"

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
  useParams: jest.fn(() => ({
    sharingCode: "test",
  })),
}))
jest.mock("../../../../../components/Redirecting.tsx", () => ({
  __esModule: true,
  default: () => <div>{REDIRECTING}</div>,
}))
jest.mock("../../../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))

describe("Redirection", () => {
  it("Redirecting과 '올바른 공유코드가 아닙니다: ${공유코드}'를 띄운 얼럿이 렌더링된다.", () => {
    // given, when
    render(<Redirection />)

    const redirecting = screen.getByText(REDIRECTING)
    const flowAlert = screen.getByText(
      `올바른 공유코드가 아닙니다: ${SHARING_CODE}`
    )

    // then
    expect(redirecting).toBeInTheDocument()
    expect(flowAlert).toBeInTheDocument()
  })

  it("얼럿의 '확인' 버튼 클릭 시 얼럿이 마이 페이지로 리다이렉트된다.", () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })

    render(<Redirection />)

    const okButton = screen.getByText("확인")

    // when
    fireEvent.click(okButton)

    // then
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })
})
