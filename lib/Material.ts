export enum MAT_TYPE {
  ENEMY = 'ENEMY',
  FORGERY = 'FORGERY',
  WEEKLY = 'WEEKLY',
  BOSS = 'BOSS',
  OVERWORLD = 'OVERWORLD',
  CREDIT = 'CREDIT',
  SPECIAL = 'SPECIAL',
}

export class Material {
  constructor(
    public name: string,
    public type: MAT_TYPE,
  ) {}
}

export type TierMap = {
  [MAT_TYPE.ENEMY]: [number, number, number, number]
  [MAT_TYPE.FORGERY]: [number, number, number, number]
  [MAT_TYPE.WEEKLY]: number
  [MAT_TYPE.BOSS]: number
  [MAT_TYPE.OVERWORLD]: number
  [MAT_TYPE.CREDIT]: number
  [MAT_TYPE.SPECIAL]: number
}

export type SchemaMap = Partial<{
  [K in MAT_TYPE]: TierMap[K]
}>

export class MaterialSchema {
  constructor(
    public ascension: SchemaMap,
    public forte: SchemaMap,
  ) {}
}

export type BoundMaterial<K extends MAT_TYPE = MAT_TYPE> = {
  material: Material
  tiers: TierMap[K]
}
