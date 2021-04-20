import Machine from "../Machine"
import { assign } from "../utils"

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
      invoke: assign({ shouldPass: false }),
      on: {
        EVENT_B: "b",
        EVENT_C: [
          { target: "c", guard: [stateGuardFn, "globalGuard"] },
          { target: "d", actions: ["a"] },
        ],
        EVENT_D: {
          target: "d",
          actions: jest.fn(),
        },
        SHOULD_FAIL: {
          target: "b",
          guard: () => Promise.resolve(false),
        },
        SHOULD_PASS: {
          target: "c",
          guard: () => Promise.resolve(true),
        },
        MIGHT_PASS: {
          target: "d",
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
    d: {
      invoke: () => (send: Function) => send("EVENT_A"),
      on: {
        EVENT_A: "a",
      },
    },
  },
  guards: {
    globalGuard: globalGuardFn,
  },
  actions: {
    a: jest.fn(),
  },
}

export const mockMachine = new Machine(mockConfig)
