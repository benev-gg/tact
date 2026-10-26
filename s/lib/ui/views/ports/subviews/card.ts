
import {html} from "lit"
import {given} from "@e280/stz"
import {Content, lightView} from "@e280/sly"

import {Context} from "../../deck/types.js"
import {PortId} from "../../../deck/hub.js"
import {ControllerView} from "./controller.js"
import {Controller} from "../../../../input/controller.js"

export const CardView = lightView((o: {
		context: Context
		class: string
		heading: Content
		portId: PortId | null
		controllers: Controller[]
	}) => {

	const {dnd} = o.context
	const dropzone = dnd.dropzone(() => ({portId: o.portId}))
	const renderController = (c: Controller) => ControllerView(o.context, c)

	const dropIsForeign = given(
		dnd.dragging?.controller,
		c => !o.controllers.includes(c)
	) ?? false

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
			</div>
		</div>
	`
})

