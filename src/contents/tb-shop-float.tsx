import type {PlasmoCSConfig} from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["*://*.taobao.com/*"],
  world: "MAIN"
}

const TestPage = () => {
  return <div>
    Hello world
  </div>
}

export default TestPage