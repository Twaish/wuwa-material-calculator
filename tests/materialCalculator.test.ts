import { describe, expect, it } from 'vitest'

import MaterialCalculator from '../lib/MaterialCalculator'
import { cadence, mask, shell_credit } from '../resources/materials'

const flatMat = shell_credit
const enemyMat = mask
const forgeryMat = cadence

describe('MaterialCalculator.smartCalculate()', () => {
  describe('flat materials', () => {
    it('reports a positive flat amount as-is', () => {
      const calc = new MaterialCalculator()
      calc.addMaterialMap([flatMat, 5])
      const results = calc.smartCalculate()
      expect(results).toEqual([{ material: flatMat, amount: 5 }])
    })

    it('reports a negative flat amount as-is (surplus)', () => {
      const calc = new MaterialCalculator()
      calc.addMaterialMap([flatMat, -3])
      const results = calc.smartCalculate()
      expect(results).toEqual([{ material: flatMat, amount: -3 }])
    })

    it('omits flat materials that net to zero', () => {
      const calc = new MaterialCalculator()
      calc.addMaterialMap([flatMat, 0])
      expect(calc.smartCalculate()).toEqual([])
    })
  })

  // positive = missing, negative = surplus
  // required: [1,5,2,1] owned: [7,1,5,0]
  // after subtract: [-6, 4, -3, 1]
  // T0: floor(6/3)=2 carry -> [0, 2, -3, 1]
  // T2: floor(3/3)=1 carry -> [0, 2,  0, 0]
  // Result: missing 2 T1

  describe('example', () => {
    it('matches the documented example', () => {
      const required = new MaterialCalculator()
      required.addMaterialMap([enemyMat, [1, 5, 2, 1]])

      const owned = new MaterialCalculator()
      owned.addMaterialMap([enemyMat, [7, 1, 5, 0]])

      required.subtract(owned)

      const results = required.smartCalculate()
      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({
        material: enemyMat,
        amount: 2,
        tier: 1,
      })
    })
  })

  describe('surplus fully covers deficit', () => {
    it('converts T0 surplus to fill T1 deficit - nothing missing', () => {
      // [-3, 1, 0, 0] -> carry 1 from T0 -> [0, 0, 0, 0]
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [-3, 1, 0, 0]])
      expect(calc.smartCalculate()).toEqual([])
    })

    it('chains conversion across two tiers', () => {
      // [-9, 0, 1, 0] -> T0->T1: 3 carry -> [0,-3,1,0] -> T1->T2: 1 carry -> [0,0,0,0]
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [-9, 0, 1, 0]])
      expect(calc.smartCalculate()).toEqual([])
    })

    it('chains conversion across all four tiers', () => {
      // [-27, 0, 0, 1] -> cascades all the way to T3
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [-27, 0, 0, 1]])
      expect(calc.smartCalculate()).toEqual([])
    })

    it('exact carry with no remainder at any tier', () => {
      // [-6, 2, 0, 0] -> carry 2 from T0 -> [0, 0, 0, 0]
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [-6, 2, 0, 0]])
      expect(calc.smartCalculate()).toEqual([])
    })
  })

  describe('surplus partially covers deficit', () => {
    it('leaves residual deficit when T0 surplus is insufficient', () => {
      // [-2, 1, 0, 0] -> floor(2/3)=0, no carry -> T1 still missing 1
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [-2, 1, 0, 0]])
      const results = calc.smartCalculate()
      expect(results).toContainEqual({
        material: enemyMat,
        amount: -2,
        tier: 0,
      })
      expect(results).toContainEqual({ material: enemyMat, amount: 1, tier: 1 })
    })

    it('reports leftover T0 surplus after a successful carry', () => {
      // [-4, 1, 0, 0] -> carry 1 from T0 (floor(4/3)=1) -> [-1, 0, 0, 0]
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [-4, 1, 0, 0]])
      const results = calc.smartCalculate()
      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({
        material: enemyMat,
        amount: -1,
        tier: 0,
      })
    })

    it('carries as far as possible then stops at the tier with deficit', () => {
      // [-9, 0, 0, 2] -> T0->T1: 3 carry -> [0,-3,0,2] -> T1->T2: 1 carry -> [0,0,-1,2] -> T2->T3: ... wait -1 is surplus
      // [0, 0, -1, 2]: T2 surplus (-1) -> floor(1/3)=0, no carry -> T3 still missing 2, T2 surplus -1
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [-9, 0, 0, 2]])
      const results = calc.smartCalculate()
      expect(results).toContainEqual({
        material: enemyMat,
        amount: -1,
        tier: 2,
      })
      expect(results).toContainEqual({ material: enemyMat, amount: 2, tier: 3 })
    })
  })

  describe('deficits are not used as conversion source', () => {
    it('does not carry a positive (missing) lower tier upward', () => {
      // [3, 1, 0, 0] - T0 is a deficit, nothing to carry
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [3, 1, 0, 0]])
      const results = calc.smartCalculate()
      expect(results).toContainEqual({ material: enemyMat, amount: 3, tier: 0 })
      expect(results).toContainEqual({ material: enemyMat, amount: 1, tier: 1 })
    })

    it('does not carry a positive T1 to plug a T2 hole', () => {
      // [0, 3, 1, 0] - T1 is missing, nothing to carry upward
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [0, 3, 1, 0]])
      const results = calc.smartCalculate()
      expect(results).toContainEqual({ material: enemyMat, amount: 3, tier: 1 })
      expect(results).toContainEqual({ material: enemyMat, amount: 1, tier: 2 })
    })

    it('skips deficit tiers and still carries from surplus tiers below', () => {
      // [-9, 3, 1, 0]: T0 surplus, T1 deficit (skip carry from T1), T2 deficit
      // T0->T1: floor(9/3)=3 carry -> [0, 0, 1, 0] -> T1 now 0, T2 still missing 1
      // T1->T2: 0, no carry
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [-9, 3, 1, 0]])
      const results = calc.smartCalculate()
      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({
        material: enemyMat,
        amount: 1,
        tier: 2,
      })
    })
  })

  describe('zero omission', () => {
    it('omits a material entirely when all tiers are zero', () => {
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [0, 0, 0, 0]])
      expect(calc.smartCalculate()).toEqual([])
    })

    it('omits individual zero tiers while keeping non-zero ones', () => {
      // [-6, 0, 1, 0]
      // T0 surplus: floor(6/3)=2 carry -> [0, -2, 1, 0]
      // T1 surplus: floor(2/3)=0 carry -> [0, -2, 1, 0]
      // Result: T1 surplus -2, T2 missing 1
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [-6, 0, 1, 0]])
      const results = calc.smartCalculate()
      expect(results).toContainEqual({
        material: enemyMat,
        amount: -2,
        tier: 1,
      })
      expect(results).toContainEqual({ material: enemyMat, amount: 1, tier: 2 })
    })
  })

  describe('surplus at highest tier', () => {
    it('reports excess T3 as negative surplus (nothing above to convert to)', () => {
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [0, 0, 0, -5]])
      const results = calc.smartCalculate()
      expect(results).toContainEqual({
        material: enemyMat,
        amount: -5,
        tier: 3,
      })
    })
  })

  describe('multiple materials are calculated independently', () => {
    it('handles two tiered materials without cross-contamination', () => {
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [-3, 1, 0, 0]]) // fully covered
      calc.addMaterialMap([forgeryMat, [0, 0, 1, 0]]) // still missing T2

      const results = calc.smartCalculate()

      const enemy = results.filter((r) => r.material === enemyMat)
      const forgery = results.filter((r) => r.material === forgeryMat)

      expect(enemy).toHaveLength(0)
      expect(forgery).toHaveLength(1)
      expect(forgery[0]).toMatchObject({ amount: 1, tier: 2 })
    })

    it('handles a mix of flat and tiered materials', () => {
      const calc = new MaterialCalculator()
      calc.addMaterialMap([flatMat, 7]) // missing 7 flat
      calc.addMaterialMap([enemyMat, [-3, 1, 0, 0]]) // fully covered by T0 surplus

      const results = calc.smartCalculate()

      expect(results).toContainEqual({ material: flatMat, amount: 7 })
      expect(results.find((r) => r.material === enemyMat)).toBeUndefined()
    })

    it('handles two materials where one is fully satisfied and one is not', () => {
      const calc = new MaterialCalculator()
      calc.addMaterialMap([enemyMat, [-9, 3, 0, 0]]) // 9/3=3 carry covers T1 exactly
      calc.addMaterialMap([forgeryMat, [-2, 1, 0, 0]]) // floor(2/3)=0, T1 still missing

      const results = calc.smartCalculate()

      expect(results.find((r) => r.material === enemyMat)).toBeUndefined()
      expect(results).toContainEqual({
        material: forgeryMat,
        amount: -2,
        tier: 0,
      })
      expect(results).toContainEqual({
        material: forgeryMat,
        amount: 1,
        tier: 1,
      })
    })
  })

  describe('subtract -> smartCalculate pipeline', () => {
    it('reports nothing missing when owned exactly meets required', () => {
      const required = new MaterialCalculator()
      required.addMaterialMap([enemyMat, [3, 3, 3, 3]])

      const owned = new MaterialCalculator()
      owned.addMaterialMap([enemyMat, [3, 3, 3, 3]])

      required.subtract(owned)
      expect(required.smartCalculate()).toEqual([])
    })

    it('reports nothing missing when owned exceeds required at every tier', () => {
      const required = new MaterialCalculator()
      required.addMaterialMap([enemyMat, [1, 1, 1, 1]])

      const owned = new MaterialCalculator()
      owned.addMaterialMap([enemyMat, [5, 5, 5, 5]])

      required.subtract(owned)
      expect(
        required.smartCalculate().filter((m) => m.amount > 0),
      ).toHaveLength(0)
    })

    it('converts lower-tier surplus to cover a higher-tier shortfall', () => {
      // Need [0,0,0,1], own [27,0,0,0] -> 27 T0 -> 9 T1 -> 3 T2 -> 1 T3
      const required = new MaterialCalculator()
      required.addMaterialMap([enemyMat, [0, 0, 0, 1]])

      const owned = new MaterialCalculator()
      owned.addMaterialMap([enemyMat, [27, 0, 0, 0]])

      required.subtract(owned)
      expect(required.smartCalculate()).toEqual([])
    })

    it('reports deficit when owned lower-tier surplus is just short of covering higher-tier Need', () => {
      // Need [0,0,0,1], own [26,0,0,0] -> 26 T0 -> 8 T1 (remainder 2) -> 2 T2 (remainder 2) -> can't reach T3
      const required = new MaterialCalculator()
      required.addMaterialMap([enemyMat, [0, 0, 0, 1]])

      const owned = new MaterialCalculator()
      owned.addMaterialMap([enemyMat, [26, 0, 0, 0]])

      required.subtract(owned)
      const results = required.smartCalculate().filter((m) => m.amount > 0)
      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({
        material: enemyMat,
        tier: 3,
        amount: 1,
      })
    })

    it('downgrade (high-tier surplus cannot cover low-tier deficit) is not supported', () => {
      // Need [5,0,0,0], own [0,0,0,1] -> T3 surplus can't flow down
      const required = new MaterialCalculator()
      required.addMaterialMap([enemyMat, [5, 0, 0, 0]])

      const owned = new MaterialCalculator()
      owned.addMaterialMap([enemyMat, [0, 0, 0, 1]])

      required.subtract(owned)
      const results = required.smartCalculate()

      // T0 still missing 5, T3 is surplus (-1)
      expect(results).toContainEqual({ material: enemyMat, amount: 5, tier: 0 })
      expect(results).toContainEqual({
        material: enemyMat,
        amount: -1,
        tier: 3,
      })
    })
  })
})
