
import {html} from "lit"
import {shadowView, useCss, useOnce, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"

import {Deck} from "../../deck/types.js"
import {Bindings} from "../../../input/types.js"
import {renderBindings} from "./parts/render-bindings.js"
import {ProfileSelectView} from "../profile-select/view.js"

export const BindingsView = shadowView((deck: Deck) => {
	useCss(themeCss, styleCss)
	const $profileKey = useSignal(deck.profiles.default)
	const profile = deck.profiles.get($profileKey())

	const updateBindings = useOnce(() =>
		(profileKey: string, bindings: Bindings) => {
			deck.profiles.updateBindings(profileKey, bindings)
		}
	)

	return html`
		<div class=plate theme-card>
			<header class=topbar>
				${ProfileSelectView(deck, $profileKey(), $profileKey)}
			</header>

			<div class=bindings>
				${renderBindings(
					profile.bindings,
					structuredClone(deck.bindings),
					b => updateBindings($profileKey(), b),
				)}
			</div>
		</div>
	`
})

