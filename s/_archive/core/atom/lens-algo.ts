
import {pipe} from "@e280/stz"
import {CodeState} from "./types.js"
import {defaultHoldTime} from "./defaults.js"
import {isDown} from "../../utils/is-down.js"
import {between, clamp, remap} from "@benev/math"

export const lensAlgo = (
		now: number,
		state: CodeState,
		v: number,
	) => pipe(v).line(

	function clippings(value) {
		const {settings} = state
		if (settings.clamp) {
			const [bottom, top] = settings.clamp
			value = clamp(value, bottom, top)
		}
		if (settings.range) {
			const [bottom, top] = settings.range
			value = between(value, bottom, top)
				? remap(
					value,
					bottom, top,
					0, 1,
					true,
				)
				: 0
		}
		if (settings.bottom) value = (value < settings.bottom) ? 0 : value
		if (settings.top) value = Math.min(settings.top, value)
		return value
	},

	function inversion(value) {
		return state.settings.invert
			? 1 - value
			: value
	},

	function scaling(value) {
		return state.settings.scale * value
	},

	function timing(value) {
		const {settings} = state

		const holdTime = (
			settings.timing[0] === "direct"
				? undefined
				: settings.timing[1]
		) ?? defaultHoldTime

		const isFreshlyPressed = !isDown(state.lastValue) && isDown(value)
		const isFreshlyReleased = isDown(state.lastValue) && !isDown(value)

		if (isFreshlyPressed)
			state.holdStart = now

		const isHolding = (now - state.holdStart) >= holdTime

		state.lastValue = value

		switch (settings.timing[0]) {
			case "direct":
				return value

			case "tap":
				return (isFreshlyReleased && !isHolding)
					? 1
					: 0

			case "hold":
				return (isDown(value) && isHolding)
					? value
					: 0

			default:
				throw new Error(`unknown bindings timing`)
		}
	},
)

