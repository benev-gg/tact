
import {html} from "lit"
import {isHappy, when} from "@e280/stz"
import {loot, shadowView, useCss, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import circlePlusSvg from "../../icons/akar/circle-plus.svg.js"

import {Deck} from "../../deck/types.js"
import {Context} from "../deck/types.js"
import {CardView} from "./subviews/card.js"
import {PortView} from "./subviews/port.js"

export const PortsView = shadowView((deck: Deck) => {
	useCss(themeCss, styleCss)

	const {hub} = deck
	const controllers = hub.controllers
	const clickCreatePort = () => deck.hub.createPort()
	const renderPort = (p: number, i: number) => PortView(context, p, i)

	const context: Context = useOnce(() => ({
		deck,
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
		<div class=plate ?data-drag-and-drop="${!!context.dnd.dragging}">
			<div class=ports>
				${hub.portIds.map(renderPort)}
				${when(hub.portIds.length < deck.maxPorts, () => html`
					<div class=box>
						<button theme-button @click="${clickCreatePort}">
							${circlePlusSvg}
							<span>new port</span>
						</button>
					</div>
				`)}
			</div>

			<div class=ports>
				${CardView({
					context,
					class: "unassigned",
					heading: html`<span>unassigned</span>`,
					portId: null,
					controllers: controllers.unassigned,
				})}
			</div>
		</div>
	`
})

