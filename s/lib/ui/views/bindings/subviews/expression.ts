
import {html} from "lit"
import {Content, lightView} from "@e280/sly"
import {isArray, isHappy, isNumber, isString} from "@e280/stz"

import {RecordingView} from "./recording.js"
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
		return RecordingView(update, html`
			<input type=text .value="${expression}" @change="${(event: Event) => {
				const input = event.currentTarget as HTMLInputElement
				const value = input.value
				update(value)
			}}"/>
		`)

	if (isArray(expression)) {
		if (expression[0] === "mod") return html`
			<div class="bracket mod">
				${expression.slice(1).map(e => html`<span>${e}</span>`)}
			</div>
		`
		const rend = expression[0] === "*"
			? (c: Content) => RecordingView(update, c)
			: (c: Content) => c
		return rend(html`
			<div class=bracket>
				<strong>${expression[0]}</strong>
				${expression.slice(1).map((e, i) => {
					return ExpressionView(e ?? null, fresh => {
						const clone = structuredClone(expression) as any
						clone[i + 1] = fresh
						update(clone)
					})
				})}
			</div>
		`)
	}

	else
		throw new Error("unknown expression")
})

