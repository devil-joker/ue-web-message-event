// 用于iframe嵌套的页面实例化使用，以子页面为起始，建立与父级的消息通道

import { IMessagePort } from './type';
export default class ChannelPort {
  messagePort: IMessagePort;

  constructor() {
    this.messagePort = this.init();
  }

  init(): IMessagePort {
    const {port1, port2} = new MessageChannel();

    if (!window || !window.parent) {
      throw new Error("global window & window.parent is not available，is it in web browser of iframe?");
    }
    // 只处理当前iframe父级
    window.parent.postMessage('iframe url loaded', '*', [port1]);

    port2.start();
    return port2;
  }
  // 便捷方法，传递数据，也可手动通过messagePort对象直接postMessage
  set(data: any): void {
    this.messagePort.postMessage(data);
  }
  // get - 通过messagePort监听message，单次触发
  get(cb: (data: any, event: MessageEvent) => void) {
    this.messagePort.addEventListener("message", (v: MessageEvent) => {
      cb(v.data, v);
    }, { once: true })
  };
  // 获取port对象
  getPort(): IMessagePort {
    return this.messagePort;
  }
}
