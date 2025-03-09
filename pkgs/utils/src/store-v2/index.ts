export type State = Record<string, unknown>

export type Reducer<S extends State> = (state: S) => (...args: never[]) => void

export type ReducerMap<S extends State> = Record<string, Reducer<S>>

export interface Store<S> {
  /**
   * initializes the state using the given lazy initializer function
   */
  lazyInit: () => void

  /**
   * current state
   */
  current: Readonly<S>
}

export type StoreWithReducers<S extends State, RM extends ReducerMap<S>> = Store<S> & {
  [k in keyof RM]: ReturnType<RM[k]>
}

export type LazyInit<S> = () => S

export const makeStoreV2 =
  <S extends State>(initialState: S | LazyInit<S>) =>
  <RM extends ReducerMap<S>>(reducerMap: RM): StoreWithReducers<S, RM> => {
    let state: Readonly<S>

    let lazyInit: LazyInit<S>
    if (initialState instanceof Function) {
      lazyInit = initialState
    } else {
      state = initialState
    }

    const bound = Object.fromEntries(
      Object.entries(reducerMap).map(([k, reducer]) => [k, (...args) => reducer(state)(...args)])
    ) as {
      [k in keyof RM]: ReturnType<RM[k]>
    }

    return {
      ...bound,
      lazyInit() {
        if (!lazyInit) throw Error(`lazy initializer was not provided`)
        state = lazyInit()
      },
      get current() {
        if (!state) throw Error(`state is not initalized yet`)
        return state
      },
    }
  }
