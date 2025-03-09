
export function scheduleRepeat(
  intervalMs: number,
  repeat: number,
  cb: (repeat: number) =>  void,
) {
  // eslint-disable-next-line no-extra-semi
  ;[...Array(repeat)].map((_, r) => {
    setTimeout(() => cb(r), intervalMs * r)
  })
}
