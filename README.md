# messageEvent

#### 介绍
页面通信


# 默认ue -- webUI 直接加载的页面
| 方法  | 参数  | 描述  |
| ----------- | ----------- |----------- |
| ueWebInstall | @funcName ue场景触发的事件 <br/> @emitFuncName ue场景触发事件之后，web端监听的函数名，如果不传递默认取第一个参数场景方法名 | 全局注册ue场景可触发事件，通过$eventBus - on 监听第二个参数名的回调 |
| ueWebEmit | @funcName 传递给ue场景的方法名 <br/> @data 传递可以通过json序列化的数据 | 主动触发场景某事件回调事件 |
|$eventBus|.on - eventName: string, callback: (msg: string) => void <br/> .emit - eventName: string, msg: string <br/> .off - eventName: string, callback: (msg: string) => void | 事件通信总线 |


# iframe嵌套 -- 通信
### 实例 ChannelPort，在子页面初始化，即ue中加载的主页面中的iframe页面
| 方法  | 参数  | 描述  |
| ----------- | ----------- |----------- |
| init | | 在子页面入口初始化通信通道，返回通道之一 |
| set | data: any | 便捷方法，传递数据，也可手动通过messagePort对象直接postMessage |
| get | cb: (data: any, event: MessageEvent) => void | 通过messagePort监听message，单次触发|
| getPort |  | 获取port对象|

```
import { ChannelPort } from 'ue-web-message-event'
const channelPort = new ChannelPort();

<!-- 主页面单独写自定义方法，在子页面通过set和get来对应触发和接受数据，并执行对应操作 -->
<!-- 此时子页面是主要的业务页面，主页面实际是ue和子页面的中间件 -->
channelPort.set('123123');

channelPort.set({
  type: 'INSTALL_GLOBAL_EVENT',
  data: {
    eventName: 'global_ue_panel_visible',
    emitName: 'panel_visible'
  }
});

channelPort.get(v => {
  console.log(v);
})
```


### 实例 MediumPort，在父级页面，即在ue中加载的主页面
| 方法  | 参数  | 描述  |
| ----------- | ----------- |----------- |
| init | | 在主页面入口初始化通信通道，返回通道之一<Promise<MessagePort | null>> |
| set | data: any | 便捷方法，传递数据，也可手动通过messagePort对象直接postMessage |
| get | cb: (data: any, event: MessageEvent) => void | 通过messagePort监听message，单次触发|
| getPort |  | 获取port对象，返回Promise<MessagePort | null> |

```
import { MediumPort, ueWebInstall, $eventBus } from 'ue-web-message-event'
const mediumPort = new MediumPort();

mediumPort.getPort().then(port => {
  console.log(port)
  if (port) {
    mediumPort.set('123123');

    mediumPort.get(v => {
      console.log(v);
    })

    mediumPort.get(v => {
      console.log(v);
      const { type, data } = v;
      switch (type) {
        case 'INSTALL_GLOBAL_EVENT':
          ueWebInstall(data.eventName, data.emitName);

          $eventBus.on(data.emitName, v => {
            console.log(v)
          })
          break;

        default:
          break;
      }
    });
  }
})
```
