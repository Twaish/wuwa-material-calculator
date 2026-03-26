import { Material } from './Material'

export interface NamingScheme {
  format(baseName: string, tier: number): string
}

export class PrefixScheme implements NamingScheme {
  constructor(private prefixes: string[]) {}

  format(baseName: string, tier: number) {
    return `${this.prefixes[tier]} ${baseName}`
  }
}

export class SuffixScheme implements NamingScheme {
  constructor(private suffixes: (string | number)[]) {}

  format(baseName: string, tier: number) {
    return `${baseName} ${this.suffixes[tier]}`
  }
}

export class CustomListScheme implements NamingScheme {
  constructor(private names: string[]) {}

  format(_: string, tier: number) {
    return this.names[tier]
  }
}

export default class NamingRegistry {
  private materialSchemes = new Map<Material, NamingScheme>()

  register(material: Material, scheme: NamingScheme) {
    this.materialSchemes.set(material, scheme)
  }

  format(material: Material, tier?: number): string {
    const scheme = this.materialSchemes.get(material)
    if (!scheme) return material.name

    if (tier == null) {
      throw new Error(`No tier provided for ${material.name} which has tiers`)
    }

    return scheme.format(material.name, tier)
  }
}
