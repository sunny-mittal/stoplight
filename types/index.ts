import { default as StateClass } from "../src/State"

export type GuardFunction<Context> = (context: Context) => Promise<boolean>
export type Guard<Context> = string | GuardFunction<Context>

export type ActionFunction<Context> = (context: Context) => void
export type Action<Context> = string | ActionFunction<Context>

export type Invoke<
  Event extends string,
  Context extends Record<string, unknown>
> = (
  context: Context,
  event?: Event,
) => Context | ((send: StateClass<Event, Context>["send"]) => void)

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
export type EventMap<
  Event extends string,
  Context extends Record<string, unknown>
> = {
  [key in Event]?: Transition<Context>
}

export type State<
  Event extends string,
  Context extends Record<string, unknown>
> = {
  invoke?: Invoke<Event, Context>
  on?: EventMap<Event, Context>
  states?: Record<string, State<Event, Context>>
}
