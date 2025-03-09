
export const makeStore = <T extends Record<string, unknown>>() => {
  let data: Readonly<T>

  const init = (initialValue: T) => {
    if (data) {
      throw new Error(`already initialized`)
    }
    data = initialValue
  }

  /**
   * update field of state using old value. It will renew the whole state object
   */
  const update = <K extends keyof T>(key: K, val: ((v: T[K]) => T[K]) | T[K]) => {
    if(val instanceof Function) {
      _update(key, val(data[key]))
    } else {
      _update(key, val)
    }
  }

  const _update = <K extends keyof T>(key: K, newVal: T[K]) => {
    data = { ...data, [key]: newVal }
  }

  /**
   * update state in bulk
   * @param newState partial fields of entire state
   */
  const bulkUpdate = (newState: Partial<T>) => {
    data = { ...data, ...newState }
  }

  function read(): Readonly<T>
  function read<K extends keyof T>(key: K): Readonly<T>[K]
  function read<K extends keyof T>(key?: K) {
    return key ? data[key] : data
  }

  return { init, update, read, bulkUpdate }
}
