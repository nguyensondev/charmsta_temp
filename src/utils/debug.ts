export const consoleLog = (message: string, ...rest: any) => {
  if (__DEV__) {
    console.log(message, ...rest)
  }
}
