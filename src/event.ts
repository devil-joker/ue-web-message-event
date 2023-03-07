class EventBus {
  #cache: Map<string, Array<(...arg: unknown[]) => void>> = new Map();

  on(eventName: string, callback: (...args: unknown[]) => void): void {
    const event = this.#cache.get(eventName) || [];
    event.push(callback);
    this.#cache.set(eventName, event);
  }

  emit(eventName: string, ...args: unknown[]): void {
    const events = this.#cache.get(eventName) || [];
    events.forEach(fn => fn.apply(this, args));
  }

  off(eventName: string, callback: (...args: unknown[]) => void): void {
    const events = this.#cache.get(eventName) || [];
    const _events = events.filter(fn => fn !== callback);
    this.#cache.set(eventName, _events);
  }
}

const $eventBus = new EventBus();

export default $eventBus;
