import { getFlag, setFlag } from 'utils'
import { EVENTTYPES, ERRORLEVELS } from 'common'
import { VueInstance, ViewModel } from './interface'
import { handleVueError } from './helper'

// 监听Vue的时候是否需要加配置项
// interface VuePluginOption {}

const hasConsole = typeof console !== 'undefined'

export const MitoVue = {
  // vue 2.6.1 提供 warnHandler errorHandler报错信息
  install(Vue: VueInstance): void {
    if (getFlag(EVENTTYPES.VUE) || !Vue || !Vue.config) return
    setFlag(EVENTTYPES.VUE, true)
    Vue.config.errorHandler = function (err: Error, vm: ViewModel, info: string): void {
      handleVueError.apply(null, [err, vm, info, ERRORLEVELS.NORMAL])
      if (hasConsole && !Vue.config.silent) {
        console.error('Error in ' + info + ': "' + err.toString() + '"', vm)
        console.error(err)
      }
    }
    Vue.config.warnHandler = function (msg: string, vm: ViewModel, trace: string): void {
      handleVueError.apply(null, [msg, vm, trace, ERRORLEVELS.NORMAL])
      hasConsole && console.error('[Vue warn]: ' + msg + trace)
    }
  }
}
