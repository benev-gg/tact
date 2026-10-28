
import {html} from "lit"
import {Content, lightView} from "@e280/sly"
import {isArray, isHappy, isNumber, isString} from "@e280/stz"

import {StringView} from "./string-view.js"
import {Expression} from "../../../../input/expression.js"

export const ExpressionView = lightView((
		expression: Expression,
		update: (expression: Expression) => void,
	): Content => {

	if (!isHappy(expression))
		return html`
			<div class=null>unset</div>
		`

	if (isNumber(expression))
		return html`
			<div class=number>
				<input
					type=number
					step=any
					value="${expression}"
					@change="${(event: Event) => {
						const input = event.currentTarget as HTMLInputElement
						const value = input.valueAsNumber
						if (Number.isFinite(value))
							update(value)
					}}"
					/>
			</div>
		`

	if (isString(expression))
		return StringView(expression, update)

	if (isArray(expression))
		return html`
			<div class=bracket theme-card>
				<strong>${expression[0]}</strong>
				${expression.slice(1).map((e, i) => {
					return ExpressionView(e ?? null, fresh => {
						const clone = structuredClone(expression) as any
						clone[i + 1] = fresh
						update(clone)
					})
				})}
			</div>
		`

	else
		throw new Error("unknown expression")
})

