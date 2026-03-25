import { Material, BoundMaterial } from './Material'

export default class MaterialCalculator {
  private totals = new Map<
    Material,
    number | [number, number, number, number]
  >()

  addMaterials(entries: BoundMaterial[]) {
    for (const { material, tiers } of entries) {
      if (Array.isArray(tiers)) {
        const current = this.totals.get(material) as
          | [number, number, number, number]
          | undefined

        if (!current) {
          this.totals.set(material, [...tiers] as any)
        } else {
          for (let i = 0; i < 4; i++) {
            current[i] += tiers[i]
          }
        }
      } else {
        const current = (this.totals.get(material) as number) ?? 0
        this.totals.set(material, current + tiers)
      }
    }
  }

  calculate(targetTier: number): {
    amount: number
    material: Material
    tier?: number
  }[] {
    const result: {
      amount: number
      material: Material
      tier?: number
    }[] = []

    for (const [material, value] of this.totals.entries()) {
      if (!Array.isArray(value)) {
        result.push({ material, amount: value })
        continue
      }

      const tiers = [...value] as [number, number, number, number]

      for (let i = 0; i < targetTier - 1; i++) {
        const carry = Math.floor(tiers[i] / 3)
        tiers[i] %= 3
        tiers[i + 1] += carry
      }

      for (let i = 0; i < targetTier; i++) {
        if (tiers[i] > 0) {
          result.push({
            material,
            amount: tiers[i],
            tier: i,
          })
        }
      }
    }

    return result
  }

  reset() {
    this.totals.clear()
  }
}
