import {useState, useRef, type MouseEvent} from "react"
import FocusDots from "./FocusDots"
import useMouseTracker from "@/hooks/use-mouse-tracker"
import {type TCanvasElement} from "@/@types/rolling-paper"

const Canvas = () => {
  const [shapes, setShapes] = useState<HTMLElement[]>([])
  const [focusedShape, setFocusedShape] = useState<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const {handleMouseDown, handleMouseUp, getCoordinate} = useMouseTracker()

  let drawingMode: TCanvasElement | null = null
  function resetDrawingMode() {}

  function handleCanvasMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (!drawingMode) {
      return
    }

    handleMouseDown(event)
  }

  function handleCanvasMouseUp(event: MouseEvent<HTMLDivElement>) {
    if (!drawingMode) {
      return
    }

    handleMouseUp(event)

    const {startX, startY, endX, endY} = getCoordinate()

    const rendered = canvasRef.current
    const eventExecuted = startX && startY && endX && endY
    if (rendered && eventExecuted) {
      const shape = createShape({startX, startY, endX, endY})
      canvasRef.current.appendChild(shape)

      setShapes([...shapes, shape])
      resetDrawingMode()
    }
  }

  function createShape({
    startX,
    startY,
    endX,
    endY,
  }: {
    startX: number
    startY: number
    endX: number
    endY: number
  }) {
    const shape = document.createElement(drawingMode as TCanvasElement)
    shape.style.position = "absolute"
    shape.style.left = `${Math.min(startX, endX)}px`
    shape.style.top = `${Math.min(startY, endY)}px`
    shape.style.width = `${Math.abs(startX - endX)}px`
    shape.style.height = `${Math.abs(startY - endY)}px`

    if (drawingMode === "img") {
      ;(shape as HTMLImageElement).src =
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.co.kr%2Fsukhyung25%2F%25EA%25B7%2580%25EC%2597%25AC%25EC%259A%25B4-%25EC%259D%25B4%25EB%25AF%25B8%25EC%25A7%2580%2F&psig=AOvVaw2SxHakcCoVaaHoeDJE7N4P&ust=1684670671257000&source=images&cd=vfe&ved=0CA4QjRxqFwoTCOj3qLntg_8CFQAAAAAdAAAAABAE"
      ;(shape as HTMLImageElement).alt = "테스트용 사진"
    }

    return shape
  }

  function handleCanvasClick(event: MouseEvent<HTMLDivElement>) {
    const {target} = event

    shapes.forEach((shape) => {
      shape.classList.remove("focus")
    })
    setFocusedShape(() => null)

    if (
      target instanceof HTMLImageElement ||
      target instanceof HTMLTextAreaElement
    ) {
      target.classList.add("focus")
      setFocusedShape(() => target)
    }
  }

  return (
    <>
      <article
        className={`canvas ${drawingMode ? "drawing" : ""}`}
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleCanvasMouseUp}
        onClick={handleCanvasClick}
      >
        <FocusDots target={focusedShape} />
      </article>
      <div>
        {`(${getCoordinate().startX}, ${getCoordinate().startY})
          -
          (${getCoordinate().endX}, ${getCoordinate().endY})`}
      </div>
    </>
  )
}

export default Canvas
