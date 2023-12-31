import {Suspense} from "react"
import {redirect} from "next/navigation"
import Anchor from "next/link"
import {Link, Sharing} from "@/components/rolling-paper/creation/[sharingCode]"
import {Header, Loading, NeedLoggedIn} from "@/components"
import {ROUTE} from "@/constants/service"
import {ROLLING_PAPER} from "@/constants/response-code"

type TProps = {
  params: {
    sharingCode: string
  }
}

const CreationSuccess = async ({params: {sharingCode}}: TProps) => {
  const data = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_HOST
    }/api/projects/invite-code/${encodeURIComponent(sharingCode)}`,
    {
      cache: "no-cache",
    }
  )

  const {code} = await data.json()

  if (code === ROLLING_PAPER.INVITATION_CODE.QUERY_FAILURE) {
    // 존재하지 않는 공유 코드면
    redirect(ROUTE.MY_PAGE)
  }

  return (
    <Suspense fallback={<Loading isLoading />}>
      <NeedLoggedIn />

      <main className="creation-success root-wrapper">
        <Header />

        <div className="title f-center mt-2">
          <h2>롤링페이퍼 만들기</h2>
          <h1>성공!</h1>
        </div>
        <Link sharingCode={`rolling-paper/edit/${sharingCode}`} />
        <Sharing sharingCode={`rolling-paper/edit/${sharingCode}`} />
        <button className="to-rolling-paper mt-4 radius-lg shadow-md">
          <Anchor href={"#"} className="f-center">
            롤링 페이퍼 쓰러 가기{/* TODO: href 변경 */}
          </Anchor>
        </button>
        <button className="to-my-page mt-4 radius-lg shadow-md">
          <Anchor href={ROUTE.MY_PAGE} className="f-center">
            마이 페이지
          </Anchor>
        </button>
      </main>
    </Suspense>
  )
}

export default CreationSuccess
