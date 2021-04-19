import Machine from "../Machine"

export const globalGuardFn = () => Promise.resolve(false)
export const stateGuardFn = () => Promise.resolve(true)

const mockConfig = {
  initial: "a",
  context: {
    int: 4,
    str: "string",
    shouldPass: true,
  },
  states: {
    a: {
      on: {
        EVENT_B: "b",
        EVENT_C: [
          { target: "c", guard: [stateGuardFn, "globalGuard"] },
          { target: "d", actions: ["a"] },
        ],
        EVENT_D: {
          target: "d",
        },
        SHOULD_FAIL: {
          target: "nope",
          guard: () => Promise.resolve(false),
        },
        SHOULD_PASS: {
          target: "yes!",
          guard: () => Promise.resolve(true),
        },
        MIGHT_PASS: {
          target: "passed",
          guard: (context) => Promise.resolve(context.shouldPass),
        },
      },
      states: {
        child: {
          on: {
            EVENT_B: "b",
          },
        },
      },
    },
    b: {
      on: {
        EVENT_A: {
          target: "a.child",
        },
        EVENT_C: "c",
      },
    },
    c: {},
    d: {},
  },
  guards: {
    globalGuard: globalGuardFn,
  },
  actions: {},
}

export const mockMachine = new Machine(mockConfig)
