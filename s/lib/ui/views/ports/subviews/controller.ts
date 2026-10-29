
import {html} from "lit"
import {lightView} from "@e280/sly"

import dragVerticalFillSvg from "../../../icons/akar/drag-vertical-fill.svg.js"

import {Context} from "../../deck/types.js"
import {hueify} from "../../../../utils/hueify.js"
import {Controller} from "../../../../input/controller.js"
import {ProfileSelectView} from "../../profile-select/view.js"

export const ControllerView = lightView((context: Context, controller: Controller) => {
	const {deck, dnd} = context
	const dragzone = dnd.dragzone(() => ({controller}))
	const currentProfileKey = deck.profiles.query(controller)
	const meta = deck.registry.get(controller) ?? deck.registry.fallback()

	const style = `--hue: ${hueify(meta?.id ?? 0)};`

	return html`
		<div class=controller
			style="${style}"
			theme-card
			?data-dragging="${dnd.dragging?.controller === controller}"
			draggable="${dragzone.draggable}"
			@dragstart="${dragzone.dragstart}"
			@dragend="${dragzone.dragend}">

			<div class=griptape>
				${dragVerticalFillSvg}
			</div>

			<h4 class=label title="${meta.tooltip}">
				<span class=icon>${meta.icon}</span>
				<span class=name>${meta.name}</span>
			</h4>

			${ProfileSelectView(deck, currentProfileKey, key => {
				deck.profiles.assign(controller, key)
			})}
		</div>
	`
})

