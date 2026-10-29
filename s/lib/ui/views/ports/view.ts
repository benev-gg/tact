
import {html} from "lit"
import {isHappy, when} from "@e280/stz"
import {loot, shadowDuplex, useCss, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import personAddSvg from "../../icons/akar/person-add.svg.js"

import {Deck} from "../../deck/types.js"
import {PortView} from "./subviews/port.js"
import {DropcardView} from "./subviews/dropcard.js"
import {ControllerView} from "./subviews/controller.js"
import {Context, droppyNewPort} from "../deck/types.js"

export const [PortsView, makePortsElement] = shadowDuplex((deck: Deck) => {
	useCss(themeCss, styleCss)

	const {hub} = deck
	const controllers = hub.controllers
	const clickCreatePort = () => deck.hub.createPort()
	const renderPort = (p: number, i: number) => PortView(context, p, i)

	const context: Context = useOnce(() => ({
		deck,
		dnd: new loot.DragAndDrops({
			acceptDrop(_event, draggy, droppy) {
				if (droppy.portId === droppyNewPort)
					hub.plug(draggy.controller, hub.createPort())
				else if (isHappy(droppy.portId))
					hub.plug(draggy.controller, droppy.portId)
				else
					hub.unplug(draggy.controller)
			},
		}),
	}))

	return html`
		<div class=plate ?data-drag-and-drop="${!!context.dnd.dragging}">
			<div class=ports>
				${hub.portIds.map(renderPort)}

				${when(hub.portIds.length < deck.maxPorts, () => DropcardView({
					class: "port new",
					themeCard: "dull",
					portId: droppyNewPort,
					context,
					content: html`
						<button theme-button=naked @click="${clickCreatePort}">
							${personAddSvg}
							<span>add player</span>
						</button>
					`,
				}))}

				${DropcardView({
					class: "port unassigned",
					themeCard: "dull",
					portId: null,
					context,
					content: html`
						<h3>unassigned</h3>
						<div class=controllerlist>
							${controllers.unassigned.map(c => ControllerView(context, c))}
						</div>
					`,
				})}
			</div>
		</div>
	`
})

