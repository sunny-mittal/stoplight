export type GuardFunction<Context> = (context: Context) => Promise<boolean>
export type Guard<Context> = string | GuardFunction<Context>

export type ActionFunction<Context> = (context: Context) => void
export type Action<Context> = string | ActionFunction<Context>

export type ExtendedTransition<Context> = {
  target?: string
  guard?: Guard<Context> | Guard<Context>[]
  actions?: Action<Context> | Action<Context>[]
}

export type Transition<Context> =
  | string
  | ExtendedTransition<Context>
  | ExtendedTransition<Context>[]

export type RootGuards<Context> = Record<string, GuardFunction<Context>>
