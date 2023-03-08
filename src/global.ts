import $eventBus from './event';
import initUe5 from './useUe5';
initUe5();

/**
 * 全局注册ue场景可触发事件
 * @param functionName ue场景触发的事件名
 * @param emitFunctionName ue场景触发事件之后，web端监听的函数名，如果不传递默认取第一个参数场景方法名
 */
export function global_ue_install(functionName: string, emitFunctionName?: string): void {
  window.ue.interface[functionName] = (message: string) => {
    $eventBus.emit(emitFunctionName || functionName, message)
  }
}
/**
 *
 * @param functionName 传递给ue场景的方法名
 * @param data 传递可以通过json序列化的数据
 */
export function global_ue_emit(functionName: string, data?: unknown): void {
  window.ue4(functionName, data);
}
// 默认全局ue事件
global_ue_install('global_ue_get_message', 'ue_message');
