import { MAT_TYPE, Material, MaterialSchema } from './lib/Material'
import Character from './lib/Character'
import NamingRegistry from './lib/NamingRegistry'
import CharacterRegistry from './lib/CharacterRegistry'
import MaterialCalculator from './lib/MaterialCalculator'
import { registerNamingSchemes } from './helper/register-naming-schemes'
import { prettyPrintWithRegistry } from './helper/pretty-print-with-registry'
import * as materials from './resources/materials'

const {
  // Enemy type materials
  howler_core,
  whisperin_core,
  exoswarm_core,
  ring,
  tidal_residuum,
  polygon_core,
  exoswarm_pendant,
  mech_core,
  mask,

  // Forgery type materials
  helix,
  waveworn_residue,
  cadence,
  metallic_drip,
  combustor,
  phlogiston,
  polarizer,
  waveworn_shard,
  string,
  carved_crystal,

  // Weekly type materials
  monument_bell,
  unending_destruction,
  dreamless_feather,
  sentinels_dagger,
  netherworlds_stare,
  when_irises_bloom,
  curse_of_the_abyss,
  gold_in_memory,

  // Boss type materials
  sound_keeping_tacet_core,
  roaring_rock_fist,
  topological_confinement,
  suncoveters_reach,
  elegy_tacet_core,
  rage_tacet_core,
  cleansing_conch,
  blazing_bone,
  platinum_core,
  unfading_glory,
  truth_in_lies,
  abyssal_husk,
  blighted_crown_of_puppet_king,
  our_choice,
  burning_judgement,
  gold_dissolving_feather,
  group_abomination_tacet_core,
  hidden_thunder_tacet_core,
  strife_tacet_core,
  thundering_tacet_core,

  // Overworld type materials
  lantern_berry,
  pecok_flower,
  nova,
  rimewisp,
  loongs_pearl,
  pavo_plum,
  firecracker_jewelweed,
  golden_fleece,
  sword_acorus,
  bloodleaf_viburnum,
  afterlife,
  silverglow_bloom,
  seaside_cendrelis,
  summer_flower,
  luminous_calendula,
  stone_rose,
  wintry_bell,
  moss_amber,
  edelschnee,
  arithmetic_shell,
  gemini_spore,
  belle_poppy,
  iris,
  coriolus,
  terraspawn_fungus,
  violet_coral,
  bamboo_iris,

  // Special type materials
  mysterious_code,

  // Credit type materials
  shell_credit,
} = materials

const namingRegistry = new NamingRegistry()
registerNamingSchemes(namingRegistry)

const characterRegistry = new CharacterRegistry()

const schema = new MaterialSchema(
  {
    [MAT_TYPE.ENEMY]: [4, 12, 12, 4],
    [MAT_TYPE.BOSS]: 46,
    [MAT_TYPE.SPECIAL]: 5,
    [MAT_TYPE.OVERWORLD]: 60,
    [MAT_TYPE.CREDIT]: 170000,
  },
  {
    [MAT_TYPE.FORGERY]: [25, 28, 55, 67],
    [MAT_TYPE.ENEMY]: [25, 28, 40, 57],
    [MAT_TYPE.WEEKLY]: 26,
    [MAT_TYPE.CREDIT]: 2030000,
  },
)

const BaseCharacter = (name: string) => {
  return {
    build({ ascension, forte }: { ascension: Material[]; forte: Material[] }) {
      const character = new Character(name).build({
        schema,
        ascension: [shell_credit, ...ascension],
        forte: [shell_credit, ...forte],
      })
      characterRegistry.register(character)
      return character
    },
  }
}

