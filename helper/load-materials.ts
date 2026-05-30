import * as materials from '../resources/materials'
import { Material, TierMap } from '../lib/Material'
import MaterialCalculator from '../lib/MaterialCalculator'
import fs from 'fs'

type InventoryValue = TierMap[keyof TierMap]

const materialsByName = new Map<string, Material>()

for (const value of Object.values(materials)) {
  if (value instanceof Material) {
    materialsByName.set(value.name, value)
  }
}

export function loadMaterials(materialsPath: string): MaterialCalculator {
  const inventory = JSON.parse(
    fs.readFileSync(materialsPath, 'utf8'),
  ) as Record<string, InventoryValue>

  const calculator = new MaterialCalculator()

  const entries: [Material, InventoryValue][] = []

  for (const [name, amount] of Object.entries(inventory)) {
    const material = materialsByName.get(name)

    if (!material) {
      throw new Error(`Unknown material in inventory: "${name}"`)
    }

    entries.push([material, amount])
  }

  calculator.addMaterialMap(...entries)

  return calculator
}
