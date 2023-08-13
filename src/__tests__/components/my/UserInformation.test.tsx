import type {HTMLAttributes} from "react"
import {render, screen} from "@testing-library/react"
import UserInformation from "@/components/my/UserInformation"
import Storage from "@/store/local-storage"
import {createLocalStorageMock} from "@/__mocks__/window"

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({...props}: HTMLAttributes<HTMLImageElement> & {fill: boolean}) => {
    const newProps = {...props}
    delete (newProps as any).fill

    return <img alt="" {...newProps} />
  },
}))

describe("UserInformation", () => {
  beforeAll(() => {
    createLocalStorageMock()
  })

  afterAll(() => {
    window.localStorage.clear()
  })

  it("profile 이미지를 올바르게 렌더링한다.", () => {
    // given, when
    const PROFILE = "https://profile/"
    Storage.set("profile", PROFILE)

    render(<UserInformation />)

    const image = screen.getByAltText("프로필 이미지") as HTMLImageElement

    // then
    expect(image).toBeInTheDocument()
    expect(image.src).toEqual(PROFILE)
  })

  it("nickName을 올바르게 렌더링한다.", () => {
    // given, when
    Storage.set("nickName", "nickName")

    render(<UserInformation />)

    const image = screen.getByText(/nickName/)

    // then
    expect(image).toBeInTheDocument()
  })

  it("프로필 편집 버튼을 올바르게 렌더링한다.", () => {
    // given, when
    render(<UserInformation />)

    const profileEditButton = screen.getByRole("button", {
      name: "프로필 편집",
    })

    // then
    expect(profileEditButton).toBeInTheDocument()
  })
})