
import {html} from "lit"
import {lightView} from "@e280/sly"

import dragVerticalFillSvg from "../../../icons/akar/drag-vertical-fill.svg.js"

import {Context} from "../../deck/types.js"
import {Controller} from "../../../../input/controller.js"
import { ProfileSelectView } from "../../profile-select/view.js"

export const ControllerView = lightView((context: Context, controller: Controller) => {
	const {deck, dnd} = context
	const dragzone = dnd.dragzone(() => ({controller}))
	const currentProfileKey = deck.profiles.query(controller)
	const info = deck.controllerInfo.get(controller)

	const style = `--hue: ${info.hue};`

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

			<h4 class=label title="${info.tooltip}">
				<span class=icon>${info.icon}</span>
				<span class=name>${info.name}</span>
			</h4>

			${ProfileSelectView(deck, currentProfileKey, key => {
				deck.profiles.assign(controller, key)
			})}
		</div>
	`
})

