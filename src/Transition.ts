import { Transition as TTransition, RootGuards, Guard } from "../types"
import Machine from "./Machine"

class Transition<
  Event extends string,
  Context extends Record<string, unknown>
> {
  private transition: Exclude<TTransition<Context>, string>
  // Reference to the machine
  machine: Machine<Event, Context>

  constructor(
    transition: TTransition<Context> | string,
    machine: Machine<Event, Context>,
  ) {
    this.transition =
      typeof transition === "string" ? { target: transition } : transition
    this.machine = machine
  }

  async getTarget() {
    const { transition } = this
    const { guards: rootGuards, context } = this.machine
    if (!Array.isArray(transition)) {
      const { guard, target } = transition
      if (!guard || (await areGuardsSatisfied(guard, rootGuards, context))) {
        return target
      }
    } else {
      for (let candidate of transition) {
        const { guard, target } = candidate
        if (await areGuardsSatisfied(guard, rootGuards, context)) {
          return target
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
