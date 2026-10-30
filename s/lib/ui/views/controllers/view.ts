
import {html} from "lit"
import {isHappy, when} from "@e280/stz"
import {loot, shadowDuplex, useCss, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import personAddSvg from "../../icons/akar/person-add.svg.js"

import {Deck} from "../../deck/types.js"
import {PlayerView} from "./subviews/player.js"
import {DropcardView} from "./subviews/dropcard.js"
import {ControllerView} from "./subviews/controller.js"
import {Context, droppyNewPlayer} from "../deck/types.js"

export const [ControllersView, makeControllersElement] = shadowDuplex((deck: Deck) => {
	useCss(themeCss, styleCss)

	const {hub} = deck
	const controllers = hub.controllers
	const clickCreatePlayer = () => deck.hub.createPlayer()
	const renderPlayer = (p: number, i: number) => PlayerView(context, p, i)

	const context: Context = useOnce(() => ({
		deck,
		dnd: new loot.DragAndDrops({
			acceptDrop(_event, draggy, droppy) {
				if (droppy.playerId === droppyNewPlayer)
					hub.plug(draggy.controller, hub.createPlayer())
				else if (isHappy(droppy.playerId))
					hub.plug(draggy.controller, droppy.playerId)
				else
					hub.unplug(draggy.controller)
			},
		}),
	}))

	return html`
		<div class=plate ?data-drag-and-drop="${!!context.dnd.dragging}">
			<div class=playerlist>
				${hub.playerIds.map(renderPlayer)}

				${when(hub.playerIds.length < deck.maxPlayers, () => DropcardView({
					class: "player new",
					themeCard: "dull",
					playerId: droppyNewPlayer,
					context,
					content: html`
						<button theme-button=naked @click="${clickCreatePlayer}">
							${personAddSvg}
							<span>add player</span>
						</button>
					`,
				}))}

				${DropcardView({
					class: "player unassigned",
					themeCard: "dull",
					playerId: null,
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

