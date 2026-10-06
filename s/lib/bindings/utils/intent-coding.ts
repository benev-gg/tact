
const endian = false
const sizeHash = 4
const sizeId = 2
const sizeValue = 4
const sizeIntention = sizeId + sizeValue

type Intention = {id: number, value: number}

export function encodeIntent(hash: number, intentions: Intention[]) {
	const byteCount = sizeHash + (intentions.length * sizeIntention)
	const buffer = new ArrayBuffer(byteCount)
	const dv = new DataView(buffer)
	let cursor = 0

	dv.setUint32(cursor, hash, endian)
	cursor += sizeHash

	for (const intention of intentions) {
		dv.setUint16(cursor, intention.id, endian)
		cursor += sizeId

		dv.setFloat32(cursor, intention.value, endian)
		cursor += sizeValue
	}

	return buffer
}

export function decodeIntent(buffer: ArrayBuffer) {
	const intentions: Intention[] = []
	const dv = new DataView(buffer)
	let cursor = 0

	const hash = dv.getUint32(cursor, endian)
	cursor += sizeHash

	while (cursor < buffer.byteLength) {
		const id = dv.getUint16(cursor, endian)
		cursor += sizeId

		const value = dv.getFloat32(cursor, endian)
		cursor += sizeValue

		intentions.push({id, value})
	}

	return {hash, intentions}
}

