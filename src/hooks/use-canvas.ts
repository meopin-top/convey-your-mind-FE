export default function useCanvas() {
  function createContent({
    content,
    position,
  }: {
    content: {sender: string; text: string}
    position: {pageY: number; pageX: number}
  }) {
    const contentPreview = document.createElement("div")

    setStyle()
    setInnerText()
    show()

    function setStyle() {
      contentPreview.style.top = `${position.pageY}px`
      contentPreview.style.left = `${position.pageX}px`
      contentPreview.style.width = `${(visualViewport?.width ?? 100) / 4}px`

      contentPreview.classList.add("text-content")
      contentPreview.classList.add("pt-2")
      contentPreview.classList.add("pr-2")
      contentPreview.classList.add("pb-2")
      contentPreview.classList.add("pl-2")
    }

    function setInnerText() {
      contentPreview.innerText = content.text
    }

    function show() {
      const wrapper = document.querySelector(".root-wrapper") as HTMLDivElement
      wrapper.appendChild(contentPreview)
    }
  }

  function changeContent() {}

  function confirmContent() {}

  return {
    createContent,
    changeContent,
    confirmContent,
  }
}
