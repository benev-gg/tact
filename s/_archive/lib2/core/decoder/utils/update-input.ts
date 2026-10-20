
import {Input} from "../../types.js"
import {isDown} from "../../utils/is-down.js"

export function updateInput(input: Input, value: number) {
	const previous = input.value

	input.value = value
	input.lowest = Math.min(input.lowest, value)
	input.highest = Math.max(input.highest, value)

	if (value !== previous)
		input.change = 1

	if (!isDown(previous) && isDown(value))
		input.down = 1

	if (isDown(previous) && !isDown(value))
		input.up = 1
}

