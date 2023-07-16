import {render, screen, fireEvent} from "@testing-library/react"
import ConfirmedPopUp, {
  type TProps as TConfirmedPopUpProps,
} from "@/components/app/ConfirmedPopUp"
import type {TProps as TSecretInputProps} from "@/components/SecretInput"
import {post} from "@/api"
import {
  validUserId as testUserId,
  validPassword as testPassword,
  invalidEmails,
} from "@/__mocks__/fixtures/input"

jest.mock("../../../api", () => ({
  __esModule: true,
  post: jest.fn(),
}))

jest.mock("../../../components/SecretInput", () => ({
  __esModule: true,
  default: ({inputRef, ...props}: Omit<TSecretInputProps, "size">) => (
    <input className="password" ref={inputRef} {...props} />
  ),
}))

function renderConfirmedPopUp({
  isAlerting = true,
  userId = testUserId,
  password = testPassword,
  onClose = jest.fn(),
  onSubmit = jest.fn(),
}: Partial<TConfirmedPopUpProps>) {
  render(
    <ConfirmedPopUp
      isAlerting={isAlerting}
      userId={userId}
      password={password}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}

describe("ConfirmedPopUp", () => {
  let windowAlertMock: jest.SpyInstance

  beforeAll(() => {
    windowAlertMock = jest.spyOn(window, "alert").mockImplementation()
  })

  afterAll(() => {
    windowAlertMock.mockRestore()
  })

  it("유저 아이디는 변경이 불가능하다.", () => {
    // given, when
    renderConfirmedPopUp({})

    const userIdInput = screen.getByDisplayValue(testUserId) as HTMLInputElement

    // then
    expect(userIdInput.disabled).toBeTruthy()
  })

  it("재확인용 비밀번호는 변경이 가능하다.", () => {
    // given, when
    renderConfirmedPopUp({})

    const confirmedPasswordInput = screen.getAllByDisplayValue(
      ""
    )[0] as HTMLInputElement

    // then
    expect(confirmedPasswordInput.disabled).toBeFalsy()
  })

  it("이메일은 변경이 가능하다.", () => {
    // given, when
    renderConfirmedPopUp({})

    const emailInput = screen.getAllByDisplayValue("")[1] as HTMLInputElement

    // then
    expect(emailInput.disabled).toBeFalsy()
  })

  it("취소와 가입하기 버튼이 렌더링된다.", () => {
    // given, when
    renderConfirmedPopUp({})

    const cancelButton = screen.getByRole("button", {
      name: "취소",
    })
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // then
    expect(cancelButton).toBeInTheDocument()
    expect(signUpButton).toBeInTheDocument()
  })

  it("기존에 입력한 비밀번호와 확인용 비밀번호가 다르면 API를 호출하지 않고, alert를 호출한다", () => {
    // given
    renderConfirmedPopUp({})

    const confirmedPasswordInput = screen.getAllByDisplayValue(
      ""
    )[0] as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    ;(post as jest.Mock).mockResolvedValueOnce({
      message: "",
      code: 0,
    })

    // when
    fireEvent.change(confirmedPasswordInput, {
      target: {value: "wrong-password"},
    })
    fireEvent.click(signUpButton)

    // then
    expect(post).not.toBeCalled()
    expect(windowAlertMock).toBeCalled()
  })

  it("이메일 형식이 다르면 API를 호출하지 않고, alert를 호출한다.", () => {
    // given
    renderConfirmedPopUp({})
    ;(post as jest.Mock).mockResolvedValueOnce({
      message: "",
      code: 0,
    })

    const confirmedPasswordInput = screen.getAllByDisplayValue(
      ""
    )[0] as HTMLInputElement
    const emailInput = screen.getAllByDisplayValue("")[1] as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(confirmedPasswordInput, {
      target: {value: testPassword},
    })

    invalidEmails.forEach((email) => {
      fireEvent.change(emailInput, {
        target: {value: email},
      })
      fireEvent.click(signUpButton)

      // then
      expect(post).not.toBeCalled()
      expect(windowAlertMock).toBeCalled()
    })
  })

  it("취소 버튼을 누르면 onClose가 호출된다.", () => {
    // given
    const onClose = jest.fn()

    renderConfirmedPopUp({onClose})

    const cancelButton = screen.getByRole("button", {
      name: "취소",
    })

    // when
    fireEvent.click(cancelButton)

    // then
    expect(onClose).toBeCalled()
  })

  // TODO: validEmails 기획 나온 뒤에 추가
})