const zhezhi = BaseCharacter('Zhezhi').build({
  ascension: [howler_core, sound_keeping_tacet_core, lantern_berry],
  forte: [howler_core, helix, monument_bell],
})
const jiyan = BaseCharacter('Jiyan').build({
  ascension: [howler_core, roaring_rock_fist, pecok_flower],
  forte: [howler_core, waveworn_residue, monument_bell],
})
const jianxin = BaseCharacter('Jianxin').build({
  ascension: [whisperin_core, roaring_rock_fist, lantern_berry],
  forte: [whisperin_core, cadence, unending_destruction],
})
const camellya = BaseCharacter('Camellya').build({
  ascension: [whisperin_core, topological_confinement, nova],
  forte: [whisperin_core, metallic_drip, dreamless_feather],
})
const lynae = BaseCharacter('Lynae').build({
  ascension: [exoswarm_core, suncoveters_reach, rimewisp],
  forte: [exoswarm_core, combustor, dreamless_feather],
})
const jinhsi = BaseCharacter('Jinhsi').build({
  ascension: [howler_core, elegy_tacet_core, loongs_pearl],
  forte: [howler_core, waveworn_residue, sentinels_dagger],
})
const changli = BaseCharacter('Changli').build({
  ascension: [ring, rage_tacet_core, pavo_plum],
  forte: [ring, metallic_drip, sentinels_dagger],
})
const phoebe = BaseCharacter('Phoebe').build({
  ascension: [whisperin_core, cleansing_conch, firecracker_jewelweed],
  forte: [whisperin_core, helix, sentinels_dagger],
})
const brant = BaseCharacter('Brant').build({
  ascension: [tidal_residuum, blazing_bone, golden_fleece],
  forte: [tidal_residuum, metallic_drip, netherworlds_stare],
})
const roccia = BaseCharacter('Roccia').build({
  ascension: [tidal_residuum, cleansing_conch, firecracker_jewelweed],
  forte: [tidal_residuum, cadence, netherworlds_stare],
})
const zani = BaseCharacter('Zani').build({
  ascension: [polygon_core, platinum_core, sword_acorus],
  forte: [polygon_core, cadence, netherworlds_stare],
})
const carlotta = BaseCharacter('Carlotta').build({
  ascension: [polygon_core, platinum_core, sword_acorus],
  forte: [polygon_core, phlogiston, netherworlds_stare],
})
const lupa = BaseCharacter('Lupa').build({
  ascension: [howler_core, unfading_glory, bloodleaf_viburnum],
  forte: [howler_core, waveworn_residue, netherworlds_stare],
})
const phrolova = BaseCharacter('Phrolova').build({
  ascension: [polygon_core, truth_in_lies, afterlife],
  forte: [polygon_core, helix, netherworlds_stare],
})
const iuno = BaseCharacter('Iuno').build({
  ascension: [polygon_core, abyssal_husk, silverglow_bloom],
  forte: [polygon_core, cadence, netherworlds_stare],
})
const cantarella = BaseCharacter('Cantarella').build({
  ascension: [polygon_core, cleansing_conch, seaside_cendrelis],
  forte: [polygon_core, helix, when_irises_bloom],
})
const chisa = BaseCharacter('Chisa').build({
  ascension: [polygon_core, abyssal_husk, summer_flower],
  forte: [polygon_core, waveworn_residue, when_irises_bloom],
})
const augusta = BaseCharacter('Augusta').build({
  ascension: [
    tidal_residuum,
    blighted_crown_of_puppet_king,
    luminous_calendula,
  ],
  forte: [tidal_residuum, waveworn_residue, when_irises_bloom],
})
const ciaccona = BaseCharacter('Ciaccona').build({
  ascension: [tidal_residuum, blazing_bone, golden_fleece],
  forte: [tidal_residuum, phlogiston, when_irises_bloom],
})
const qiuyuan = BaseCharacter('Qiuyuan').build({
  ascension: [whisperin_core, truth_in_lies, wintry_bell],
  forte: [whisperin_core, metallic_drip, curse_of_the_abyss],
})
const galbrena = BaseCharacter('Galbrena').build({
  ascension: [tidal_residuum, blighted_crown_of_puppet_king, stone_rose],
  forte: [tidal_residuum, phlogiston, curse_of_the_abyss],
})
const aemeath = BaseCharacter('Aemeath').build({
  ascension: [exoswarm_core, our_choice, moss_amber],
  forte: [exoswarm_core, polarizer, gold_in_memory],
})
const luuk_herssen = BaseCharacter('Luuk Herssen').build({
  ascension: [exoswarm_pendant, suncoveters_reach, edelschnee],
  forte: [exoswarm_pendant, waveworn_shard, gold_in_memory],
})
const sigrika = BaseCharacter('Sigrika').build({
  ascension: [exoswarm_pendant, our_choice, arithmetic_shell],
  forte: [exoswarm_pendant, waveworn_shard, gold_in_memory],
})
const mornye = BaseCharacter('Mornye').build({
  ascension: [mech_core, burning_judgement, gemini_spore],
  forte: [mech_core, carved_crystal, netherworlds_stare],
})
const verina = BaseCharacter('Verina').build({
  ascension: [howler_core, elegy_tacet_core, belle_poppy],
  forte: [howler_core, helix, monument_bell],
})
const rover_spectro = BaseCharacter('Rover (Spectro)').build({
  ascension: [whisperin_core, mysterious_code, pecok_flower],
  forte: [whisperin_core, metallic_drip, unending_destruction],
})
const rover_havoc = BaseCharacter('Rover (Havoc)').build({
  ascension: [whisperin_core, mysterious_code, pecok_flower],
  forte: [whisperin_core, metallic_drip, dreamless_feather],
})
const rover_aero = BaseCharacter('Rover (Aero)').build({
  ascension: [whisperin_core, mysterious_code, pecok_flower],
  forte: [whisperin_core, metallic_drip, when_irises_bloom],
})
const taoqi = BaseCharacter('Taoqi').build({
  ascension: [howler_core, gold_dissolving_feather, iris],
  forte: [howler_core, waveworn_residue, dreamless_feather],
})
const danjin = BaseCharacter('Danjin').build({
  ascension: [ring, strife_tacet_core, belle_poppy],
  forte: [ring, metallic_drip, dreamless_feather],
})
const baizhi = BaseCharacter('Baizhi').build({
  ascension: [howler_core, sound_keeping_tacet_core, lantern_berry],
  forte: [howler_core, helix, monument_bell],
})
const sanhua = BaseCharacter('Sanhua').build({
  ascension: [whisperin_core, sound_keeping_tacet_core, wintry_bell],
  forte: [whisperin_core, metallic_drip, unending_destruction],
})
const lingyang = BaseCharacter('Lingyang').build({
  ascension: [whisperin_core, sound_keeping_tacet_core, coriolus],
  forte: [whisperin_core, cadence, unending_destruction],
})
const yuanwu = BaseCharacter('Yuanwu').build({
  ascension: [ring, hidden_thunder_tacet_core, terraspawn_fungus],
  forte: [ring, cadence, unending_destruction],
})
const encore = BaseCharacter('Encore').build({
  ascension: [whisperin_core, rage_tacet_core, pecok_flower],
  forte: [whisperin_core, helix, unending_destruction],
})
const chixia = BaseCharacter('Chixia').build({
  ascension: [whisperin_core, rage_tacet_core, belle_poppy],
  forte: [whisperin_core, phlogiston, monument_bell],
})
const mortefi = BaseCharacter('Mortefi').build({
  ascension: [whisperin_core, rage_tacet_core, coriolus],
  forte: [whisperin_core, phlogiston, monument_bell],
})
const yinlin = BaseCharacter('Yinlin').build({
  ascension: [whisperin_core, group_abomination_tacet_core, coriolus],
  forte: [whisperin_core, helix, dreamless_feather],
})
const aalto = BaseCharacter('Aalto').build({
  ascension: [howler_core, roaring_rock_fist, wintry_bell],
  forte: [howler_core, phlogiston, monument_bell],
})
const yangyang = BaseCharacter('Yangyang').build({
  ascension: [ring, roaring_rock_fist, wintry_bell],
  forte: [ring, metallic_drip, unending_destruction],
})
const calcharo = BaseCharacter('Calcharo').build({
  ascension: [ring, thundering_tacet_core, iris],
  forte: [ring, waveworn_residue, monument_bell],
})
const youhu = BaseCharacter('Youhu').build({
  ascension: [ring, topological_confinement, violet_coral],
  forte: [ring, cadence, monument_bell],
})
const shorekeeper = BaseCharacter('Shorekeeper').build({
  ascension: [whisperin_core, topological_confinement, nova],
  forte: [whisperin_core, helix, sentinels_dagger],
})
const xiangli_yao = BaseCharacter('Xiangli Yao').build({
  ascension: [whisperin_core, hidden_thunder_tacet_core, violet_coral],
  forte: [whisperin_core, cadence, unending_destruction],
})
const lumi = BaseCharacter('Lumi').build({
  ascension: [howler_core, thundering_tacet_core, terraspawn_fungus],
  forte: [howler_core, waveworn_residue, sentinels_dagger],
})
const cartethyia = BaseCharacter('Cartethyia').build({
  ascension: [tidal_residuum, unfading_glory, bamboo_iris],
  forte: [tidal_residuum, metallic_drip, when_irises_bloom],
})
const buling = BaseCharacter('Buling').build({
  ascension: [whisperin_core, blighted_crown_of_puppet_king, pecok_flower],
  forte: [whisperin_core, helix, curse_of_the_abyss],
})

