
# 🎮 @benev/tact
> *from keypress to couch co-op.*

**tact is a tiny input toolkit for web games.**  
keyboards, mice, gamepads. expressive bindings json dsl.  
binary messages for efficient networking and web worker multithreading.  

```ts
npm install @benev/tact@next
```



<br/>

## 🕹️ sources emit samples.

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
    - utility sources: [Sources](./s/lib/input/sources/sources.ts) *(consolidates sources)*, [PlainSource](./s/lib/input/sources/plain.ts) *(handy base class)*.



<br/>

## 🕹️ bindings describe controls.

- **bindings are tiny programs,** a dsl in js data.
    ```ts
    import {asBindings} from "@benev/tact"
    ```
    ```ts
    const bindings = asBindings({
      forward: ["max", "KeyW", "ArrowUp"],
      jump: ["down", "Space"],
      look: ["sum", "pointer.x"],
    })
    ```
    - see [expression.ts](./s/lib/input/expression.ts) to learn what's possible.



<br/>

## 🕹️ encode and decode.

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
      const data = encoder.encode()

      // decoding interprets the data as handy input objects.
      const inputs = decoder.decode(data)

      // your game logic can read these handy input values.
      inputs.forward.value // current held state.
      inputs.jump.value // down-presses this frame.
      inputs.look.value // mouse movement this frame.

      // this was so cool, let's do this forever.
      requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
    ```
- **understanding networking situations.**
  - the encoder could be on your clientside.
  - the decoder could be on your serverside.
  - thus, clients are streaming their input data to the serverside, which is decoding it and using it in game logic.
  - don't worry, it's not a keylogger -- the encoded data is more like `jump: 1`, `look: 5`, etc.
  - the decoder can accept multiple data packets at once, `decoder.decode(...datas)`.
- **understanding multithreaded worker situations.**
  - the encoder would be on the main thread, where javascript events are accessible.
  - you can then send the encoded input data to the thread where you're simulating the game.
  - you can have multiple encoders -- one encoder sending data to a worker thread -- another encoder sending data to the serverside.
- **update the encoder's bindings anytime.**
    ```ts
    // the new bindings must be schema-compatible or an error is thrown.
    encoder.bindings = {
      forward: "KeyE",
      jump: "Space",
      look: "gamepad.axis.2"
    }
    ```



<br/><br/>

---

👼 *https://benev.gg/*

