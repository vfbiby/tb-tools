import type {PlasmoCSConfig} from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["*://*.taobao.com/*"]
}

const TaobaoFloat = () => {
  return <div>
    <button>goods</button>
  </div>
}

export default TaobaoFloat
