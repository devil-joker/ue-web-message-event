export default class MassageEvent {
  public port1: MessagePort  | null = null;

  public port2: MessagePort | null = null;

  constructor() {
    this.init();
  }

  init(): void {
    const { port1, port2 } = new MessageChannel();

    this.port1 = port1;

    this.port2 = port2;
  }

  get(No: number) {
    const port = No === 1 ? this.port1 : this.port2;
    if (port) {
      port.onmessage = e => {
        Promise.resolve(e.data);
      }
    } else {
      this.init();
      this.get(No);
    }
  };

  set(No: number, message: unknown) {
    const port = No === 1 ? this.port1 : this.port2;
    if (port) {
      port.postMessage(message)
    } else {
      this.init();
      this.set(No, message);
    }
  }
}
