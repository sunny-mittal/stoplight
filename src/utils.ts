import { State as TState, Transition as TTransition, EventMap } from "../types"
import Machine from "./Machine"
import State from "./State"
import Transition from "./Transition"

const DELIMITER = "."
export const parseState = (state: string) => state.split(DELIMITER)

export const getStateNode = <
  Event extends string,
  Context extends Record<string, unknown>
>(
  machine: Machine<Event, Context>,
  state: string,
): State<Event, Context> | null => {
  return parseState(state).reduce(
    (result: State<Event, Context> | null, key) => {
      return result ? result.states?.[key] || null : null
    },
    // TODO: see if we can avoid the cast to unknown
    (machine as unknown) as State<Event, Context>,
  )
}

export const createStates = <
  Event extends string,
  Context extends Record<string, unknown>
>(
  stateMap: Record<string, TState<Event, Context>> = {},
  machine: Machine<Event, Context>,
) => {
  return Object.entries<TState<Event, Context>>(stateMap).reduce(
    (states, [name, state]) => ({
      ...states,
      [name]: new State(state, machine),
    }),
    {} as Record<string, State<Event, Context>>,
  )
}

export const createTransitions = <
  Event extends string,
  Context extends Record<string, unknown>
>(
  eventMap: EventMap<Event, Context> = {},
  machine: Machine<Event, Context>,
) => {
  return Object.entries<TTransition<Context> | string>(eventMap).reduce(
    (transitions, [event, transition]) => ({
      ...transitions,
      [event]: new Transition(transition, machine),
    }),
    {} as Record<Event, Transition<Event, Context>>,
  )
}
