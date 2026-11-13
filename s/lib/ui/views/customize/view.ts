
import {html} from "lit"
import {given, when} from "@e280/stz"
import {shadowDuplex, useCss, useName} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"

import copySvg from "../../icons/akar/copy.svg.js"
import trashCanSvg from "../../icons/akar/trash-can.svg.js"

import {Labels} from "../../deck/types.js"
import {makeId} from "../../../utils/make-id.js"
import {Bindings} from "../../../input/types.js"
import {Controls} from "../../deck/controls/controls.js"
import {renderBindings} from "./parts/render-bindings.js"
import {ProfileSelectView} from "../profile-select/view.js"

export const [CustomizeView, makeCustomizeElement] = shadowDuplex((options: {
		controls: Controls
		labels?: Labels
	}) => {

	useName("customize")
	useCss(themeCss, styleCss)

	const {controls, controls: {profiles}} = options

	const profile = profiles.get(controls.selectedProfileKey)
	const isReadonly = profiles.isPreset(controls.selectedProfileKey)

	const baseline = profile.basedOn
		? profiles.get(profile.basedOn)
		: profile

	const updateBindings = async(bindings: Bindings) => {
		let key = controls.selectedProfileKey

		if (profiles.isPreset(key)) {
			const basedOn = key
			const freshKey = makeId()
			key = freshKey
			await profiles.clone(freshKey, basedOn)
		}

		await profiles.update(key, {bindings})
		controls.setSelectedProfileKey(key)
	}

	const updateLabel = (profileKey: string, label: string) =>
		profiles.update(profileKey, {label})

	const clone = async() => {
		const key = makeId()
		await profiles.clone(key, controls.selectedProfileKey)
		await controls.setSelectedProfileKey(key)
	}

	const destroy = async() => {
		await profiles.delete(controls.selectedProfileKey)
		await controls.setSelectedProfileKey(controls.fallbackProfileKey)
	}

	return html`
		<div part=plate>
			<header class=topbar>
				<div class=interactive>
					${ProfileSelectView(
						options,
						controls.selectedProfileKey,
						key => controls.setSelectedProfileKey(key),
					)}

					<button title="copy this profile" theme-button=naked @click="${clone}">
						${copySvg}
					</button>

					${isReadonly ? null : html`
						<button title="delete this profile" theme-button=naked @click="${destroy}">
							${trashCanSvg}
						</button>
					`}

					${isReadonly ? null : html`
						<input
							type=text
							name=profile-label
							autocomplete=off
							theme-input
							.value="${profile.label}"
							@change="${(event: Event) => {
								const input = event.currentTarget as HTMLInputElement
								updateLabel(controls.selectedProfileKey, input.value)
							}}"
							/>
					`}
				</div>

				<div class=info>
					${when(isReadonly, () => `this profile is readonly`)}
					${given(profile.basedOn, basedOn => `this profile is based on "${profiles.get(basedOn).label}"`)}
				</div>
			</header>

			<div class=bindings>
				${renderBindings(
					false,
					profile.bindings,
					baseline.bindings,
					options.labels,
					updateBindings,
					[],
				)}
			</div>
		</div>
	`
})

