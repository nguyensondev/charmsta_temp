export const convertYupErrorInner = (errors: Array<{ message: string; path: string }>) => {
  const errorObject = {}
  errors.forEach((error) => {
    const { message, path } = error
    errorObject[path] = message
  })
  return errorObject
}
