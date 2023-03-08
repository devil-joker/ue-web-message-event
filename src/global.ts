import $eventBus from './event';
import initUe5 from './useUe5';
initUe5();

/**
 * 全局注册ue场景可触发事件
 * @param functionName ue场景触发的事件名
 * @param emitFunctionName ue场景触发事件之后，web端监听的函数名
 */
export default function global_ue_install(functionName: string, emitFunctionName: string): void {
  window.ue.interface[functionName] = (message: string) => {
    $eventBus.emit(emitFunctionName, message)
  }
}
// 默认全局ue事件
global_ue_install('global_ue_get_message', 'ue_message');
