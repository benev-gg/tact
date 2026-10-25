
import {html} from "lit"
import {isHappy, when} from "@e280/stz"
import {lightView, loot, useOnce} from "@e280/sly"

import {CardView} from "./card.js"
import {PortView} from "./port.js"
import {Context} from "../types.js"
import {Deck} from "../../../deck/types.js"
import {ControllerNames} from "../parts/controller-names.js"

import circlePlusSvg from "../../../icons/akar/circle-plus.svg.js"

export const PortpanelView = lightView((options: {deck: Deck, maxPorts: number}) => {
	const {deck, maxPorts} = options
	const {hub} = deck
	const controllers = hub.controllers
	const clickCreatePort = () => deck.hub.createPort()
	const renderPort = (p: number, i: number) => PortView(context, p, i)

	const context: Context = useOnce(() => ({
		deck,
		controllerNames: new ControllerNames(),
		dnd: new loot.DragAndDrops({
			acceptDrop(_event, draggy, droppy) {
				if (isHappy(droppy.portId))
					hub.plug(draggy.controller, droppy.portId)
				else
					hub.unplug(draggy.controller)
			},
		}),
	}))

	return html`
		<div slot=panel class=portpanel ?data-drag-and-drop="${!!context.dnd.dragging}">
			<div class=ports>
				${hub.portIds.map(renderPort)}
				${CardView({
					context,
					class: "unassigned",
					heading: "⚪️ unassigned",
					portId: null,
					controllers: controllers.unassigned,
				})}
			</div>

			${when(hub.portIds.length < maxPorts, () => html`
				<button theme-button @click="${clickCreatePort}">
					${circlePlusSvg}
					<span>new port</span>
				</button>
			`)}
		</div>
	`
})

