
import {html} from "lit"
import {lightView} from "@e280/sly"
import {isArray, isNumber, isString} from "@e280/stz"
import {Expression} from "../../../../input/expression.js"

export const ExpressionView = lightView((
		expression: Expression,
		update: (expression: Expression) => void,
	) => {

	if (expression === null)
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
		return html`
			<div class=string>
				<input type=text value="${expression}" @change="${(event: Event) => {
					const input = event.currentTarget as HTMLInputElement
					const value = input.value
					update(value)
				}}"/>
			</div>
		`

	if (isArray(expression))
		return html`<div class=array>(expression)</div>`
})

