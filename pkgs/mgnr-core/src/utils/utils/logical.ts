export const compareTuples = <T>(valueTuple: [T, T], compareTuple: [T, T]): boolean => {
  if (valueTuple[0] === compareTuple[0] && valueTuple[1] === compareTuple[1]) return true
  if (valueTuple[0] === compareTuple[1] && valueTuple[1] === compareTuple[0]) return true
  return false
}

export function negateIf(condition: boolean, value: boolean) {
  if (condition) {
    return !value
  }
  return value
}

export function loop(num: number, cb: (i: number) => void) {
  for (let i = 0; i < num; i++) {
    cb(i)
  }
}

export function loop2D(num: number, cb: (x: number, y: number) => void) {
  loop(num, (x) => {
    loop(num, (y) => {
      cb(x, y)
    })
  })
}

export function loop3D(num: number, cb: (x: number, y: number, z: number) => void) {
  loop(num, (x) => {
    loop(num, (y) => {
      loop(num, (z) => {
        cb(x, y, z)
      })
    })
  })
}
