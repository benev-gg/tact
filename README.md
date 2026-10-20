
# 🎮 @benev/tact
> *from keypress to couch co-op*

**tact is a tiny input toolkit for web games.**  
keyboards, mice, gamepads. expressive bindings json dsl.  
binary messages for efficient networking and web worker multithreading.  

```ts
npm install @benev/tact@next
```



<br/>

## 🎮 let's play

### 🕹️ sources emit samples.

- **samples look like** `{code: "KeyW", value: 1}`
    ```ts
    import {Sources, KeyboardSource, PointerSource} from "@benev/tact"
    ```
    ```ts
    const source = new Sources(
      new KeyboardSource(),
      new PointerSource(),
    )
    ```
    - proper sources: [GamepadSource](./s/lib/input/sources/gamepad.ts), [KeyboardSource](./s/lib/input/sources/keyboard.ts), [PointerSource](./s/lib/input/sources/pointer.ts), [StickSource](./s/lib/input/sources/stick.ts).
    - utility sources: [Sources](./s/lib/input/sources/sources.ts), [PlainSource](./s/lib/input/sources/plain.ts).

### 🕹️ bindings describe controls.

- **bindings are tiny programs,** a dsl in js data.
    ```ts
    import {asBindings} from "@benev/tact"
    ```
    ```ts
    const bindings = asBindings({
      forward: ["max", "KeyW", "ArrowUp"],
      jump: ["down", "Space"],
      look: ["accumulate", ["sum", "pointer.x"]],
    })
    ```
    - see [expression.ts](./s/lib/input/expression.ts) to learn what's possible.

### 🕹️ encode and decode.

- **the data is binary for efficient networking.**
    ```ts
    import {InputEncoder, InputDecoder} from "@benev/tact"
    ```
    ```ts
    const encoder = new InputEncoder(source, bindings)
    const decoder = new InputDecoder(bindings)
    ```
    ```ts
    function frame() {

      // data is an ArrayBuffer (you could stream it over the network).
      const data = encoder.encode(performance.now())

      // decoding interprets the data as handy input objects.
      const inputs = decoder.decode(data)

      // your game logic can read these handy input values.
      inputs.forward.value // current held state.
      inputs.jump.value // down-presses this frame.
      inputs.look.value // total accumulated mouse movement.

      // this was so cool, let's do this forever.
      requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
    ```
- **update the encoder's bindings anytime.**
    ```ts
    // the new bindings must be schema-compatible or an error is thrown.
    encoder.bindings = {
      forward: "KeyE",
      jump: "Space",
      look: "gamepad.axis.2.x"
    }
    ```



<br/><br/>

👼 *https://benev.gg/*

