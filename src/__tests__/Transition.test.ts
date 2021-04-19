import Transition from "../Transition"
import { mockMachine } from "./mocks"

const { a: stateA } = mockMachine.states

const simple = stateA.on.EVENT_B
const extended = stateA.on.EVENT_D
const extendedGuardedFail = stateA.on.SHOULD_FAIL
const extendedGuardedPass = stateA.on.SHOULD_PASS
const extendedGuardedMaybe = stateA.on.MIGHT_PASS
const multiple = stateA.on.EVENT_C

type TransitionObject = {
  target: string
}

describe("Transition#getTarget", () => {
  describe("unguarded transitions", () => {
    it("returns a simple string target", async () => {
      expect(await simple.getTarget()).toBe(
        (simple.__getTransition__() as TransitionObject).target,
      )
    })
    it("returns an extended, unguarded target", async () => {
      expect(await extended.getTarget()).toBe(
        (extended.__getTransition__() as TransitionObject).target,
      )
    })
  })
  describe("guarded transitions", () => {
    it("returns null when a guarded transition fails", async () => {
      expect(await extendedGuardedFail.getTarget()).toBeNull()
    })
    it("returns the correct target when guarded transition passes", async () => {
      expect(await extendedGuardedPass.getTarget()).toBe(
        (extendedGuardedPass.__getTransition__() as TransitionObject).target,
      )
    })
    it("passes the context to guarded transitions", async () => {
      mockMachine.write({ shouldPass: true })
      expect(await extendedGuardedMaybe.getTarget()).toBe(
        (extendedGuardedMaybe.__getTransition__() as TransitionObject).target,
      )
      mockMachine.write({ shouldPass: false })
      expect(await extendedGuardedMaybe.getTarget()).toBeNull()
    })
    it("falls back to unguarded transitions when guards fail", async () => {
      expect(await multiple.getTarget()).toBe("d")
    })
  })
})
