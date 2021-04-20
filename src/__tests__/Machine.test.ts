import { INVALID_INITIAL_STATE, NO_INITIAL_STATE } from "../constants"
import Machine from "../Machine"
import { mockMachine } from "./mocks"

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

  it("handles `assign` calls in `invoke` property", async () => {
    // mockMachine has initial context set to { shouldPass: true } while `invoke` sets it to false so the following shouldn't transition
    await mockMachine.send("MIGHT_PASS")
    expect(mockMachine.value).toBe("a")
  })

  it("handles extended `invoke` properties", async () => {
    // transitioning to state d should immediately go back to a
    expect(mockMachine.value).toBe("a")
    await mockMachine.send("EVENT_D")
    expect(mockMachine.value).toBe("a")
    // extra test to be sure
    await mockMachine.send("EVENT_B")
    expect(mockMachine.value).toBe("b")
  })
})
