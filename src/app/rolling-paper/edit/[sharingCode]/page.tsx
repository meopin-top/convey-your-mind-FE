import {redirect} from "next/navigation"
import {Canvas, Redirection} from "@/components/rolling-paper/edit"
import {ROLLING_PAPER} from "@/constants/response-code"
import {ROUTE} from "@/constants/service"
import {Suspense} from "react"
import {Header, Redirecting} from "@/components"

type TProps = {
  params: {
    sharingCode: string
  }
}

async function validateSharingCode(sharingCode: string) {
  return {
    id: "abc",
    projectIdCode: ROLLING_PAPER.INVITATION_CODE.QUERY_SUCCESS,
    destination: "someonezxcvz",
    type: "D",
  }

  // const encodedSharingCode = encodeURIComponent(sharingCode)
  // const sharingCodeData = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_HOST}/api/projects/invite-code/${encodedSharingCode}`,
  //   {next: {revalidate: 10}}
  // )
  // const {
  //   code: sharingCodeCode,
  //   data: {id},
  // } = await sharingCodeData.json()
  // if (sharingCodeCode === ROLLING_PAPER.INVITATION_CODE.QUERY_FAILURE) {
  //   // 존재하지 않는 공유코드면
  //   redirect(ROUTE.MY_PAGE)
  // }

  // const projectIdData = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_HOST}/api/projects/${id}`,
  //   {
  //     next: {
  //       revalidate: 10,
  //     },
  //   }
  // )
  // const {
  //   code: projectIdCode,
  //   data: {destination, type},
  // } = await projectIdData.json()

  // return {id, projectIdCode, destination, type}
}

const RollingPaperEdit = async ({params: {sharingCode}}: TProps) => {
  const {
    id: projectId,
    projectIdCode: code,
    destination: toWhom,
    type,
  } = await validateSharingCode(sharingCode)

  return (
    <Suspense fallback={<Redirecting isRedirecting />}>
      {code === ROLLING_PAPER.INVITATION_CODE.QUERY_FAILURE ? (
        <Redirection />
      ) : (
        <div className="rolling-paper-edit root-wrapper f-center">
          <Canvas projectId={projectId} toWhom={toWhom} type={type} />
          <Header isControllingScroll={false} />
        </div>
      )}
    </Suspense>
  )
}

export default RollingPaperEdit
