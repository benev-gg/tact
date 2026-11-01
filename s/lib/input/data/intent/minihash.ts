
import {hex} from "@e280/stz"

export function minihash(hash: string) {
	return hex.toInteger(hash.slice(0, 8))
}

