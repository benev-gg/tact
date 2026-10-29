
import {stock} from "./stock-profiles.js"
import {setupTact} from "../lib/ui/deck/setup/tact.js"

const tact = await setupTact({stock, maxPorts: 4})
tact.mouseAndKeyboard()
tact.gamepads("gamer")
tact.encodingCycle(60, () => {})
tact.registerElements()

