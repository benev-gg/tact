
import {html} from "lit"
import {got} from "@e280/stz"
import {shadowDuplex} from "@e280/sly"
import {Deck} from "../deck/deck.js"

export const [DeckView, makeDeck] = shadowDuplex((deck: Deck<any>) => {
	const {hub} = deck
	const controllers = hub.controllers

	return html`
		<div class=deck>
			deck

			${hub.portIds.map((portId, portIndex) => html`
				<div class=port>
					<p><strong>port ${portIndex + 1}</strong></p>
					${got(controllers.assigned.get(portId)).map((_c, controllerIndex) => html`
						<p>controller ${controllerIndex + 1}</p>
					`)}
				</div>
			`)}

			<div class=unassigned>
				${controllers.unassigned.map((_c, controllerIndex) => html`
					<p>controller ${controllerIndex + 1}</p>
				`)}
			</div>
		</div>
	`
})

