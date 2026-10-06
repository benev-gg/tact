
import {remap} from "@benev/math"
import {Expression} from "../types.js"
import {Sample} from "../../sampling/types.js"

export class Evaluator {
	#since = 0
	#samples: Sample[] = []
	#values = new Map<string, number>()

	update(since: number, samples: Sample[]) {
		this.#since = since
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

			case "!":
				return +(e(exp[1]) <= 0)

			case "!!":
				return +(e(exp[1]) > 0)

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
		}

		throw new Error("unknown expression")
	}
}