const ownedCharacters = [
  verina,
  rover_spectro,
  rover_havoc,
  rover_aero,
  taoqi,
  danjin,
  baizhi,
  sanhua,
  lingyang,
  yuanwu,
  encore,
  chixia,
  mortefi,
  yinlin,
  aalto,
  yangyang,
  calcharo,
  youhu,
  shorekeeper,
  xiangli_yao,
  lumi,
  cartethyia,
  buling,
]
ownedCharacters.forEach((c) => c.addTag('owned'))

const unownedMaterialCalculator = new MaterialCalculator()

// Add materials for characters not owned to calculator
unownedMaterialCalculator.addFromCharacters(characterRegistry.unowned)

// Get amount of weekly materials needed for all unowned characters
console.log(
  unownedMaterialCalculator
    .calculate(4)
    .filter((m) => m.material.type === MAT_TYPE.WEEKLY),
)

// Pretty print characters not owned
characterRegistry.unowned
  .map((c) => prettyPrintWithRegistry(c, namingRegistry))
  .forEach((c) => console.log(c))

// Get unowned characters that has Netherworld's Stare as a material
const usesNetherworldsStare = (c: Character) =>
  c.hasMaterial(netherworlds_stare)
console.log(
  characterRegistry.unowned.filter(usesNetherworldsStare).map((c) => c.name),
)
