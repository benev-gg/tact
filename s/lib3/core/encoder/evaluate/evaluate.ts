
import {remap} from "@benev/math"
import {arraylimit, guarantee, isNumber, isString} from "@e280/stz"
import {Expression} from "../../types.js"
import {isDown} from "../../utils/is-down.js"
import {EvaluationContext} from "./context.js"

export function evaluate(
		context: EvaluationContext,
		expression: Expression,
	): number {

	const e = (expression: Expression) => evaluate(context, expression)

	if (isNumber(expression))
		return expression

	else if (isString(expression))
		return context.sampleValues.get(expression) ?? 0

	else switch (expression[0]) {
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

		case "!":
			return +(e(expression[1]) === 0)

		case "!!":
			return +(e(expression[1]) !== 0)

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
			const [, a, b, c, d, expr] = expression
			return remap(e(expr), e(a), e(b), e(c), e(d))
		}

		case "dt":
			return context.clock.since / 1000

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

		case "taps": {
			const [, taps, ms, subexpression] = expression
			const value = e(subexpression)
			const tapped = guarantee(context.tapping, expression, () => ({
				previous: 0,
				events: [],
			}))

			const nowDown = isDown(value)
			const wasDown = isDown(tapped.previous)
			tapped.previous = value

			if (nowDown && !wasDown) {
				tapped.events.push(context.clock.time)
				tapped.events = arraylimit(
					tapped.events.filter(time => time >= (context.clock.time - ms)),
					1024,
				)
				if (tapped.events.length >= taps) {
					tapped.events = []
					return 1
				}
			}

			return 0
		}

		default:
			throw new Error("unknown expression")
	}
}

