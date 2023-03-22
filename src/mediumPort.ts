// 中间件媒介
// 实际在加载iframe的页面中使用，获取来自子页面传递的port对象，来建立消息通道

import { IMessagePortNull } from './type';
export default class MediumPort {
  mediumPort: IMessagePortNull = null;

  constructor() {
    this.init();
  }

  init(): Promise<IMessagePortNull> {
    if (!window) {
      throw new Error("global window is not available，is it in web browser?");
    };
    return new Promise(resolve => {
      if (this.mediumPort) {
        resolve(this.mediumPort);
        return;
      }
      window.addEventListener('message', e => {
        if (e.ports && e.ports.length) {
          this.mediumPort = e.ports[0];
          this.mediumPort.start();

          resolve(this.mediumPort);
        } else {
          resolve(null);
        }
      })
    })
  }

  async getPort(): Promise<IMessagePortNull> {
    return await this.init();
  }

  set(data: any):void {
    if (!this.mediumPort) {
      throw new Error("the port of MessageChannel is not defined，please to init");
    }
    this.mediumPort.postMessage(data);
  }

  // get - 通过mediumPort监听message
  get(cb: (data: any, event: MessageEvent) => void) {
    if (!this.mediumPort) {
      throw new Error("the port of MessageChannel is not defined，please to init");
    }
    this.mediumPort.addEventListener("message", (v: MessageEvent) => {
      cb(v.data, v);
    }, { once: true });
  }
}
