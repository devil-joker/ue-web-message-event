import $eventBus from './event';
function global_ue_get_message(type: string, msg: unknown): void {
  $eventBus.emit('ue_message', type, msg)
}

window.global_ue_get_message = global_ue_get_message;
