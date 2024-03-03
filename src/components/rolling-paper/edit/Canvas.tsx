"use client"

import {useEffect, useState} from "react"
import {TextContent, ImageContent} from "./"
import useRollingPaperSocket from "@/hooks/use-rolling-paper-socket"
import useRequest from "@/hooks/use-request"
import useWheelScroll from "@/hooks/use-wheel-scroll"
import useCanvas from "@/hooks/use-canvas"
import Store from "@/store/rolling-paper"
import type {
  TRollingPaperInProgressingInformation,
  TRollingPaperProgressedInformation,
} from "@/@types/rolling-paper"

type TProps = {
  projectId: string
  toWhom: string
  type: string
}

const Canvas = ({projectId, toWhom, type}: TProps) => {
  const [tooltip, setTooltip] = useState<{
    isOpen: boolean
    pageY: number
    pageX: number
  }>({
    isOpen: false,
    pageY: 0,
    pageX: 0,
  })
  const [isTextBottomSheetOpen, setIsTextBottomSheetOpen] = useState(false) // 쿼리스트링을 이용하여 바텀 시트 open/close를 조절하면, 바텀 시트 open 시 자동으로 scrollY가 0이 됨
  const [isImageBottomSheetOpen, setIsImageBottomSheetOpen] = useState(false)

  const {request} = useRequest()

  const {handleMouseDown, handleMouseMove, handleMouseUp} = useWheelScroll()

  const {createContent} = useCanvas()

  const {content} = useRollingPaperSocket(projectId)
  console.warn(content) // TODO: remove

  useEffect(() => {
    request({
      path: `/projects/${projectId}/enter`,
      method: "post",
    }) // json 파싱 시 에러 발생. 응답 body가 없어서 그런 것이므로 무시

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  function handleTooltip(event: {pageY: number; pageX: number}) {
    setTooltip({
      isOpen: !tooltip.isOpen,
      pageY: event.pageY,
      pageX: event.pageX,
    })
  }

  function closeTooltip() {
    setTooltip({
      isOpen: false,
      pageY: tooltip.pageY,
      pageX: tooltip.pageX,
    })
  }

  function closeBottomSheet() {
    setIsTextBottomSheetOpen(false)
    setIsImageBottomSheetOpen(false)
  }

  function openTextContentBottomSheet() {
    setIsTextBottomSheetOpen(true)
    closeTooltip()
  }

  function drawTextContent(sender: string, text: string) {
    createContent({
      content: {
        sender,
        text,
      },
      position: {
        pageY: tooltip.pageY,
        pageX: tooltip.pageX,
      },
    })
  }

  function openImageContentBottomSheet() {
    setIsImageBottomSheetOpen(true)
    closeTooltip()
  }

  return (
    <Store.Provider value={{toWhom}}>
      <canvas
        className={`type-${type}`}
        onMouseDownCapture={handleMouseDown}
        onMouseMoveCapture={handleMouseMove}
        onMouseUpCapture={handleMouseUp}
        onClickCapture={handleTooltip}
      />
      <div
        className="whom f-center shadow-md pt-4 pr-4 pb-4 pl-4"
        onMouseDownCapture={handleMouseDown}
        onMouseMoveCapture={handleMouseMove}
        onMouseUpCapture={handleMouseUp}
        onClickCapture={closeTooltip}
      >
        {toWhom}
      </div>
      {tooltip.isOpen && (
        // top: y - (툴팁 height + 화살표 border), left: x - (화살표 left + 화살표 border / 2)
        <div
          className="tooltip"
          style={{top: tooltip.pageY - 72, left: tooltip.pageX - 18}}
        >
          <button
            type="button"
            className="f-center md shadow-sm radius-md"
            onClick={openTextContentBottomSheet}
          >
            편지 쓰기
          </button>
          <button
            type="button"
            className="f-center md shadow-sm radius-md"
            onClick={openImageContentBottomSheet}
          >
            사진 넣기
          </button>
        </div>
      )}
      <TextContent
        isBottomSheetOpen={isTextBottomSheetOpen}
        onClose={closeBottomSheet}
        onComplete={drawTextContent}
      />
      <ImageContent
        isBottomSheetOpen={isImageBottomSheetOpen}
        onClose={closeBottomSheet}
      />
    </Store.Provider>
  )
}

export default Canvas
