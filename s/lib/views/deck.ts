
import {html} from "lit"
import {lightView, shadowDuplex} from "@e280/sly"
import {Deck} from "../deck/deck.js"
import {PortId} from "../deck/hub.js"
import {Controller} from "../input/controller.js"

export const [DeckView, makeDeck] = shadowDuplex((deck: Deck<any>) => {
	const {hub} = deck
	const controllers = hub.controllers
	const queryPort = (portId: PortId) => controllers.assigned.get(portId) ?? []

	return html`
		<div class=deck>
			<div class=ports>
				${hub.portIds
					.map(queryPort)
					.map(PortView)}
			</div>

			<div class=unassigned>
				${controllers.unassigned.map(ControllerView)}
			</div>
		</div>
	`
})

const PortView = lightView((controllers: Controller[], index: number) => {
	return html`
		<div class=port>
			<p><strong>port ${index + 1}</strong></p>
			${controllers.map(ControllerView)}
		</div>
	`
})

const ControllerView = lightView((_controller: Controller, index: number) => {
	return html`
		<div class=controller>
			<p>controller ${index + 1}</p>
		</div>
	`
})

