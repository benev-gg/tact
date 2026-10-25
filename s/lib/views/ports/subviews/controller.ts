
import {html} from "lit"
import {given} from "@e280/stz"
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

			<div class=content>
				<h4>controller ${context.controllerNames.get(controller)}</h4>

				${given(controller.handle, handle => html`
					<p class=handle>${handle}</p>
				`)}

				<div class=actions>
					<select>
						${Array.from(deck.profiles.all()).map(([key, profile]) => html`
							<option ?selected="${key === currentProfileKey}">
								${profile.label}
							</option>
						`)}
					</select>
				</div>
			</div>
		</div>
	`
})

