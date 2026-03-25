import Character from './Character'
import { Material } from './Material'
import { Tag } from '../resources/tags'

class CharacterQuery implements Iterable<Character> {
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

  private execute(): Set<Character> {
    const initial = new Set(this.source)
    return this.steps.reduce((acc, fn) => fn(acc), initial)
  }

  [Symbol.iterator](): Iterator<Character> {
    return this.execute().values()
  }

  toArray(): Character[] {
    const initial = new Set(this.source)
    const final = this.steps.reduce((acc, fn) => fn(acc), initial)
    return [...final]
  }

  forEach(fn: (c: Character) => void) {
    for (const c of this) fn(c)
  }

  map<T>(fn: (c: Character) => T): T[] {
    const result: T[] = []
    for (const c of this) result.push(fn(c))
    return result
  }

  filter(fn: (c: Character) => boolean): CharacterQuery {
    return this.chain((chars) => {
      const result = new Set<Character>()
      for (const c of chars) {
        if (fn(c)) result.add(c)
      }
      return result
    })
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
}

export default class CharacterRegistry implements Iterable<Character> {
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

  get unowned() {
    return this.excludeTags(['owned'])
  }
  get owned() {
    return this.hasTag('owned')
  }

  private get q() {
    return new CharacterQuery(this.characters, this)
  }

  [Symbol.iterator](): Iterator<Character> {
    return this.q[Symbol.iterator]()
  }

  findByMaterials = (materials: Material[]) => this.q.findByMaterials(materials)
  findAny = (materials: Material[]) => this.q.findAny(materials)
  findWithout = (materials: Material[]) => this.q.findWithout(materials)
  hasTag = (tag: Tag) => this.q.hasTag(tag)
  hasTags = (tags: Tag[]) => this.q.hasTags(tags)
  excludeTags = (tags: Tag[]) => this.q.excludeTags(tags)
  map = <T>(fn: (c: Character) => T): T[] => this.q.map(fn)
  forEach = (fn: (c: Character) => void) => this.q.forEach(fn)
  filter = (fn: (c: Character) => boolean): CharacterQuery => this.q.filter(fn)

  some(fn: (c: Character) => boolean): boolean {
    for (const c of this) if (fn(c)) return true
    return false
  }
  every(fn: (c: Character) => boolean): boolean {
    for (const c of this) if (!fn(c)) return false
    return true
  }
  find(fn: (c: Character) => boolean): Character | undefined {
    for (const c of this) if (fn(c)) return c
    return undefined
  }
}
