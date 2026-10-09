
import {Input} from "../../types.js"

export function makeInput(): Input {
	return {
		value: 0,
		previous: 0,
		pulses: 0,

		change: 0,
		down: 0,
		up: 0,

		lowest: 0,
		highest: 0,
	}
}

