
import {dom} from "@e280/sly"
import {cycle, nap} from "@e280/stz"
import {presets} from "./presets.js"
import {setupTact} from "../lib/ui/deck/setup/tact.js"

const tact = await setupTact({presets, maxPlayers: 4})
tact.mouseAndKeyboard()
tact.gamepads("gamer")
tact.registerElements()

cycle(async() => {
	const data = tact.deck.hub.encodeAll()
	tact.visualizer.update(data)
	await nap(1000 / 60)
})

{
	const input = dom<HTMLInputElement>('input[type="color"]')
	input.value = "#ffbb00"
	input.oninput = () => document.body.style.setProperty("--tact-prime", input.value)
}

