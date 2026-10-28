
import {html} from "lit"
import {shadowDuplex, useCss, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"

import {Deck} from "../../deck/types.js"
import {Bindings} from "../../../input/types.js"
import {renderBindings} from "./parts/render-bindings.js"
import {ProfileSelectView} from "../profile-select/view.js"
import trashCanSvg from "../../icons/akar/trash-can.svg.js"
import copySvg from "../../icons/akar/copy.svg.js"
import { given, when } from "@e280/stz"

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

	const destroy = () => {
		profiles.delete($profileKey())
		$profileKey(profiles.defaultKey)
	}

	return html`
		<div class=plate theme-card>
			<header class=topbar>
				<div class=corner>
					${ProfileSelectView(deck, $profileKey(), $profileKey)}

					<button title="copy this profile" theme-button=naked @click="${clone}">
						${copySvg}
					</button>

					${isReadonly ? null : html`
						<button title="delete this profile" theme-button=naked @click="${destroy}">
							${trashCanSvg}
						</button>
					`}

					${when(isReadonly, () => html`<p>stock profile is readonly.</p>`)}
					${given(profile.basedOn, basedOn => html`<p>based on ${profiles.get(basedOn).label}</p>`)}
				</div>

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

