import Character from './Character'
import { Material } from './Material'
import { Tag } from '../resources/tags'

class CharacterQuery {
  private steps: ((chars: Set<Character>) => Set<Character>)[] = []

  constructor(
    private source: Character[],
    private registry: CharacterRegistry,
  ) {}

  private chain(fn: (chars: Set<Character>) => Set<Character>): CharacterQuery {
    const q = new CharacterQuery(this.source, this.registry)
    q.steps = [...this.steps, fn]
    return q
  }

  /**
   * Find characters that contain all listed materials
   *
   * @param materials The materials that must all be present
   * @returns Characters matching all materials
   */
  findByMaterials(materials: Material[]): CharacterQuery {
    if (materials.length === 0) return this

    return this.chain((chars) => {
      // const sets = materials.map(
      //   (mat) => this.registry.byMaterial.get(mat) ?? new Set(),
      // ) as Set<Character>[]

      // const [first, ...rest] = sets
      // const result = new Set(first)

      // for (const set of rest) {
      //   for (const char of result) {
      //     if (!set.has(char)) result.delete(char)
      //   }
      // }

      // const pool = new Set(chars)
      // return [...result].filter((c) => pool.has(c))
      const sets = materials
        .map((mat) => this.registry.byMaterial.get(mat))
        .filter((s) => s !== undefined)
        .sort((a, b) => a.size - b.size)

      if (sets.length === 0) return new Set()

      const [first, ...rest] = sets
      const result = new Set<Character>()

      for (const c of first) {
        if (!chars.has(c)) continue
        if (rest.every((s) => s.has(c))) result.add(c)
      }

      return result
    })
  }

  /**
   * Find characters that contain at least one listed material
   *
   * @param materials Materials where at least 1 must be present
   * @returns Characters matching any material
   */
  findAny(materials: Material[]): CharacterQuery {
    if (materials.length === 0) return this

    return this.chain((chars) => {
      // const pool = new Set(chars)
      // const result = new Set<Character>()

      // for (const mat of materials) {
      //   const fromIndex = this.registry.byMaterial.get(mat)
      //   if (!fromIndex) continue

      //   for (const c of fromIndex) {
      //     if (pool.has(c)) {
      //       result.add(c)
      //     }
      //   }
      // }

      // return [...result]

      const result = new Set<Character>()

      for (const mat of materials) {
        const indexed = this.registry.byMaterial.get(mat)
        if (!indexed) continue

        for (const c of indexed) {
          // result.size == chars.size nothing new can be added
          if (chars.has(c)) result.add(c)
        }

        if (result.size === chars.size) break
      }

      return result
    })
  }

  /**
   * Finds characters that do not contain any listed material
   *
   * @param materials Materials to exclude
   * @returns Characters without the listed materials
   */
  findWithout(materials: Material[]): CharacterQuery {
    if (materials.length === 0) return this

    return this.chain((chars) => {
      // const pool = new Set(chars)
      // const excluded = new Set<Character>()

      // for (const mat of materials) {
      //   const fromIndex = this.registry.byMaterial.get(mat)
      //   if (!fromIndex) continue

      //   for (const c of fromIndex) {
      //     if (pool.has(c)) {
      //       excluded.add(c)
      //     }
      //   }
      // }

      // return chars.filter((c) => !excluded.has(c))
      const result = new Set(chars)

      for (const mat of materials) {
        const indexed = this.registry.byMaterial.get(mat)
        if (!indexed) continue

        for (const c of indexed) {
          result.delete(c)
        }

        if (result.size === 0) break
      }

      return result
    })
  }

  /**
   * Finds characters that have a specific tag
   *
   * @param tag Tag to match
   * @returns Characters with the tag
   */
  hasTag(tag: Tag): CharacterQuery {
    // return this.chain((chars) => chars.filter((c) => c.hasTag(tag)))
    return this.chain((chars) => {
      const result = new Set<Character>()
      for (const c of chars) {
        if (c.hasTag(tag)) result.add(c)
      }
      return result
    })
  }

  /**
   * Finds characters that have all listed tags
   *
   * @param tags Tags that must all be present
   * @returns Characters matching all tags
   */
  hasTags(tags: Tag[]): CharacterQuery {
    // return this.chain((chars) =>
    //   chars.filter((c) => tags.every((tag) => c.hasTag(tag))),
    // )
    if (tags.length === 0) return this
    if (tags.length === 1) return this.hasTag(tags[0])

    return this.chain((chars) => {
      const result = new Set<Character>()
      for (const c of chars) {
        if (tags.every((tag) => c.hasTag(tag))) result.add(c)
      }
      return result
    })
  }

  /**
   * Finds characters that do not have any listed tags
   *
   * @param tags Tags to exclude
   * @returns Characters without the specified tags
   */
  excludeTags(tags: Tag[]): CharacterQuery {
    if (tags.length === 0) return this

    return this.chain((chars) => {
      const result = new Set<Character>()
      for (const c of chars) {
        if (tags.every((tag) => !c.hasTag(tag))) result.add(c)
      }
      return result
    })
  }

  toArray(): Character[] {
    const initial = new Set(this.source)
    const final = this.steps.reduce((acc, fn) => fn(acc), initial)
    return [...final]
  }
}

export default class CharacterRegistry {
  private characters: Character[] = []

  readonly byMaterial: Map<Material, Set<Character>> = new Map()
  readonly characterMaterials: Map<Character, Set<Material>> = new Map()

  /**
   * Registers a character and indexes it by its materials
   *
   * @param character The character to register
   */
  register(character: Character) {
    this.characters.push(character)

    const materials = character.getMaterials().map((b) => b.material)
    const materialSet = new Set<Material>(materials)

    this.characterMaterials.set(character, materialSet)

    for (const material of materialSet) {
      let bucket = this.byMaterial.get(material)
      if (!bucket) {
        bucket = new Set()
        this.byMaterial.set(material, bucket)
      }
      bucket.add(character)
    }
  }

  /**
   * Starts a registry query
   *
   * @returns Query instance
   */
  query(): CharacterQuery {
    return new CharacterQuery(this.characters, this)
  }
}
