const regExp = {
  email: /^(\w|[^$%:;"'#&()+=])+@(\w|[^$%:;"'#&()+=]){2,}\.([A-Za-zА-Яа-яЁё]){2,}$/i,
  name: /^([A-Za-zА-Яа-яЁё])+$/g,
  password: /(\w|\S){3,}$/g,
  inn: /\d{9,}/g
}

export const validate = (reg, val) => {
  return !!val.match(regExp[reg])
}

