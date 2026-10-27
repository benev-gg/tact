
import {html} from "lit"
import {debounce, isArray, isNumber, isString} from "@e280/stz"
import {Content, lightView, shadowView, useCss, useOnce, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"

import {Deck} from "../../deck/types.js"
import {Bindings} from "../../../input/types.js"
import {Expression} from "../../../input/expression.js"
import {ProfileSelectView} from "../profile-select/view.js"
import {isExpression} from "../../../input/investigate/is-expression.js"

export const BindingsView = shadowView((deck: Deck) => {
	useCss(themeCss, styleCss)
	const $profileKey = useSignal(deck.profiles.default)
	const profile = deck.profiles.get($profileKey())

	const updateBindings = useOnce(() => debounce(200, (profileKey: string, bindings: Bindings) => {
		deck.profiles.updateBindings(profileKey, bindings)
	}))

	return html`
		<div class=plate theme-card>
			<header class=topbar>
				${ProfileSelectView(deck, $profileKey(), $profileKey)}
			</header>

			<div class=bindings>
				${renderBindings(
					profile.bindings,
					b => updateBindings($profileKey(), b),
				)}
			</div>
		</div>
	`
})

const ExpressionView = lightView((
		expression: Expression,
		update: (expression: Expression) => void,
	) => {

	if (isNumber(expression))
		return html`
			<div class=number>
				<input type=number step=any value="${expression}" @change="${(event: Event) => {
					const input = event.currentTarget as HTMLInputElement
					const value = input.valueAsNumber
					if (Number.isFinite(value))
						update(value)
				}}"/>
			</div>
		`

	if (isString(expression))
		return html`<div class=string>${expression}</div>`

	if (isArray(expression))
		return html`<div class=array>(expression)</div>`
})

function renderBindings(bindings: Bindings, update: (b: Bindings) => void): Content {
	return (isExpression(bindings)
		? ExpressionView(bindings, update)
		: Object.entries(bindings).map(([key, child]) => (
			isExpression(child)
				? html`
					<div class=expression>
						<strong>${key}</strong>
						${renderBindings(
							child,
							fresh => update({...bindings, [key]: fresh}),
						)}
					</div>
				`
				: html`
					<details class=group open>
						<summary>${key}</summary>
						<div class=children>
							${renderBindings(
								child,
								fresh => update({...bindings, [key]: fresh}),
							)}
						</div>
					</details>
				`)
		)
	)
}

