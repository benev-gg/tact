
import {html} from "lit"
import {Content, lightView} from "@e280/sly"
import {isArray, isHappy, isNumber, isString} from "@e280/stz"

import {Expression} from "../../../../input/expression.js"
import xSmallSvg from "../../../icons/akar/x-small.svg.js"

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
					.value="${expression}"
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
		return html`
			<input type=text .value="${expression}" @change="${(event: Event) => {
				const input = event.currentTarget as HTMLInputElement
				const value = input.value
				update(value)
			}}"/>
		`

	if (isArray(expression))
		return (expression[0] === "mod") ? html`
			<div class="bracket mod">
				${expression.slice(1).length === 0
					? "unmodified"
					: expression.slice(1).join("+")}

				${expression.slice(1).length > 0
					? html`
						<button
							theme-button=naked
							@click="${() => update([expression[0]])}">
							${xSmallSvg}
						</button>
					`
					: null}
			</div>
		` : html`
			<div class=bracket>
				${expression[0] === "*" ? null : html`
					<strong>${expression[0]}</strong>
				`}
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

