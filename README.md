
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

## 🕹️ bindings is a tiny language for interpreting samples.

- **bindings dsl is json-friendly.**
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

## 🕹️ controllers, decoders.

- **controller encodes input data, decoder decodes it.**
    ```ts
    import {Controller, InputDecoder} from "@benev/tact"
    ```
    ```ts
    const controller = new Controller({bindings, source})
    const decoder = new InputDecoder(bindings)
    ```
- **the data is binary for efficient networking.**
    ```ts
    function frame() {

      // data is an ArrayBuffer (you could stream it over the network).
      const data = controller.encode()

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
- **networking:** imagine a clientside controller, and a serverside decoder.
- **workerized multithreading:** imagine controller on the main thread, decoder on the simulation thread.
- **update the controllers's bindings anytime.**
    ```ts
    // the new bindings must be schema-compatible or an error is thrown.
    controller.bindings = {
      forward: "KeyE",
      jump: "Space",
      look: "gamepad.axis.2"
    }
    ```



<br/><br/>

---

👼 *https://benev.gg/*

