import invariant from "invariant"

import State from "./State"
import { ActionFunction, RootGuards, State as TState } from "../types"
import { createStates, getStateNode, parseState } from "./utils"
import { INVALID_INITIAL_STATE, NO_INITIAL_STATE } from "./constants"

type Config<Event extends string, Context extends Record<string, unknown>> = {
  initial: string
  states: Record<string, TState<Event, Context>>
  actions?: Record<string, ActionFunction<Context>>
  guards?: RootGuards<Context>
  context: Context
}

class Machine<Event extends string, Context extends Record<string, unknown>> {
  // recursive data structure that enumerates all allowed states and their transitions
  states: Record<string, State<Event, Context>>
  // k/v map of guards to functions used by string guard types on states
  guards?: RootGuards<Context>
  // k/v map of actions to functions used by string action types on states
  actions?: Record<string, ActionFunction<Context>>
  // read-write data object passed around to check guards, pass into actions, etc
  context: Context
  // Simple string representation of state to make state checking simpler
  private currentState: string
  // Actual state object through which to dispatch events
  currentNode: State<Event, Context>

  constructor({
    initial,
    states,
    actions,
    guards,
    context,
  }: Config<Event, Context>) {
    invariant(initial, NO_INITIAL_STATE)
    this.states = createStates(states, this)
    this.currentNode = getStateNode(this, initial)
    invariant(this.currentNode, INVALID_INITIAL_STATE)

    this.currentState = initial
    this.guards = guards
    this.actions = actions
    this.context = context

    // Handle initial state `invoke`
    this.runInvoke()
  }

  write(values: Partial<Context>) {
    this.context = { ...this.context, ...values }
  }

  private runInvoke(event?: Event, payload?: any) {
    const invocation = this.currentNode.invoke?.(this.context, event)
    if (typeof invocation === "function") {
      invocation(this.send.bind(this))
    } else {
      this.context = invocation
    }
  }

  async send(event: Event, payload?: any) {
    const nextState = await this.currentNode.send(event, payload)
    if (!nextState) return
    if (nextState !== this.currentState) {
      const nextNode = getStateNode(this, nextState)
      if (nextNode) {
        this.currentNode = nextNode
        this.currentState = nextState
        this.runInvoke(event, payload)
      }
    }
  }

  toStrings() {
    return parseState(this.currentState)
  }

  get value() {
    return this.currentState
  }
}

export default Machine
