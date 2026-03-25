import { Material, BoundMaterial, MAT_TYPE } from './Material'

type TieredMaterialType = MAT_TYPE.ENEMY | MAT_TYPE.FORGERY

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

  addFromCharacters(chars: Iterable<{ getMaterials(): BoundMaterial[] }>) {
    for (const c of chars) {
      this.addMaterials(c.getMaterials())
    }
    return this
  }

  calculateByType(
    type: TieredMaterialType,
    tier: number,
  ): ReturnType<typeof this.calculate>
  calculateByType(
    type: Exclude<MAT_TYPE, TieredMaterialType>,
  ): ReturnType<typeof this.calculate>
  calculateByType(type: MAT_TYPE, tier?: number) {
    const data =
      type === MAT_TYPE.ENEMY || type === MAT_TYPE.FORGERY
        ? this.calculate(tier ?? 4)
        : this.calculate(4)

    return data.filter((m) => m.material.type === type)
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
