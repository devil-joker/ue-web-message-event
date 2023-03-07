export default class MassagePorter {
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
}
