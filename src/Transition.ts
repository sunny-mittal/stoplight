import { Transition as TTransition, RootGuards, Guard } from "../types"
import Machine from "./Machine"

class Transition<
  Event extends string,
  Context extends Record<string, unknown>
> {
  private transition: TTransition<Context>
  // Reference to the machine
  machine: Machine<Event, Context>

  constructor(
    transition: TTransition<Context>,
    machine: Machine<Event, Context>,
  ) {
    this.transition =
      typeof transition === "string" ? { target: transition } : transition
    this.machine = machine
  }

  async getTarget() {
    const { transition } = this
    const { guards, context } = this.machine
    if (!Array.isArray(transition)) {
      const { guard } = transition
      return !guard || (await areGuardsSatisfied(guard, guards, context))
        ? transition.target
        : null
    } else {
      for (let candidate of transition) {
        if (await areGuardsSatisfied(candidate.guard, guards, context)) {
          return candidate.target
        }
      }
    }
    return null
  }

  // Testing only
  __getTransition__() {
    return this.transition
  }
}

const areGuardsSatisfied = async <Context>(
  guard: Guard<Context> | Guard<Context>[],
  rootGuards: RootGuards<Context>,
  context: Context,
) => {
  const guards = [guard].flat().filter(Boolean)
  for (let guard of guards) {
    const guardFn = typeof guard === "string" ? rootGuards[guard] : guard
    if (!(await guardFn(context))) return false
  }
  return true
}

export default Transition
