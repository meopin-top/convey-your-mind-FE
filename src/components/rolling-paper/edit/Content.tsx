"use client"

import {type ReactNode, useContext} from "react"
import dynamic from "next/dynamic"
import Store from "@/store/rolling-paper"
import {TEXT_CONTENT, IMAGE_CONTENT} from "@/constants/service"
import type {TInputChangeEvent} from "@/hooks/use-input"

const BottomSheet = dynamic(() => import("../../BottomSheet"), {
  loading: () => <></>,
})

type TProps = {
  isBottomSheetOpen: boolean
  type: typeof TEXT_CONTENT | typeof IMAGE_CONTENT
  isSenderDisabled: boolean
  handleSetIsSenderDisabled: () => void
  sender: string
  handleSender: (event: TInputChangeEvent) => void
  onClose: () => void
  children?: ReactNode
}

const Content = ({
  isBottomSheetOpen,
  type,
  isSenderDisabled,
  handleSetIsSenderDisabled,
  sender,
  handleSender,
  onClose,
  children,
}: TProps) => {
  const {toWhom} = useContext(Store)

  function formatToWhom() {
    const MAX_LEGNTH = 30

    return toWhom.length > MAX_LEGNTH
      ? `${toWhom.slice(0, MAX_LEGNTH)}...`
      : toWhom
  }

  return (
    <BottomSheet
      isOpen={isBottomSheetOpen}
      onClose={onClose}
      isControllingScroll={false}
    >
      <div className="to mb-2">
        <span className="header">To.</span>
        {formatToWhom()}
      </div>
      <div className="from mb-2">
        <span className="header">From.</span>
        <input
          type="text"
          className="sender radius-sm"
          placeholder="보내는 사람 이름 입력"
          value={sender}
          onChange={handleSender}
          disabled={isSenderDisabled}
        />
        <div className="toggle-wrapper f-center ml-4 mr-2">
          <span className="description">{isSenderDisabled ? "OFF" : "ON"}</span>
          <input
            type="checkbox"
            id={`toggle-${type}`}
            hidden
            checked={!isSenderDisabled}
            onChange={handleSetIsSenderDisabled}
          />
          <label htmlFor={`toggle-${type}`} className="switch mt-1">
            <span />
          </label>
        </div>
      </div>
      {children}
    </BottomSheet>
  )
}

export default Content
