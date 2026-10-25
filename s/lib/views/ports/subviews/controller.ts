
import {html} from "lit"
import {lightView} from "@e280/sly"

import dragVerticalFillSvg from "../../../icons/akar/drag-vertical-fill.svg.js"

import {Context} from "../../deck/types.js"
import {Controller} from "../../../input/controller.js"

export const ControllerView = lightView((context: Context, controller: Controller) => {
	const {deck, dnd} = context
	const dragzone = dnd.dragzone(() => ({controller}))
	const currentProfileKey = deck.profiles.query(controller)

	return html`
		<div class=controller
			?data-dragging="${dnd.dragging?.controller === controller}"
			draggable="${dragzone.draggable}"
			@dragstart="${dragzone.dragstart}"
			@dragend="${dragzone.dragend}">

			<div class=griptape>
				${dragVerticalFillSvg}
			</div>

			<h4>${controller.handle ?? `controller ${context.controllerNames.get(controller)}`}</h4>

			<select>
				${Array.from(deck.profiles.all()).map(([key, profile]) => html`
					<option ?selected="${key === currentProfileKey}">
						${profile.label}
					</option>
				`)}
			</select>
		</div>
	`
})

