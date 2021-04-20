import { useMemo, useEffect, useState } from "react"
import { Schema } from "../types"
import Machine from "./Machine"

export const useMachine = <
  E extends string,
  C extends Record<string, unknown>,
  S extends Schema<E, C>
>(
  config: S,
  extension?: S,
) => {
  const machine = useMemo(() => {
    return new Machine({ ...config, ...extension })
  }, [config, extension])

  // state is not intended for use (though you can use it)
  // it's more of a hack to ensure users of the hook update properly when states change
  // for state matching, use `matches`
  const [state, setState] = useState(machine.value)
  const { matches, context, send, toStrings } = machine

  useEffect(() => {
    machine.subscribe(setState)
  }, [machine])

  return useMemo(() => {
    return [{ matches, context, toStrings, state }, send] as const
  }, [context, matches, send, state, toStrings])
}
