"use client"

import {useState, useMemo, useEffect} from "react"
import type {
  TRollingPaperTextContent,
  TRollingPaperImageContent,
  TRollingPaperInProgressingInformation,
  TRollingPaperProgressedInformation,
} from "@/@types/rolling-paper"

export type TContent = {
  [id: string]: TRollingPaperTextContent | TRollingPaperImageContent
}

// socket status: https://github.com/websockets/ws/blob/HEAD/doc/ws.md#ready-state-constants
// 0: connecting
// 1: open
// 2: closing
// 3: closed

export default function useRollingPaperSocket(projectId: string) {
  const [content, setContent] = useState<TContent>({})
  const socket = useMemo(
    () => new WebSocket(`${process.env.NEXT_PUBLIC_WSS_HOST!}/${projectId}`),
    [projectId]
  )

  useEffect(() => {
    socket.addEventListener("open", (event) => {
      console.log("zz", event)
      // socket.send("zxvc")
    })

    socket.addEventListener("message", (event) => {
      // TODO: content에 id가 있고, 작성자 본인이면 무시, 아니면 setContent추가
      console.log("vv", event)
    })

    return () => {
      socket.close()
    }
  }, [socket])

  function send(
    data:
      | Omit<TRollingPaperImageContent, "content_id">
      | Omit<TRollingPaperTextContent, "content_id">
  ) {
    const contentId = createRandomId()

    try {
      const newContent = {
        ...data,
        content_id: contentId,
      }

      setContent({
        ...content,
        [contentId]: newContent,
      })

      socket.send(JSON.stringify(newContent))
    } catch (_) {
      delete content[contentId]

      setContent(content)
    }
  }

  function createRandomId() {
    let contentId = ""
    let isNewContentId = false

    while (!isNewContentId) {
      contentId = crypto.randomUUID()
      if (!content[contentId]) {
        isNewContentId = true
      }
    }

    return contentId
  }

  return {content, send, createRandomId}
}
