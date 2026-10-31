
import {remap} from "@benev/math"
import {arraylimit, guarantee, isHappy, isNumber, isString} from "@e280/stz"

import {isDown} from "../utils/is-down.js"
import {EvaluationContext} from "./context.js"
import type {Expression} from "../expression.js"

export function evaluate(
		context: EvaluationContext,
		expression: Expression,
	): number {

	const e = (expression: Expression) => evaluate(context, expression)

	if (expression === null)
		return 0

	if (isNumber(expression))
		return expression

	else if (isString(expression)) {
		const latest = context.latestValues.get(expression) ?? 0
		return context.recentSamples
			.filter(s => s.code === expression)
			.reduce(
				(peak, s) => Math.abs(s.value) > Math.abs(peak)
					? s.value
					: peak,
				latest,
			)
	}

	else switch (expression[0]) {
		case "accumulate": {
			const code = expression[1]
			let x = 0
			for (const sample of context.recentSamples) {
				if (sample.code === code)
					x += sample.value
			}
			return x
		}

		case "up": {
			const code = expression[1]
			let ups = 0
			let was = context.previousValues.get(code) ?? 0
			for (const sample of context.recentSamples) {
				if (sample.code !== code) continue
				if (isDown(was) && !isDown(sample.value))
					ups++
				was = sample.value
			}
			return ups
		}

		case "down": {
			const code = expression[1]
			let downs = 0
			let was = context.previousValues.get(code) ?? 0
			for (const sample of context.recentSamples) {
				if (sample.code !== code) continue
				if (!isDown(was) && isDown(sample.value))
					downs++
				was = sample.value
			}
			return downs
		}

		case "was": {
			const code = expression[1]
			return context.previousValues.get(code) ?? 0
		}

		case "since": {
			const code = expression[1]
			const was = context.previousValues.get(code) ?? 0
			const latest = context.latestValues.get(code) ?? 0
			return latest - was
		}

		case "if": {
			const [, condition, yes, no] = expression
			return e(condition)
				? e(yes)
				: (isHappy(no) ? e(no) : 0)
		}

		case "min":
			return Math.min(...expression.slice(1).map(e))

		case "max":
			return Math.max(...expression.slice(1).map(e))

		case "+":
			return expression.slice(1)
				.map(e)
				.reduce((p, c) => p + c, 0)

		case "*":
			return expression.slice(1)
				.map(e)
				.reduce((p, c) => p * c, 1)

		case "==":
			return +(e(expression[1]) === e(expression[2]))

		case "!=":
			return +(e(expression[1]) !== e(expression[2]))

		case ">":
			return +(e(expression[1]) > e(expression[2]))

		case "<":
			return +(e(expression[1]) < e(expression[2]))

		case ">=":
			return +(e(expression[1]) >= e(expression[2]))

		case "<=":
			return +(e(expression[1]) <= e(expression[2]))

		case "!":
			return +(e(expression[1]) === 0)

		case "!!":
			return +(e(expression[1]) !== 0)

		case "-": {
			const [, first, ...rest] = expression
			if (rest.length === 0) return -e(first)
			let value = e(first)
			for (const neg of rest) value -= e(neg)
			return value
		}

		case "clamp": {
			const [, min, max, expr] = expression
			const value = e(expr)
			return Math.min(
				max === null ? Infinity : e(max),
				Math.max(
					min === null ? -Infinity : e(min),
					value,
				),
			)
		}

		case "remap": {
			const [a, b, c, d, value] = expression.slice(1).map(e)
			return remap(value, a, b, c, d)
		}

		case "dt":
			return context.dt

		case "held": {
			const [, ms, subexpression] = expression
			const down = isDown(e(subexpression))
			let held = context.holding.get(expression)

			if (down && !held) {
				held = {start: context.clock.time}
				context.holding.set(expression, held)
			}

			if (!down && held) {
				held = undefined
				context.holding.delete(expression)
			}

			if (held) {
				const timeHeld = context.clock.time - held.start
				if (timeHeld >= ms)
					return 1
			}

			return 0
		}

		// case "taps": {
		// 	const [, taps, ms, subexpression] = expression
		// 	const down = isDown(e(subexpression))
		// 	const now = context.clock.time
		//
		// 	const state = guarantee(context.tapping, expression, () => ({
		// 		wasDown: false,
		// 		start: null as number | null,
		// 		count: 0,
		// 	}))
		//
		// 	// Expire the gesture.
		// 	if (state.start !== null && now - state.start > ms) {
		// 		state.start = null
		// 		state.count = 0
		// 	}
		//
		// 	let result = 0
		//
		// 	// Rising edge: begin a gesture.
		// 	if (down && !state.wasDown && state.start === null)
		// 		state.start = now
		//
		// 	// Falling edge: complete a tap.
		// 	if (!down && state.wasDown && state.start !== null) {
		// 		state.count++
		//
		// 		if (state.count >= taps) {
		// 			result = 1
		// 			state.count = 0
		// 			state.start = null
		// 		}
		// 	}
		//
		// 	state.wasDown = down
		// 	return result
		// }

		case "taps": {
			const [, taps, ms, subexpression] = expression
			const down = isDown(e(subexpression))
			const {time} = context.clock

			const records = guarantee(context.tapping, expression, () => ({
				events: [],
			}))

			records.events.push({time, down})
			records.events = records.events.filter(e => {
				const age = time - e.time
				return age < ms
			})
			records.events = arraylimit(records.events, 1024)

			let count = 0
			let wasDown = false
			for (const e of records.events) {
				if (wasDown && !e.down) count++
				wasDown = e.down
			}

			if (count === taps) {
				records.events = []
				return 1
			}
			else return 0
		}

		case "mod": {
			const [, ...modifiers] = expression
			const down = (code: string) =>
				isDown(context.latestValues.get(code) ?? 0)

			const shift = down("ShiftLeft") || down("ShiftRight")
			const ctrl = down("ControlLeft") || down("ControlRight")
			const alt = down("AltLeft") || down("AltRight")
			const meta = down("MetaLeft") || down("MetaRight")

			if (modifiers.includes("shift") !== shift) return 0
			if (modifiers.includes("ctrl") !== ctrl) return 0
			if (modifiers.includes("alt") !== alt) return 0
			if (modifiers.includes("meta") !== meta) return 0

			return 1
		}

		default:
			throw new Error("unknown expression")
	}
}

