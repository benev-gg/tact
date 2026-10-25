
import {html} from "lit"
import {given, guarantee, IdCounter, isHappy, when} from "@e280/stz"
import {Content, lightView, loot, shadowDuplex, useCss, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import {Deck} from "../../deck/types.js"
import {PortId} from "../../deck/hub.js"
import {Controller} from "../../input/controller.js"

type DraggyController = {controller: Controller}
type DroppyPort = {portId: PortId | null}

class ControllerNames {
	#id = new IdCounter()
	#map = new Map<Controller, string>()

	get(controller: Controller) {
		return guarantee(this.#map, controller, () => `${this.#id.next() + 1}`)
	}
}

type Context = {
	deck: Deck
	dnd: loot.DragAndDrops<DraggyController, DroppyPort>
	controllerNames: ControllerNames
}

export const [DeckView, makeDeck] = shadowDuplex((options: {deck: Deck, maxPorts: number}) => {
	useCss(themeCss, styleCss)

	const {deck, maxPorts} = options
	const {hub} = deck
	const controllers = hub.controllers
	const renderPort = (p: number, i: number) => PortView(context, p, i)
	const clickCreatePort = () => deck.hub.createPort()

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
					heading: "unassigned",
					portId: null,
					controllers: controllers.unassigned,
				})}
			</div>

			${when(hub.portIds.length < maxPorts, () => html`
				<button @click="${clickCreatePort}">new port</button>
			`)}
		</div>
	`
})

const CardView = lightView((o: {
		context: Context
		class: string
		heading: Content
		portId: PortId | null
		controllers: Controller[]
	}) => {

	const {dnd} = o.context
	const dropzone = dnd.dropzone(() => ({portId: o.portId}))
	const renderController = (c: Controller) => ControllerView(o.context, c)

	const dropIsForeign = given(dnd.dragging?.controller, c => !o.controllers.includes(c)) ?? false

	return html`
		<div class="card ${o.class}"
			?data-dropping="${dnd.hovering?.portId === o.portId && dropIsForeign}"
			?data-drop-candidate="${dropIsForeign}"
			@dragenter="${dropzone.dragenter}"
			@dragleave="${dropzone.dragleave}"
			@dragover="${dropzone.dragover}"
			@drop="${dropzone.drop}"
			>
			<h3>${o.heading}</h3>
			<div class=inset>
				${o.controllers.map(renderController)}
				<div class=dropzone></div>
			</div>
		</div>
	`
})

const PortView = lightView((context: Context, portId: number, index: number) => {
	const {hub} = context.deck
	const deletePort = () => hub.deletePort(portId)
	const controllers = hub.controllers.assigned.get(portId) ?? []

	return CardView({
		context,
		class: "port",
		portId,
		controllers,
		heading: html`
			<span>port ${index + 1}</span>
			${when(hub.portIds.length > 1, () => html`
				<button @click=${deletePort}>delete</button>
			`)}
		`,
	})
})

const ControllerView = lightView((context: Context, controller: Controller) => {
	const {deck, dnd} = context
	const dragzone = dnd.dragzone(() => ({controller}))
	const currentProfileKey = deck.profiles.query(controller)

	return html`
		<div class=controller
			?data-dragging="${dnd.dragging?.controller === controller}"
			draggable="${dragzone.draggable}"
			@dragstart="${dragzone.dragstart}"
			@dragend="${dragzone.dragend}">

			<div class=griptape></div>

			<div class=content>
				<h4>controller ${context.controllerNames.get(controller)}</h4>
				${given(controller.handle, handle => html`
					<p>${handle}</p>
				`)}
				<select>
					${Array.from(deck.profiles.all()).map(([key, profile]) => html`
						<option ?selected="${key === currentProfileKey}">
							${profile.label}
						</option>
					`)}
				</select>
			</div>
		</div>
	`
})

