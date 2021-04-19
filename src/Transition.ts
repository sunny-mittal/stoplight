import { Transition as TTransition, RootGuards, Guard } from "../types"

class Transition<Context> {
  private transition: TTransition<Context>
  private rootGuards: RootGuards<Context>
  private context: Context

  constructor(
    transition: TTransition<Context>,
    context: Context,
    rootGuards: RootGuards<Context> = {},
  ) {
    this.transition = transition
    this.rootGuards = rootGuards
    this.context = context
  }

  async getTarget() {
    const { transition, rootGuards, context } = this
    if (typeof transition === "string") return transition
    if (!Array.isArray(transition)) {
      const { guard } = transition
      return !guard || (await areGuardsSatisfied(guard, rootGuards, context))
        ? transition.target
        : null
    } else {
      for (let candidate of transition) {
        if (await areGuardsSatisfied(candidate.guard, rootGuards, context)) {
          return candidate.target
        }
      }
    }
    return null
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
