import invariant from "invariant"

import State from "./State"
import { ActionFunction, RootGuards, State as TState } from "../types"
import { createStates, getStateNode } from "./utils"
import { INVALID_INITIAL_STATE, NO_INITIAL_STATE } from "./constants"

type Config<Event extends string, Context extends Record<string, unknown>> = {
  initial: string
  states: Record<string, TState<Event, Context>>
  actions?: Record<string, ActionFunction<Context>>
  guards?: RootGuards<Context>
  context: Context
}

class Machine<Event extends string, Context extends Record<string, unknown>> {
  states: Record<string, State<Event, Context>>
  guards?: RootGuards<Context>
  actions?: Record<string, ActionFunction<Context>>
  context: Context
  stateString: string
  currentState: State<Event, Context>

  constructor({
    initial,
    states,
    actions,
    guards,
    context,
  }: Config<Event, Context>) {
    invariant(initial, NO_INITIAL_STATE)
    this.states = createStates(states, this)
    this.currentState = getStateNode(this, initial)
    invariant(this.currentState, INVALID_INITIAL_STATE)

    this.stateString = initial
    this.guards = guards
    this.actions = actions
    this.context = context
  }

  write(values: Partial<Context> = {}) {
    this.context = { ...this.context, ...values }
  }

  async send(event: Event, payload?: any) {
    const nextState = await this.currentState.send(event, payload)
  }
}

export default Machine
