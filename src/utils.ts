import {
  State as TState,
  Transition as TTransition,
  EventMap,
  ActionFunction,
  Action,
} from "../types"
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

export const executeActions = <Context extends Record<string, unknown>>(
  stateActions: Action<Context> | Action<Context>[],
  rootActions: Record<string, ActionFunction<Context>>,
  context: Context,
) => {
  if (!stateActions) return
  if (!Array.isArray(stateActions)) {
    if (typeof stateActions === "string") rootActions?.[stateActions]?.(context)
    else stateActions(context)
  } else {
    for (let action of stateActions) {
      if (typeof action === "string") rootActions?.[action]?.(context)
      else action(context)
    }
  }
}

export const assign = <Context extends Record<string, unknown>>(
  updates: Context,
) => (context: Context) => ({ ...context, ...updates })
