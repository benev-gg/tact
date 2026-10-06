
import {remap} from "@benev/math"
import {guarantee} from "@e280/stz"
import {isDown} from "./is-down.js"
import {Expression} from "../types.js"
import {Sample} from "../../sampling/types.js"

export class Evaluator {
	#now = 0
	#last: number | undefined
	#since = 0
	#samples: Sample[] = []
	#values = new Map<string, number>()
	#held = new WeakMap<object, {start: number}>()
	#tapped = new WeakMap<object, {previous: number, events: number[]}>()

	update(now: number, samples: Sample[]) {
		this.#now = now
		this.#since = this.#last === undefined
			? 0
			: now - this.#last
		this.#last = now
		this.#samples = samples
		for (const sample of samples)
			this.#values.set(sample.code, sample.value)
	}

	evaluate = (exp: Expression): number => {
		const e = this.evaluate.bind(this)

		if (typeof exp === "number")
			return exp

		else if (typeof exp === "string")
			return this.#values.get(exp) ?? 0

		else switch (exp[0]) {
			case "min":
				return Math.min(...exp.slice(1).map(e))

			case "max":
				return Math.max(...exp.slice(1).map(e))

			case "+":
				return exp.slice(1)
					.map(e)
					.reduce((p, c) => p + c, 0)

			case "*":
				return exp.slice(1)
					.map(e)
					.reduce((p, c) => p * c, 1)

			case "!":
				return +(e(exp[1]) === 0)

			case "!!":
				return +(e(exp[1]) !== 0)

			case "==":
				return +(e(exp[1]) === e(exp[2]))

			case "!=":
				return +(e(exp[1]) !== e(exp[2]))

			case ">":
				return +(e(exp[1]) > e(exp[2]))

			case "<":
				return +(e(exp[1]) < e(exp[2]))

			case ">=":
				return +(e(exp[1]) >= e(exp[2]))

			case "<=":
				return +(e(exp[1]) <= e(exp[2]))

			case "clamp": {
				const [, min, max, expr] = exp
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
				const [, [a, b], [c, d], expr] = exp
				return remap(e(expr), e(a), e(b), e(c), e(d))
			}

			case "dt":
				return this.#since / 1000

			case "accumulate": {
				const [, expr] = exp

				if (typeof expr !== "string")
					throw new Error("accumulate currently requires a code expression")

				let total = 0

				for (const sample of this.#samples)
					if (sample.code === expr)
						total += sample.value

				return total
			}

			case "held": {
				const [, ms, subexpression] = exp
				const down = isDown(e(subexpression))
				let held = this.#held.get(exp)

				if (down && !held) {
					held = {start: this.#now}
					this.#held.set(exp, held)
				}

				if (!down && held) {
					held = undefined
					this.#held.delete(exp)
				}

				if (held) {
					const timeHeld = this.#now - held.start
					if (timeHeld >= ms)
						return 1
				}

				return 0
			}

			case "tapped": {
				const [, ms, n, subexpression] = exp
				const value = e(subexpression)
				const tapped = guarantee(this.#tapped, exp, () => ({
					previous: 0,
					events: [],
				}))

				const nowDown = isDown(value)
				const wasDown = isDown(tapped.previous)
				tapped.previous = value

				if (nowDown && !wasDown) {
					tapped.events.push(this.#now)
					tapped.events = tapped.events.filter(time => time >= (this.#now - ms))
					while (tapped.events.length > 1024)
						tapped.events.shift()
					if (tapped.events.length >= n) {
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
}

