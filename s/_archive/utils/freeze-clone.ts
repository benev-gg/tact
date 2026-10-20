
import {deep} from "@e280/stz"

export function freezeClone<X>(x: X): X {
	return deep.freeze(deep.clone(x))
}

