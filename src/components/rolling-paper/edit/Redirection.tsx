"use client"

import {useState} from "react"
import {useRouter, useParams} from "next/navigation"
import {Redirecting, Portal, FlowAlert} from "@/components"
import {ROUTE} from "@/constants/service"

const Redirection = () => {
  const [isAlerting, setIsAlerting] = useState(true)

  const router = useRouter()

  const params = useParams()

  function closeAlert() {
    setIsAlerting(false)
    router.push(ROUTE.MY_PAGE)
  }

  return (
    <>
      <Redirecting isRedirecting />
      <Portal
        render={() => (
          <FlowAlert
            isAlerting={isAlerting}
            content={<>올바른 공유코드가 아닙니다: {params.sharingCode}</>}
            onClose={closeAlert}
          />
        )}
      />
    </>
  )
}

export default Redirection
