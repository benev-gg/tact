
import {obMap} from "@e280/stz"
import {bindingsTable} from "./table.js"
import {Bindings, BindingsShape} from "../types.js"

export function bindingsShape<B extends Bindings>(data: B) {
	const table = bindingsTable(data)
	const shape = obMap(data, bracket => obMap(bracket, () => 0)) as any

	for (const [id, {mode, action}] of table)
		shape[mode][action] = id

	return shape as BindingsShape<B>
}

