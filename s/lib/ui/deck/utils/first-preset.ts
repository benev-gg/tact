
import {Presets} from "../types.js"
import {Bindings} from "../../../input/types.js"

export function firstPreset<B extends Bindings>(presets: Presets<B>) {
	const [key, profile] = Object.entries(presets)[0]
	return {key, profile}
}

