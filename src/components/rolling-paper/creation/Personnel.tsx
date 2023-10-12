"use client"

import {useState, type ChangeEvent} from "react"
import {Portal, Alert} from "@/components"
import type {TInputChangeEvent} from "@/hooks/use-input"

type TProps = {
  personnel: string
  handlePersonnel: (event: TInputChangeEvent) => any
  setPersonnel: (personnel: string) => void
}

const Personnel = ({personnel, handlePersonnel, setPersonnel}: TProps) => {
  const [isAlerting, setIsAlerting] = useState(false)
  const [disabledElement, setDisabledElement] = useState<"button" | "input">(
    "button"
  )

  function changePersonnel(event: ChangeEvent<HTMLInputElement>) {
    const MIN = 1
    const MAX = 9999

    const personnel = parseInt(event.target.value)
    if (
      personnel > MAX ||
      personnel < MIN ||
      !/^[0-9]*$/.test(event.target.value)
    ) {
      return
    }

    handlePersonnel(event)
  }

  function disableButton() {
    setDisabledElement("button")
  }

  function confirm() {
    setPersonnel("") // TODO: API에서 미정을 어떻게 전달하는지 알아야 함
    setDisabledElement("input")
    handleIsAlerting()
  }

  function handleIsAlerting() {
    setIsAlerting(!isAlerting)
  }

  return (
    <div className="personnel">
      <section className="description">
        롤링페이퍼 참여 인원은 몇 명인가요?
      </section>
      <div className="selection f-center mt-2">
        <div>
          <input
            className={`${
              disabledElement === "input" ? "disabled" : ""
            } radius-sm mr-2`}
            type="number"
            value={personnel}
            onChange={changePersonnel}
            onFocus={disableButton}
            min="1"
            max="9999"
          />
          <span>명</span>
        </div>
        <span>or</span>
        <button
          className={`not-determined ${
            disabledElement === "button" ? "disabled" : ""
          } xxs radius-md`}
          onClick={handleIsAlerting}
        >
          미정
        </button>
      </div>
      <section className="caution mt-1">
        * 참여 인원 수정이 어려우니 다시 한 번 확인해 주세요!
      </section>

      <Portal
        render={() => (
          <Alert isAlerting={isAlerting} style={{height: "160px"}}>
            <Alert.Content
              style={{
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              롤링페이퍼 참여 인원이 미정일 경우,
              <br />
              일부 템플릿을 사용할 수 없습니다.
              <br />
              참여 인원을 <span className="highlight">{"'미정'"}</span>
              으로 확정하시겠습니까?
            </Alert.Content>
            <Alert.ButtonWrapper style={{height: "40px", marginTop: "20px"}}>
              <Alert.Button
                onClick={confirm}
                style={{width: "120px"}}
                type="fill-light-1"
              >
                확정하기
              </Alert.Button>
              <Alert.Button
                onClick={handleIsAlerting}
                type="default"
                style={{width: "120px"}}
              >
                취소
              </Alert.Button>
            </Alert.ButtonWrapper>
          </Alert>
        )}
      />
    </div>
  )
}

export default Personnel
