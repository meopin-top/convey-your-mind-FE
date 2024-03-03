"use client"

import {useState, useEffect} from "react"
import Content from "./Content"
import useInput from "@/hooks/use-input"
import Storage from "@/store/local-storage"
import {IMAGE_CONTENT} from "@/constants/service"

type TProps = {
  isBottomSheetOpen: boolean
  onClose: () => void
}

const ImageContent = ({isBottomSheetOpen, onClose}: TProps) => {
  const [isSenderDisabled, setIsSenderDisabled] = useState(false)

  const [sender, handleSender, setSender] = useInput()

  useEffect(() => {
    setSender(Storage.get("nickName") ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSetIsSenderDisabled() {
    setIsSenderDisabled(!isSenderDisabled)
  }

  function closeBottomSheet() {
    resetState()
    onClose()
  }

  function resetState() {
    setIsSenderDisabled(false)
    setSender("")
  }

  return (
    <Content
      isBottomSheetOpen={isBottomSheetOpen}
      type={IMAGE_CONTENT}
      isSenderDisabled={isSenderDisabled}
      handleSetIsSenderDisabled={handleSetIsSenderDisabled}
      sender={sender}
      handleSender={handleSender}
      onClose={closeBottomSheet}
    >
      image content
    </Content>
  )
}

export default ImageContent
