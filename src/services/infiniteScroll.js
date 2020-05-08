import { debounce } from './debounce'

function infiniteScroll(scrollBox, offset, callback) {
  if (scrollBox.scrollHeight <= scrollBox.offsetHeight + scrollBox.scrollTop + offset) {
    callback()
  }
}

export default debounce(infiniteScroll, 50)
