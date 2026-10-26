
import {html} from "lit"
import {isArray, isNumber, isString} from "@e280/stz"
import {Content, shadowView, useCss, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"

import {Deck} from "../../deck/types.js"
import {Bindings} from "../../../input/types.js"
import {ProfileSelectView} from "../profile-select/view.js"
import {isExpression} from "../../../input/investigate/is-expression.js"

export const BindingsView = shadowView((deck: Deck) => {
	useCss(themeCss, styleCss)
	const $profileKey = useSignal(deck.profiles.default)
	const profile = deck.profiles.get($profileKey())

	return html`
		<div class=plate>
			<header>
				${ProfileSelectView(deck, $profileKey(), $profileKey)}
			</header>

			<div class=bindings>
				${renderBindings(profile.bindings)}
			</div>
		</div>
	`
})

function renderBindings(b: Bindings): Content {
	if (isExpression(b)) {
		if (isNumber(b)) return html`<span>${b}</span>`
		if (isString(b)) return html`<span>${b}</span>`
		if (isArray(b)) return html`<span>(expression)</span>`
		return html`<span>(unknown)</span>`
	}
	else return Object.entries(b).map(([key, child]) => {
		return isExpression(child) ? html`
			<div class=expression>
				<strong>${key}</strong>
				${renderBindings(child)}
			</div>
		` : html`
			<details class=group open>
				<summary>${key}</summary>
				<div class=children>
					${renderBindings(child)}
				</div>
			</details>
		`
	})
}

