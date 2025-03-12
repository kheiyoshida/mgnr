export const fireByRate = (rate: number) => {
  if (rate > 1 || rate < 0) {
    throw Error('rate should be between 0.0 and 1.0')
  }
  return Math.random() <= rate
}

export const randomFloatBetween = (min: number, max: number) => {
  const ratio = Math.random()
  return (max - min) * ratio + min
}

/**
 * not inclusive for max value
 * @deprecated use `randomIntInclusiveBetween`
 */
export const randomIntBetween = (min: number, max: number) => {
  return Math.floor(randomFloatBetween(min, max))
}

export const randomIntInclusiveBetween = (min: number, max: number) => {
  return Math.floor(randomFloatBetween(min, max + 1))
}

export const randomIntInAsymmetricRange = (range: number) => {
  return randomIntInclusiveBetween(-range, range)
}

export const randomFloatInAsymmetricRange = (range: number) => {
  return randomFloatBetween(-range, range)
}

export type ArgsRandomizer<Fn extends (...args: never[]) => unknown> = (
  ...args: Parameters<Fn>
) => Parameters<Fn>

/**
 * Constrain random value by forbidding emitting the same value (or classified one) for defined amount of times.
 * If random value emitter emits the same value for a defined number of times in a row, it forces it to retry.
 *
 * @param valueEmitter random value function
 * @param classify classify emit values (check if the value should be treated as a same value as the previous one)
 * @param allowedTimes the number of times it can emit same values for
 */
export const makeConstrainedRandomEmitter = <V>(
  valueEmitter: () => V,
  classify: (value: V, prev: V) => boolean,
  allowedTimes: number
): (() => V) => {
  if (allowedTimes <= 1) throw Error(`allowedTimes should be greater than 1`)

  let prev: V;
  let count = 0;

  const constrainedEmitter = (retry = 0): V => {
    if (retry > 300) throw Error(`retry times exceeded limit`)
    const value = valueEmitter()
    if (!prev) { // initial call
      count += 1;
      prev = value;
      return value;
    } else {
      if (classify(value, prev)){
        count += 1;
        if (count > allowedTimes) return constrainedEmitter(++retry)
        return value;
      } else { // different result
        count = 1;
        prev = value;
        return value;
      }
    }
  }

  return constrainedEmitter
}
