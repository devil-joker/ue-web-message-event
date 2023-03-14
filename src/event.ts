class EventBus {
  #cache: Map<string, Array<(msg: string) => void>> = new Map();

  on(eventName: string, callback: (msg: string) => void): void {
    const event = this.#cache.get(eventName) || [];
    event.push(callback);
    this.#cache.set(eventName, event);
  }

  emit(eventName: string, msg: string): void {
    const events = this.#cache.get(eventName) || [];
    events.forEach(fn => fn.call(this, msg));
  }

  off(eventName: string, callback: (msg: string) => void): void {
    const events = this.#cache.get(eventName) || [];
    const _events = events.filter(fn => fn !== callback);
    this.#cache.set(eventName, _events);
  }
}

const $eventBus = new EventBus();

export default $eventBus;
