
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

	evaluate = (expression: Expression): number => {
		if (typeof expression === "number")
			return expression

		else if (typeof expression === "string")
			return this.#values.get(expression) ?? 0

		else switch (expression[0]) {
			case "min":
				return Math.min(...expression.slice(1).map(this.evaluate))

			case "max":
				return Math.max(...expression.slice(1).map(this.evaluate))

			case "+":
				return expression.slice(1)
					.map(this.evaluate)
					.reduce((p, c) => p + c, 0)

			case "*":
				return expression.slice(1)
					.map(this.evaluate)
					.reduce((p, c) => p * c, 1)

			case ">":
				return +(this.evaluate(expression[1]) > this.evaluate(expression[2]))

			case "<":
				return +(this.evaluate(expression[1]) < this.evaluate(expression[2]))

			case ">=":
				return +(this.evaluate(expression[1]) >= this.evaluate(expression[2]))

			case "<=":
				return +(this.evaluate(expression[1]) <= this.evaluate(expression[2]))

			case "clamp": {
				const [, min, max, expr] = expression
				const value = this.evaluate(expr)
				return Math.min(
					max === null ? Infinity : this.evaluate(max),
					Math.max(
						min === null ? -Infinity : this.evaluate(min),
						value,
					),
				)
			}

			case "remap": {
				const [, [a, b], [c, d], expr] = expression
				const av = this.evaluate(a)
				const bv = this.evaluate(b)
				const cv = this.evaluate(c)
				const dv = this.evaluate(d)
				const value = this.evaluate(expr)
				const t = (value - av) / (bv - av)
				return cv + t * (dv - cv)
			}
		}

		throw new Error("unknown expression")
	}
}

