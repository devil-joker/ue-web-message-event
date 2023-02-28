export default class IframePort {
  public port: MessagePort  | null = null;

  // 初始化
  async init() {
    if (!window) return;
    return new Promise(resolve => {
      if (this.port) {
        this.port.start();
        resolve(this.port);
        return;
      }
      window.addEventListener('message', e => {
        if (e.ports && e.ports.length) {
          this.port = e.ports[0];
          this.port.start();
          resolve(this.port);
        }
      })
    })
  }
}
