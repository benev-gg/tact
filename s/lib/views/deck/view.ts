
import {html} from "lit"
import {isHappy, when} from "@e280/stz"
import {loot, shadowDuplex, useCss, useOnce} from "@e280/sly"

import {Context} from "./types.js"
import {Deck} from "../../deck/types.js"
import {PortView} from "./subviews/port.js"
import {CardView} from "./subviews/card.js"
import {ControllerNames} from "./parts/controller-names.js"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import circlePlusSvg from "../../icons/akar/circle-plus.svg.js"

export const [DeckView, makeDeck] = shadowDuplex((options: {deck: Deck, maxPorts: number}) => {
	useCss(themeCss, styleCss)

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
		<div class=deck ?data-drag-and-drop="${!!context.dnd.dragging}">
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

