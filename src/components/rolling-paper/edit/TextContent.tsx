"use client"

import {useState, useEffect} from "react"
import Content from "./Content"
import useInput from "@/hooks/use-input"
import Storage from "@/store/local-storage"
import {TEXT_CONTENT} from "@/constants/service"

type TProps = {
  isBottomSheetOpen: boolean
  onClose: () => void
  onComplete: (sender: string, text: string) => void
}

const TextContent = ({isBottomSheetOpen, onClose, onComplete}: TProps) => {
  const [isSenderDisabled, setIsSenderDisabled] = useState(false)

  const [sender, handleSender, setSender] = useInput()
  const [text, handleText, setText] = useInput()

  useEffect(() => {
    setSender(Storage.get("nickName") ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSetIsSenderDisabled() {
    setIsSenderDisabled(!isSenderDisabled)
  }

  function finishInput() {
    onComplete(sender, text)
    closeBottomSheet()
  }

  function closeBottomSheet() {
    resetState()
    onClose()
  }

  function resetState() {
    setIsSenderDisabled(false)
    setText("")
    setSender("")
  }

  return (
    <Content
      isBottomSheetOpen={isBottomSheetOpen}
      type={TEXT_CONTENT}
      isSenderDisabled={isSenderDisabled}
      handleSetIsSenderDisabled={handleSetIsSenderDisabled}
      sender={sender}
      handleSender={handleSender}
      onClose={closeBottomSheet}
    >
      <div className="f-center">
        <textarea
          className="text radius-sm mb-2 pt-2 pr-2 pb-2 pl-2"
          value={text}
          onChange={handleText}
        />
        <span className="information mb-4">
          롤링페이퍼에서 메세지의 크기와 위치를 확인/조정하신 후
          <br />
          <u>
            <b>{'"확정"을 클릭해야 작성이 완료'}</b>
          </u>
          됩니다!
        </span>
        <button
          className="confirm radius-lg shadow-md"
          disabled={
            text.length === 0 || (!isSenderDisabled && sender.length === 0)
          }
          onClick={finishInput}
        >
          메시지 입력 완료
        </button>
      </div>
    </Content>
  )
}

export default TextContent
