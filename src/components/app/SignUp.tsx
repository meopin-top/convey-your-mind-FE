"use client"

import {useState, type KeyboardEvent, type MutableRefObject} from "react"
import {useRouter} from "next/navigation"
import dynamic from "next/dynamic"
import {SecretInput} from "../"
import useInput from "@/hooks/use-input"
import useFocus from "@/hooks/use-focus"
import useRequest from "@/hooks/use-request"
import {AUTH} from "@/constants/response-code"
import {VALIDATOR} from "@/constants/input"
import {ROUTE} from "@/constants/service"
import Storage from "@/store/local-storage"

const Portal = dynamic(() => import("../Portal"), {
  loading: () => <></>,
})
const Loading = dynamic(() => import("../Loading"), {
  loading: () => <></>,
})
const ConfirmedPopUp = dynamic(() => import("./ConfirmedPopUp"), {
  loading: () => <></>,
})
const ErrorAlert = dynamic(() => import("../FlowAlert"), {
  loading: () => <></>,
})

const SignUp = () => {
  const [alertMessage, setAlertMessage] = useState("")
  const [isPopUpOpened, setIsPopUpOpened] = useState(false)

  const {isLoading, request} = useRequest()

  const {ref: passwordInput, onKeyDown: handleUserIdInput} = useFocus(["Enter"])

  const [userId, handleUserId] = useInput()
  const [password, handlePassword] = useInput()

  const router = useRouter()

  function handlePasswordInput(event: KeyboardEvent<HTMLInputElement>) {
    const isEnterKeyDowned = event.key === "Enter"
    if (isEnterKeyDowned) {
      checkValidation()
    }
  }

  function checkValidation() {
    if (userId.length === 0) {
      setAlertMessage("ID가 입력되지 않았습니다. 다시 한 번 확인해 주세요.")

      return
    }

    if (password.length === 0) {
      setAlertMessage("PW가 입력되지 않았습니다. 다시 한 번 확인해 주세요.")

      return
    }

    if (!VALIDATOR.USER_ID.test(userId)) {
      setAlertMessage("영문, 숫자, 특수문자만 사용 가능합니다.")

      return
    }

    if (!VALIDATOR.PASSWORD.test(password)) {
      setAlertMessage(
        "안전을 위해 영문, 숫자, 특수문자를 혼합해서 설정해 주세요."
      )

      return
    }

    handlePopUp()
  }

  function handlePopUp() {
    setIsPopUpOpened(!isPopUpOpened)
  }

  async function signUp(confirmedPassword: string, email: string) {
    const {message, code, data} = await request({
      path: "/users/sign-up",
      method: "post",
      body:
        email.length === 0
          ? {
              userId,
              password,
              passwordCheck: confirmedPassword,
            }
          : {
              userId,
              password,
              passwordCheck: confirmedPassword,
              email,
            },
    })

    if (code === AUTH.SIGN_UP.SUCCESS) {
      Storage.set("nickName", data.nickName)
      Storage.set("profile", data.profile)
      router.push(ROUTE.MY_PAGE)

      return
    }

    setAlertMessage(message)
  }

  function closeAlert() {
    setAlertMessage("")
  }

  return (
    <>
      <section className="validity mb-1">
        <div
          className={`${userId.length >= 6 ? "valid" : "invalid"}-light`}
          role="status"
        />
        <span>6글자 이상</span>
      </section>
      <input
        type="text"
        className="user-id radius-sm mb-2"
        placeholder="나만의 ID로 시작하기"
        minLength={6}
        maxLength={20}
        required
        value={userId}
        onKeyDown={handleUserIdInput}
        onChange={handleUserId}
      />
      <section className="validity mb-1">
        <div
          className={`${
            VALIDATOR.ENGLISH.test(password) ? "valid" : "invalid"
          }-light`}
          role="status"
        />
        <span>영문</span>
        <div
          className={`${
            VALIDATOR.NUMBER.test(password) ? "valid" : "invalid"
          }-light`}
          role="status"
        />
        <span>숫자</span>
        <div
          className={`${
            VALIDATOR.SPECIAL_CHARACTER.test(password) ? "valid" : "invalid"
          }-light`}
          role="status"
        />
        <span>특수 문자</span>
        <div
          className={`${password.length >= 8 ? "valid" : "invalid"}-light`}
          role="status"
        />
        <span>8글자 이상</span>
      </section>
      <SecretInput
        className="password radius-sm mb-2"
        placeholder="나만의 PW로 시작하기"
        minLength={8}
        maxLength={20}
        required
        ref={passwordInput as MutableRefObject<HTMLInputElement | null>}
        value={password}
        onKeyDown={handlePasswordInput}
        onChange={handlePassword}
      />
      <button
        className="login md shadow-sm radius-md"
        onClick={checkValidation}
      >
        가입하기
      </button>
      <Portal
        render={() => (
          <>
            <ConfirmedPopUp
              isAlerting={isPopUpOpened}
              isLoading={isLoading}
              userId={userId}
              password={password}
              onClose={handlePopUp}
              submit={signUp}
            />
            <Loading isLoading={isLoading} />
            <ErrorAlert
              isAlerting={alertMessage.length !== 0}
              onClose={closeAlert}
              content={alertMessage}
            />
          </>
        )}
      />
    </>
  )
}

export default SignUp
