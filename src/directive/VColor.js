export default {
  bind( el, bindings ) {
    el.style[bindings.arg] = bindings.value
    const fontMod = bindings.modifieres['font'] // true||false
    if (fontMod) {
      el.style.fontSize = 2 + 'em'
    }
  },
}

