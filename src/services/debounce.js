export function debounce (f, ms) {
  let flag = false
  return function () {
    if (flag) return
    flag = true
    f.apply(this, arguments)
    setTimeout(() => flag = false, ms)
  }
}
