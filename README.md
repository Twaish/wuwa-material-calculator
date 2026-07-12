Util for calculating missing upgrade materials for remaining unowned Wuthering Waves characters

Create the following files with materials from your inventory.

> **Note:** Material and character names must match those defined in [characters.ts](./resources/characters.ts) and [materials.ts](./resources/materials.ts).

```ts
// ./inventory.json
{
  "Cadence": [882, 351, 0, 197],
  ...
  "Lantern Berry": 128,
  ...
  "Shell Credit": 30144084
}

// ./characters.json
[
  "Verina",
  "Rover (Spectro)",
  "Rover (Havoc)",
  "Rover (Aero)",
  "Taoqi"
}
```