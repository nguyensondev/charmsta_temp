export const convertYupErrorInner = (errors: Array<{ message: string; path: string }>) => {
  const errorObject = {}
  errors.forEach((error) => {
    const { message, path } = error
    errorObject[path] = message
  })
  return errorObject
}

export const validateRegex = {
  phoneNumber: /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/g,
}
