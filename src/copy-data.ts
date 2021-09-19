export function copyData() {
  return {
    copied: false,
    copy(text: string) {
      navigator.clipboard.writeText(text).catch((error) => {
        console.error(error)
      })

      this.copied = true
      window.setTimeout(() => {
        this.copied = false
      }, 5000)
    },
  }
}
