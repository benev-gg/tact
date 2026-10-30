
import {Plex} from "./types.js"
import {endian} from "../params.js"

export function encodePlex(plex: Plex[]): ArrayBuffer {
	const sizeHeader = 8
	const size = plex.reduce(
		(total, [, data]) => total + sizeHeader + data.byteLength,
		0,
	)

	const buffer = new ArrayBuffer(size)
	const view = new DataView(buffer)
	const bytes = new Uint8Array(buffer)
	let cursor = 0

	for (const [portId, data] of plex) {
		view.setUint32(cursor, portId, endian)
		cursor += 4

		view.setUint32(cursor, data.byteLength, endian)
		cursor += 4

		bytes.set(new Uint8Array(data), cursor)
		cursor += data.byteLength
	}

	return buffer
}

