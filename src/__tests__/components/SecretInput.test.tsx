import {render, screen, fireEvent} from "@testing-library/react"
import {SecretInput} from "@/components"

jest.mock("../../assets/icons/index.ts", () => ({
  __esModule: true,
  EyeClose: () => <svg>eye-close</svg>,
  EyeOpen: () => <svg>eye-open</svg>,
}))

describe("SecretInput", () => {
  it("input 타입이 password이며 EyeOpen 아이콘을 렌더링한다.", () => {
    // given, when
    const testId = "input"

    render(<SecretInput data-testid={testId} />)

    const input = screen.getByTestId(testId) as HTMLInputElement
    const eyeOpenIcon = screen.getByText("eye-open")

    // then
    expect(input).toBeInTheDocument()
    expect(input.type).toEqual("password")
    expect(eyeOpenIcon).toBeInTheDocument()
  })

  it("EyeOpen 아이콘 Wrapper을 누르면 input 타입이 text이며 EyeClose 아이콘을 렌더링한다.", async () => {
    // given
    render(<SecretInput />)

    const eyeOpenIconWrapper = screen
      .getByText("eye-open")
      .closest("div") as HTMLElement

    // when
    fireEvent.click(eyeOpenIconWrapper)

    const eyeCloseIcon = await screen.findByText("eye-close")

    // then
    expect(eyeCloseIcon).toBeInTheDocument()
  })

  it("input의 값이 올바르게 바뀐다.", () => {
    // given
    const initialValue = "test1"
    const nextValue = "test2"
    const testId = "input"

    render(
      <SecretInput
        defaultValue={initialValue}
        onChange={jest.fn()}
        data-testid={testId}
      />
    )

    const input = screen.getByTestId(testId) as HTMLInputElement

    expect(input.value).toEqual(initialValue)

    // when
    fireEvent.change(input, {
      target: {
        value: nextValue,
      },
    })

    // then
    expect(input.value).toEqual(nextValue)
  })
})
