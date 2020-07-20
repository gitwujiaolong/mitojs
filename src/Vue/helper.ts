import { getLocationHref, getTimestamp } from 'utils'
import { ERRORTYPES, BREADCRUMBTYPES, ReportDataType } from '@/common'
import { ViewModel } from './interface'
import { breadcrumb, transportData } from 'core'
function formatComponentName(vm: ViewModel) {
  console.log(vm)
  if (vm.$root === vm) return 'root'
  const name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '')
  )
}

export function handleVueError(err: Error, vm: ViewModel, info: string, level: number): void {
  // let errInfo: { name: string; message: string; stack?: any[] } = {
  //   name: '',
  //   message: ''
  // }
  const componentName = formatComponentName(vm)
  const propsData = vm.$options && vm.$options.propsData
  const data: ReportDataType = {
    type: ERRORTYPES.VUE_ERROR,
    message: `${err.message}(${info})`,
    level,
    url: getLocationHref(),
    componentName: componentName,
    propsData: propsData || '',
    name: err.name,
    stack: err.stack || [],
    time: getTimestamp()
  }
  breadcrumb.push({
    type: BREADCRUMBTYPES.VUE,
    data
  })
  transportData.xhrPost(data)
}
