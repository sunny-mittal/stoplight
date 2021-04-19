import Transition from "../Transition"
import { mockConfig } from "./mockConfig"

const { a: stateA } = mockConfig.states

const { guards } = mockConfig
const simple = stateA.on.EVENT_B
const extended = stateA.on.EVENT_D
const extendedGuardedFail = stateA.on.SHOULD_FAIL
const extendedGuardedPass = stateA.on.SHOULD_PASS
const extendedGuardedMaybe = stateA.on.MIGHT_PASS
const multiple = stateA.on.EVENT_C

describe("Transition#getTarget", () => {
  describe("unguarded transitions", () => {
    it("returns a simple string target", async () => {
      const transition = new Transition(simple, null, guards)
      expect(await transition.getTarget()).toBe(simple)
    })

    it("returns and extended, unguarded target", async () => {
      const transition = new Transition(extended, null, guards)
      expect(await transition.getTarget()).toBe(extended.target)
    })
  })

  describe("guarded transitions", () => {
    it("returns null when a guarded transition fails", async () => {
      const transition = new Transition(extendedGuardedFail, null, guards)
      expect(await transition.getTarget()).toBeNull()
    })

    it("returns the correct target when guarded transition passes", async () => {
      const transition = new Transition(extendedGuardedPass, null, guards)
      expect(await transition.getTarget()).toBe(extendedGuardedPass.target)
    })

    it("passes the context to guarded transitions", async () => {
      let transition = new Transition(
        extendedGuardedMaybe,
        { shouldPass: true },
        guards,
      )
      expect(await transition.getTarget()).toBe(extendedGuardedMaybe.target)

      transition = new Transition(
        extendedGuardedMaybe,
        { shouldPass: false },
        guards,
      )
      expect(await transition.getTarget()).toBeNull()
    })

    it("falls back to unguarded transitions when guards fail", async () => {
      const transition = new Transition(multiple, null, guards)
      expect(await transition.getTarget()).toBe("d")
    })
  })
})
