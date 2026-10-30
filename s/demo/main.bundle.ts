
import {cycle, nap} from "@e280/stz"
import {stock} from "./stock-profiles.js"
import {setupTact} from "../lib/ui/deck/setup/tact.js"

const tact = await setupTact({stock, maxPlayers: 4})
tact.mouseAndKeyboard()
tact.gamepads("gamer")
tact.registerElements()

cycle(async() => {
	const data = tact.deck.hub.encodeAll()
	tact.visualizer.update(data)
	await nap(1000 / 60)
})

