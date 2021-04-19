import { INVALID_INITIAL_STATE, NO_INITIAL_STATE } from "../constants"
import Machine from "../Machine"

describe("Machine", () => {
  it("enforces an initial state", () => {
    // @ts-expect-error
    expect(() => new Machine({})).toThrow(NO_INITIAL_STATE)
  })

  it("validates the initial state", () => {
    // @ts-expect-error
    expect(() => new Machine({ initial: "nope" })).toThrow(
      INVALID_INITIAL_STATE,
    )
  })
})
