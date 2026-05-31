import { MAT_TYPE, Material } from './lib/Material'
import Character from './lib/Character'
import NamingRegistry from './lib/NamingRegistry'
import MaterialCalculator, { MaterialAmount } from './lib/MaterialCalculator'
import { registerNamingSchemes } from './helper/register-naming-schemes'
import { prettyPrintWithRegistry } from './helper/pretty-print-with-registry'
import * as materials from './resources/materials'
import { loadMaterials } from './helper/load-materials'
import { loadCharacters } from './helper/load-characters'
import { characterRegistry } from './resources/characters'

const namingRegistry = new NamingRegistry()
registerNamingSchemes(namingRegistry)

const ownedCharacterNames = loadCharacters('./characters.json')
for (const character of characterRegistry) {
  if (!ownedCharacterNames.has(character.name)) continue
  character.addTag('owned')
}

// Helper functions
const typeOrder: MAT_TYPE[] = [
  MAT_TYPE.ENEMY,
  MAT_TYPE.FORGERY,
  MAT_TYPE.BOSS,
  MAT_TYPE.WEEKLY,
  MAT_TYPE.CREDIT,
  MAT_TYPE.OVERWORLD,
  MAT_TYPE.SPECIAL,
]

const sortMaterialsByType = (a: MaterialAmount, b: MaterialAmount) =>
  typeOrder.indexOf(a.material.type) - typeOrder.indexOf(b.material.type)

const materialAmountToString = (ma: MaterialAmount) =>
  `[${ma.material.type}] ${namingRegistry.format(ma.material, ma.tier)}: ${ma.amount}`

const uses = (material: Material) => (c: Character) => c.hasMaterial(material)

const logMaterials = (materials: MaterialAmount[]) =>
  materials.forEach((ma) => console.log(materialAmountToString(ma)))

const logCharacters = (chars: Iterable<Character>) => {
  for (const c of chars) console.log(prettyPrintWithRegistry(c, namingRegistry))
}

// Playground
const requiredMaterials = new MaterialCalculator()
requiredMaterials.addFromCharacters(characterRegistry.unowned)

console.log('MISSING RESOURCES FOR REMAINING UNOWNED CHARACTERS')

const ownedMaterials = loadMaterials('./inventory.json')

requiredMaterials.subtract(ownedMaterials)
const RESET = '\x1b[0m'
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const logMaterialsFulfilled = (materials: MaterialAmount[]) =>
  materials.forEach((ma) =>
    console.log(
      `${ma.amount > 0 ? RED : GREEN}${materialAmountToString(ma)}${RESET}`,
    ),
  )

logMaterialsFulfilled(
  requiredMaterials
    .smartCalculate()
    .sort(sortMaterialsByType)
    .filter((m) => m.amount > 0),
)

characterRegistry.unowned
  .filter(uses(materials.waveworn_residue))
  .forEach((c) => console.log(c.name))
