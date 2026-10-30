
import {Plex} from "./types.js"
import {endian} from "../params.js"

export function decodePlex(buffer: ArrayBuffer): Plex[] {
	const view = new DataView(buffer)
	const plex: Plex[] = []
	let cursor = 0

	while (cursor < buffer.byteLength) {
		if (buffer.byteLength - cursor < 8)
			throw new Error("truncated intentplex header")

		const portId = view.getUint32(cursor, endian)
		cursor += 4

		const length = view.getUint32(cursor, endian)
		cursor += 4

		if (length > buffer.byteLength - cursor)
			throw new Error("truncated intentplex data")

		const data = buffer.slice(cursor, cursor + length)
		cursor += length

		plex.push([portId, data])
	}

	return plex
}

