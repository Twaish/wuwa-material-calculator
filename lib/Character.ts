import {
  BoundMaterial,
  MAT_TYPE,
  Material,
  MaterialSchema,
  SchemaMap,
} from './Material'
import { Tag } from '../resources/tags'

type Section = Record<MAT_TYPE, BoundMaterial>

export default class Character {
  name: string
  tags = new Set<Tag>()

  ascension!: Section
  forte!: Section

  constructor(name: string) {
    this.name = name
  }

  addTag(tag: Tag) {
    this.tags.add(tag)
    return this
  }

  hasTag(tag: Tag) {
    return this.tags.has(tag)
  }

  build(params: {
    schema: MaterialSchema
    ascension: Material[]
    forte: Material[]
  }) {
    const ascensionMap = this.mapByType(params.ascension)
    const forteMap = this.mapByType(params.forte)

    this.ascension = this.bind(params.schema.ascension, ascensionMap)
    this.forte = this.bind(params.schema.forte, forteMap)

    return this
  }

  getMaterials(): BoundMaterial[] {
    return [...Object.values(this.ascension), ...Object.values(this.forte)]
  }

  private mapByType(materials: Material[]): Map<MAT_TYPE, Material> {
    const map: Map<MAT_TYPE, Material> = new Map()

    for (const mat of materials) {
      map.set(mat.type, mat)
    }

    return map
  }

  private bind(
    schemaMap: SchemaMap,
    materialMap: Map<MAT_TYPE, Material>,
  ): Section {
    const result: Partial<Section> = {}

    for (const type of Object.keys(schemaMap) as MAT_TYPE[]) {
      const material = materialMap.get(type)

      if (!material) {
        console.warn(
          `${this.name} is missing material for type: ${type}. Is this intended? Skipping...`,
        )
        continue
      }

      result[type] = {
        material,
        tiers: <BoundMaterial['tiers']>schemaMap[type],
      }
    }

    return <Section>result
  }
}
