import {createContext} from "react"
import type {TStore} from "@/@types/rolling-paper"

const Store = createContext<TStore>({
  toWhom: "",
})

export default Store
