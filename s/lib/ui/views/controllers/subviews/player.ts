
import {html} from "lit"
import {when} from "@e280/stz"
import {lightView} from "@e280/sly"

import xSmallSvg from "../../../icons/akar/x-small.svg.js"

import {DropcardView} from "./dropcard.js"
import {Context} from "../../deck/types.js"
import {ControllerView} from "./controller.js"

export const PlayerView = lightView((context: Context, playerId: number, index: number) => {
	const {hub} = context.deck
	const deletePlayer = () => hub.deletePlayer(playerId)
	const controllers = hub.controllers.assigned.get(playerId) ?? []

	return DropcardView({
		class: "player",
		playerId: playerId,
		context,
		content: html`
			<h3>
				<span>player ${index + 1}</span>

				${when(hub.playerIds.length > 1, () => html`
					<button theme-button="naked angry" @click=${deletePlayer}>
						${xSmallSvg}
					</button>
				`)}
			</h3>

			<div class=controllerlist>
				${controllers.map(c => ControllerView(context, c))}
			</div>
		`,
	})
})

