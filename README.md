
# 🎮 @benev/tact
> *from keypress to couch co-op.*

**tact is a user-input toolkit for web games.**

🌐 👉 [tact.benev.gg](https://tact.benev.gg/) 👈  

🖱 keyboards, mice, gamepads.  
🧩 expressive bindings json dsl.  
🎨 bindings are user-customizable.  
🫂 multiplayer and splitscreen capable.  
🧬 binary for efficient workers and networking.  
🎸 ready-to-rock drop-in user-interface.  



<br/>

## 🎮 let's play.

- **install tact.**
    ```sh
    npm install @benev/tact@next
    ```
- **make your app's standard bindings.**
    ```ts
    import {asBindings} from "@benev/tact"

    const bindings = asBindings({
      jump: "Space",
      forward: "KeyW",
      look: ["accumulate", "pointer.x"],
    })
    ```
    - bindings is a tiny json dsl. see [expression.ts](./s/lib/input/expression.ts).
- **let's also have some alternative bindings for gamepads.**
    ```ts
    import {asStockProfiles} from "@benev/tact"

    const stock = asStockProfiles<typeof bindings>({
      standard: {label: "⌨️standard", bindings},
      gamepad: {label: "🎮gamer", bindings: {
        jump: "gamepad.1",
        forward: ["remap", 0, -1, 0, 1, "gamepad.axis.2"],
        look: ["*", ["dt"], "gamepad.axis.3", 100],
      }},
    })
    ```
- **now we can setup tact and register the elements.**
    ```ts
    import {setupTact} from "@benev/tact"

    const tact = await setupTact({stock, maxPlayers: 4})
    tact.mouseAndKeyboard()
    tact.gamepads("gamepad")
    tact.registerElements()
    ```
- **simply put the `<tact-deck>` in your html page.**
    ```html
    <tact-deck></tact-deck>
    ```



<br/>

## 🎮 encoding, decoding, and your game logic.

- **make a collector.**
    ```ts
    import {Collector} from "@benev/tact"

    const collector = new Collector(bindings)
    ```
- **now it's time for the real action!**
    ```ts
    setInterval(() => {
      const buffer = tact.deck.hub.encodeAll()
      for (const {playerId, inputs} of collector.decodeAll(buffer)) {

        // your game logic can read these handy input values.
        inputs.jump.value // values are numbers 0  to 1.
        inputs.jump.was // previous value (to detect up/down).
        inputs.jump.sum // sum of values reported since last frame.

        inputs.forward.value
        inputs.look.value
      }
    }, 16.67)
    ```
    💡 *you could stream the buffers across the network to a remote collector.*



<br/>

## 🎮 the more you know.

- **color the whole ui with css.**
    ```css
    html {
      --tact-prime: aqua;
    }
    ```



<br/>

## 🎮 you can use the core.

- **get down to brass tacks.**  
    you can use the core facilities directly, using tact without the ui or multi-controller hub etc.
    ```ts
    import {Controller, InputDecoder, KeyboardSource, PointerSource, Sources} from "@benev/tact"

    const controller = new Controller({
      bindings,
      source: new Sources(new KeyboardSource(), new PointerSource()),
    })

    const decoder = new InputDecoder(bindings)

    // call this in your gameloop:
    const inputs = decoder.decode(controller.encode())
    ```



<br/><br/>

---

👼 *https://benev.gg/*

