import { Material, BoundMaterial, MAT_TYPE } from './Material'

type TieredMaterialType = MAT_TYPE.ENEMY | MAT_TYPE.FORGERY

export type MaterialAmount = {
  amount: number
  material: Material
  tier?: number
}

export default class MaterialCalculator {
  public totals = new Map<Material, number | [number, number, number, number]>()

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

  private process(
    targetTier: number,
    filter?: (material: Material) => boolean,
  ): MaterialAmount[] {
    const result: MaterialAmount[] = []

    for (const [material, value] of this.totals.entries()) {
      if (filter && !filter(material)) continue

      if (!Array.isArray(value)) {
        result.push({ material, amount: value })
        continue
      }

      const tiers = [...value] as [number, number, number, number]

      // normalize upward
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

  calculateByType(
    type: TieredMaterialType,
    tier: number,
  ): ReturnType<typeof this.calculate>
  calculateByType(
    type: Exclude<MAT_TYPE, TieredMaterialType>,
  ): ReturnType<typeof this.calculate>
  calculateByType(type: MAT_TYPE, tier?: number) {
    const isTiered = type === MAT_TYPE.ENEMY || type === MAT_TYPE.FORGERY

    const targetTier = isTiered ? (tier ?? 4) : 4

    return this.process(targetTier, (m) => m.type === type)
  }

  calculate(targetTier: number): MaterialAmount[] {
    return this.process(targetTier)
  }

  calculateMany(types: MAT_TYPE[], tier?: number): MaterialAmount[] {
    return this.process(tier ?? 4, (m) => types.includes(m.type))
  }

  calculateWhere(predicate: (m: Material) => boolean, tier?: number) {
    return this.process(tier ?? 4, predicate)
  }

  clear() {
    this.totals.clear()
  }
}
