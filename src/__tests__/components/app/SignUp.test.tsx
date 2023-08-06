import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import SignUp from "@/components/app/SignUp"
import type {TProps as TSecretInputProps} from "@/components/SecretInput"
import type {TProps as TPortalProps} from "@/components/Portal"
import {
  validUserId,
  invalidUserIds,
  validPassword,
  invalidPasswords,
} from "@/__mocks__/fixtures/input"

const confirmedPopUpTitle = /정보를 확인해주세요/

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))

jest.mock("../../../components/SecretInput.tsx", () => ({
  __esModule: true,
  default: ({inputRef, ...props}: Omit<TSecretInputProps, "size">) => (
    <input className="password" ref={inputRef} {...props} />
  ),
}))

jest.mock("../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))

describe("SignUp", () => {
  let alertMock: jest.SpyInstance

  beforeEach(() => {
    alertMock = jest.spyOn(window, "alert").mockImplementation(() => {})
  })

  afterEach(() => {
    alertMock.mockRestore()
  })

  it("유저 아이디 인풋, 유저 비밀번호 인풋, 회원가입 버튼을 올바르게 렌더링한다.", async () => {
    // given, when
    render(<SignUp />)

    const userIdInput = screen.getByPlaceholderText("나만의 ID로 시작하기")
    const passwordInput = screen.getByPlaceholderText("나만의 PW로 시작하기")
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // then
    await waitFor(() => {
      expect(userIdInput).toBeInTheDocument()
      expect(passwordInput).toBeInTheDocument()
      expect(signUpButton).toBeInTheDocument()
    })
  })

  it("유저 아이디가 올바르게 변경된다.", async () => {
    // given
    render(<SignUp />)

    const userId = "test1234"
    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement

    // when
    fireEvent.change(userIdInput, {
      target: {value: userId},
    })

    // then
    await waitFor(() => {
      expect(userIdInput.value).toEqual(userId)
    })
  })

  it("유저 비밀번호가 올바르게 변경된다.", async () => {
    // given
    render(<SignUp />)

    const password = "test1234"
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement

    // when
    fireEvent.change(passwordInput, {
      target: {value: password},
    })

    // then
    await waitFor(() => {
      expect(passwordInput.value).toEqual(password)
    })
  })

  it("유저 아이디를 입력하지 않으면 alert를 호출한다.", async () => {
    // given
    render(<SignUp />)

    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.click(signUpButton)

    // then
    await waitFor(() => {
      expect(alertMock).toBeCalledWith(
        "ID가 입력되지 않았습니다. 다시 한 번 확인해 주세요."
      )
    })
  })

  it("유저 아이디를 입력하지 않으면 ConfirmedPopUp을 렌더링하지 않는다.", async () => {
    // given
    render(<SignUp />)

    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.click(signUpButton)

    // then
    await waitFor(() => {
      const confirmedPopUp = screen.queryByText(confirmedPopUpTitle)

      expect(confirmedPopUp).not.toBeInTheDocument()
    })
  })

  it("유저 아이디를 입력해도 유저 비밀번호를 입력하지 않으면 alert를 호출한다.", async () => {
    // given
    render(<SignUp />)

    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(userIdInput, {
      target: {value: validUserId},
    })
    fireEvent.click(signUpButton)

    // then
    await waitFor(() => {
      expect(alertMock).toBeCalledWith(
        "PW가 입력되지 않았습니다. 다시 한 번 확인해 주세요."
      )
    })
  })

  it("유저 아이디를 입력해도 유저 비밀번호를 입력하지 않으면 ConfirmedPopUp을 렌더링하지 않는다.", async () => {
    // given
    render(<SignUp />)

    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(userIdInput, {
      target: {value: validUserId},
    })
    fireEvent.click(signUpButton)

    // then
    await waitFor(() => {
      const confirmedPopUp = screen.queryByText(confirmedPopUpTitle)

      expect(confirmedPopUp).not.toBeInTheDocument()
    })
  })

  it("유저 아이디 형식이 다르면 alert를 호출한다.", async () => {
    // given
    render(<SignUp />)

    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(passwordInput, {
      target: {value: validPassword},
    })

    for (const userId of invalidUserIds) {
      fireEvent.change(userIdInput, {
        target: {value: userId},
      })
      fireEvent.click(signUpButton)
    }

    // then
    await waitFor(() => {
      expect(alertMock).toBeCalledTimes(invalidUserIds.length)
      expect(alertMock).toBeCalledWith(
        "영문, 숫자, 특수문자만 사용 가능합니다."
      )
    })
  })

  it("유저 아이디 형식이 다르면 ConfirmedPopUp을 렌더링하지 않는다.", async () => {
    // given
    render(<SignUp />)

    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(passwordInput, {
      target: {value: validPassword},
    })

    for (const userId of invalidUserIds) {
      fireEvent.change(userIdInput, {
        target: {value: userId},
      })
      fireEvent.click(signUpButton)

      // then
      await waitFor(() => {
        const confirmedPopUp = screen.queryByText(confirmedPopUpTitle)

        expect(confirmedPopUp).not.toBeInTheDocument()
      })
    }
  })

  it("유저 비밀번호 형식이 다르면 alert를 호출한다.", async () => {
    // given
    render(<SignUp />)

    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(userIdInput, {
      target: {value: validUserId},
    })

    for (const password of invalidPasswords) {
      fireEvent.change(passwordInput, {
        target: {value: password},
      })
      fireEvent.click(signUpButton)
    }

    // then
    await waitFor(() => {
      expect(alertMock).toBeCalledTimes(invalidPasswords.length)
      expect(alertMock).toBeCalledWith(
        "안전을 위해 영문, 숫자, 특수문자를 혼합해서 설정해 주세요."
      )
    })
  })

  it("유저 비밀번호 형식이 다르면 ConfirmedPopUp을 렌더링하지 않는다.", async () => {
    // given
    render(<SignUp />)

    const userIdInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(userIdInput, {
      target: {value: validUserId},
    })

    for (const password of invalidPasswords) {
      fireEvent.change(passwordInput, {
        target: {value: password},
      })
      fireEvent.click(signUpButton)

      // then
      await waitFor(() => {
        const confirmedPopUp = screen.queryByText(confirmedPopUpTitle)

        expect(confirmedPopUp).not.toBeInTheDocument()
      })
    }
  })

  it("유저 아이디와 유저 비밀번호 형식이 올바르면 alert를 호출하지 않는다.", async () => {
    // given
    render(<SignUp />)

    const userIddInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(userIddInput, {
      target: {value: validUserId},
    })
    fireEvent.change(passwordInput, {
      target: {value: validPassword},
    })
    fireEvent.click(signUpButton)

    await waitFor(() => {
      // then
      expect(alertMock).not.toBeCalled()
    })
  })

  it("유저 아이디와 유저 비밀번호 형식이 올바르면 ConfirmedPopUp을 렌더링한다.", async () => {
    // given
    render(<SignUp />)

    const userIddInput = screen.getByPlaceholderText(
      "나만의 ID로 시작하기"
    ) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      "나만의 PW로 시작하기"
    ) as HTMLInputElement
    const signUpButton = screen.getByRole("button", {
      name: "가입하기",
    })

    // when
    fireEvent.change(userIddInput, {
      target: {value: validUserId},
    })
    fireEvent.change(passwordInput, {
      target: {value: validPassword},
    })
    fireEvent.click(signUpButton)

    await waitFor(() => {
      // then
      const confirmedPopUp = screen.getByText(confirmedPopUpTitle)

      expect(confirmedPopUp).toBeInTheDocument()
    })
  })
})
