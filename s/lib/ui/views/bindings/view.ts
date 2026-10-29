
import {html} from "lit"
import {given, when} from "@e280/stz"
import {shadowDuplex, useCss, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"

import copySvg from "../../icons/akar/copy.svg.js"
import trashCanSvg from "../../icons/akar/trash-can.svg.js"

import {Deck} from "../../deck/types.js"
import {Bindings} from "../../../input/types.js"
import {renderBindings} from "./parts/render-bindings.js"
import {ProfileSelectView} from "../profile-select/view.js"
import { makeId } from "../../../utils/make-id.js"

export const [BindingsView, makeBindingsElement] = shadowDuplex((deck: Deck) => {
	useCss(themeCss, styleCss)
	const {controls, controls: {profiles}} = deck
	const $profileKey = useSignal(controls.fallbackProfileKey)

	const profile = profiles.get($profileKey())
	const isReadonly = profiles.isStock($profileKey())

	const updateBindings = (bindings: Bindings) => {
		let key = $profileKey()

		if (profiles.isStock(key)) {
			const basedOn = key
			const freshKey = makeId()
			key = freshKey
			profiles.clone(freshKey, basedOn)
		}

		profiles.update(key, {bindings})
		$profileKey(key)
	}

	const updateLabel = (profileKey: string, label: string) =>
		profiles.update(profileKey, {label})

	const clone = () => {
		const key = makeId()
		profiles.clone(key, $profileKey())
		$profileKey.set(key)
	}

	const destroy = () => {
		profiles.delete($profileKey())
		$profileKey(controls.fallbackProfileKey)
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

					${when(isReadonly, () => html`<small>readonly</small>`)}
					${given(profile.basedOn, basedOn => html`<small>based on ${profiles.get(basedOn).label}</small>`)}
				</div>

				<div class=tools>
					${isReadonly ? null : html`
						<input
							type=text
							theme-input
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
					false,
					profile.bindings,
					profiles.get(profile.basedOn).bindings,
					updateBindings,
				)}
			</div>
		</div>
	`
})

