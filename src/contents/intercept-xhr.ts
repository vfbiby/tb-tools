import type {PlasmoCSConfig} from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://*.taobao.com/*"],
  run_at: "document_start",
  world: "MAIN"
}

const originOpen = XMLHttpRequest.prototype.open

const interceptUrls = [
  {
    pattern: /^\/\/h5api.m.taobao.com\/h5\/mtop.taobao.shop.simple.item.fetch\/1.0\/\?.*/i,
    type: 'ITEM_LIST'
  },
  {
    pattern: /^\/\/h5api.m.taobao.com\/h5\/mtop.taobao.shop.simple.fetch\/1.0\/\?.*$/i,
    type: 'SHOP_INFO'
  },
]

function interceptAjax() {
  XMLHttpRequest.prototype.open = function (_: any, url: string) {
    const xhr = this as XMLHttpRequest;
    this.addEventListener("readystatechange", function (event: Event) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        interceptUrls.forEach(intercept => {
          if (intercept.pattern.test(url)) {
            sendResponseBack(intercept.type, event, url)
          }
        })
      }
    })
    return originOpen.apply(this, arguments)
  }
}

function sendResponseBack(type: string, event: any, url: string) {
  window.dispatchEvent(
    new CustomEvent("FROM_INJECTED", {
      detail: {type, responseText: event.target.responseText, url}
    })
  )
}

interceptAjax()