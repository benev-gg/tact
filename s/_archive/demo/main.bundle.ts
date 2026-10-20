
import {Content, dom} from "@e280/sly"
import {LocalStore} from "@e280/strata"

import {Deck} from "../deck/deck.js"
import {DeckState} from "../deck/types.js"
import {asBindings} from "../core/types.js"
import {Devices} from "../device/devices.js"
import {onPad} from "../device/pad/on-pad.js"
import {Controller} from "../deck/controller.js"
import {PointerDevice} from "../device/pointer.js"
import {GamepadDevice} from "../device/gamepad.js"
import {setupDemoApp} from "./demo-app/element.js"
import {KeyboardDevice} from "../device/keyboard.js"

const bindings = asBindings({
	play: {
		action: ["or", "Space", "pointer.button.left", "gamepad.button.1"],
		up: ["or", "KeyW", "gamepad.axis.2.pos"],
		down: ["or", "KeyS", "gamepad.axis.2.neg"],
		left: ["or", "KeyA", "gamepad.axis.1.pos"],
		right: ["or", "KeyD", "gamepad.axis.1.neg"],
	},
})

const store = new LocalStore<DeckState>("tactDeck")

const deck = new Deck({
	store,
	stockProfiles: {
		standard: {label: "📜standard", bindings},
		micro: {label: "🦠micro", bindings: asBindings<typeof bindings>({
			play: {
				action: ["or", "Space", "pointer.button.left", "gamepad.button.1"],
				up: ["or", "KeyW", "gamepad.axis.2.pos"],
				down: ["or", "KeyS", "gamepad.axis.2.neg"],
				left: ["or", "KeyA", "gamepad.axis.1.pos"],
				right: ["or", "KeyD", "gamepad.axis.1.neg"],
			},
		})},
	},
})

await deck.load()
store.onStorageEvent(() => deck.load())

const port = deck.createPort()
const controller = deck.createController("primary", "standard", new Devices(
	new KeyboardDevice(),
	new PointerDevice(),
))

port.plug(controller)

const labels = new Map<Controller, Content>()
	.set(controller, "⌨️🖱keyboard+mouse")

onPad(pad => {
	const handle = `(${pad.gamepad.index + 1}) ${pad.gamepad.id}`
	const controller = deck.createController(handle, "standard", new GamepadDevice(pad))
	labels.set(controller, `🎮${handle}`)
	port.plug(controller)
	return () => deck.deleteController(controller)
})

dom.register({
	DemoApp: setupDemoApp(deck, {
		getControllerLabel: labels.get.bind(labels),
	}),
})

