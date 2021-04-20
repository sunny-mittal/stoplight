import Transition from "./Transition"
import { State as TState } from "../types"
import { createStates, createTransitions } from "./utils"
import Machine from "./Machine"

class State<Event extends string, Context extends Record<string, unknown>> {
  // asynchronous action(s) to take when state is entered. Callbacks receive the current context and event along with a send function to trigger further transitions
  invoke?: any
  // k/v map of events to allowed transitions (see Transition for more information)
  on?: { [key in Event]?: Transition<Event, Context> }
  // k/v map of state names to state objects. These are the allowed states of the machine
  states?: Record<string, State<Event, Context>>
  // Reference to the machine
  machine: Machine<Event, Context>

  constructor(
    { invoke, on, states }: TState<Event, Context>,
    machine: Machine<Event, Context>,
  ) {
    this.invoke = invoke
    this.machine = machine
    this.on = createTransitions(on, machine)
    this.states = createStates(states, machine)
  }

  getTransition(event: Event) {
    return this.on?.[event]
  }

  send(event: Event, payload?: any) {
    const transition = this.getTransition(event)
    if (transition) {
      return transition.getTarget()
    }
  }
}

export default State
