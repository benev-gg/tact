
import {html} from "lit"
import {shadowDuplex, useCss, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"

import {Deck} from "../../deck/types.js"
import {Bindings} from "../../../input/types.js"
import {renderBindings} from "./parts/render-bindings.js"
import {ProfileSelectView} from "../profile-select/view.js"

export const [BindingsView, makeBindingsElement] = shadowDuplex((deck: Deck) => {
	useCss(themeCss, styleCss)
	const {profiles} = deck
	const $profileKey = useSignal(profiles.defaultKey)

	const profile = profiles.get($profileKey())
	const isReadonly = profiles.stock.has($profileKey())

	const updateBindings = (profileKey: string, bindings: Bindings) =>
		profiles.update(profileKey, {bindings})

	const updateLabel = (profileKey: string, label: string) =>
		profiles.update(profileKey, {label})

	const clone = () =>
		$profileKey.set(profiles.clone($profileKey()))

	const destroy = () =>
		profiles.delete($profileKey())

	return html`
		<div class=plate theme-card>
			<header class=topbar>
				${ProfileSelectView(deck, $profileKey(), $profileKey)}

				<div class=tools>
					${isReadonly ? null : html`
						<input
							type=text
							.value="${profile.label}"
							@change="${(event: Event) => {
								const input = event.currentTarget as HTMLInputElement
								updateLabel($profileKey(), input.value)
							}}"
							/>
					`}

					<button @click="${clone}">
						clone
					</button>

					${isReadonly ? null : html`
						<button @click="${destroy}">
							delete
						</button>
					`}
				</div>
			</header>

			<div class=bindings>
				${renderBindings(
					isReadonly,
					profile.bindings,
					structuredClone(deck.bindings),
					b => updateBindings($profileKey(), b),
				)}
			</div>
		</div>
	`
})

