import $eventBus from './event';
import initUe from './initUe';
initUe();

/**
 * 全局注册ue场景可触发事件
 * @param funcName ue场景触发的事件名
 * @param emitFuncName ue场景触发事件之后，web端监听的函数名，如果不传递默认取第一个参数场景方法名
 */
export function ueWebInstall(funcName: string, emitFuncName?: string): void {
  window.ue.interface[funcName] = (message: string) => {
    $eventBus.emit(emitFuncName || funcName, message)
  }
}
/**
 *
 * @param funcName 传递给ue场景的方法名
 * @param data 传递可以通过json序列化的数据
 */
export function ueWebEmit(funcName: string, data?: unknown): void {
  window.ue4(funcName, data);
}
// 默认全局ue事件
ueWebInstall('global_ue_get_message', 'ue_message');
