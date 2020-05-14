import { debounce } from '@/services/debounce'
import infiniteScroll from '@/services/infiniteScroll'

const vScroll = {
  scrollHandler: null,
  bind(el, bindings) {
    vScroll.scrollHandler = debounce(() => {
      const offset = 100
      const callback = bindings.value
      infiniteScroll(el, offset, callback)
    }, 50)
    el.addEventListener('scroll', vScroll.scrollHandler)
  },

  unbind(el) {
    el.removeEventListener('scroll', vScroll.scrollHandler)
  }
}

export default vScroll

