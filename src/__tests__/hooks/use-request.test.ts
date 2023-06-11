import {renderHook} from "@testing-library/react-hooks" // react 17 warning 발생
import useRequest from "@/hooks/use-request"
import request from "@/api"

jest.mock("../../api", () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe("useRequest", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("처음에는 초기 state를 반환한다.", () => {
    // given, when
    const {result} = renderHook(() => useRequest<unknown>("/api/data"))

    // then
    expect(result.current.error).toBeNull()
    expect(result.current.isLoaded).toBe(false)
    expect(result.current.data).toBeNull()
  })

  it("데이터 request에 성공하면 전달받은 데이터와 isLoaded false로 state를 변환한 후 반환한다.", async () => {
    // given
    const mockData = {id: 1, name: "John Doe"}
    ;(request as jest.Mock).mockResolvedValueOnce({data: mockData})

    const {result, waitForNextUpdate} = renderHook(() =>
      useRequest<typeof mockData>("/api/data")
    )

    expect(result.current.error).toBeNull()
    expect(result.current.isLoaded).toBe(false)
    expect(result.current.data).toBeNull()

    // when
    await waitForNextUpdate()

    // then
    expect(result.current.error).toBeNull()
    expect(result.current.isLoaded).toBe(true)
    expect(result.current.data).toEqual(mockData)
  })

  it("데이터 request에 실패하면 에러와 isLoaded false로 state를 변환한 후 반환한다.", async () => {
    // given
    const mockError = new Error("API Error")
    ;(request as jest.Mock).mockRejectedValueOnce(mockError)

    const {result, waitForNextUpdate} = renderHook(() =>
      useRequest<unknown>("/api/data")
    )

    expect(result.current.error).toBeNull()
    expect(result.current.isLoaded).toBe(false)
    expect(result.current.data).toBeNull()

    // when
    await waitForNextUpdate()

    // then
    expect(result.current.error).toEqual(mockError)
    expect(result.current.isLoaded).toBe(true)
    expect(result.current.data).toBeNull()
  })
})