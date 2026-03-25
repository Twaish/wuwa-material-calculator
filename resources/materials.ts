import { MAT_TYPE, Material } from '../lib/Material'

/*
# Enemy & Forgery type materials
These materials follow a 4 tier system.
Tier examples: `LF`, `MF`, `HF`, `FF`

3 materials from a previous tier is needed to create 1 of the next. 
Synthesis example: `3 LF = 1 MF`, `3 MF = 1 HF`, ... 

They cannot be converted in the opposite way e.g. `1 MF != 3 LF`.
*/

// Enemy type materials
export const howler_core = new Material('Howler Core', MAT_TYPE.ENEMY)
export const whisperin_core = new Material('Whispering Core', MAT_TYPE.ENEMY)
export const exoswarm_core = new Material('Exoswarm Core', MAT_TYPE.ENEMY)
export const ring = new Material('Ring', MAT_TYPE.ENEMY)
export const tidal_residuum = new Material('Tidal Residuum', MAT_TYPE.ENEMY)
export const polygon_core = new Material('Polygon Core', MAT_TYPE.ENEMY)
export const exoswarm_pendant = new Material('Exoswarm Pendant', MAT_TYPE.ENEMY)
export const mech_core = new Material('Mech Core', MAT_TYPE.ENEMY)
export const mask = new Material('Mask', MAT_TYPE.ENEMY)

// Forgery type materials
export const helix = new Material('Helix', MAT_TYPE.FORGERY)
export const waveworn_residue = new Material(
  'Waveworn Residue',
  MAT_TYPE.FORGERY,
)
export const cadence = new Material('Cadence', MAT_TYPE.FORGERY)
export const metallic_drip = new Material('Metallic Drip', MAT_TYPE.FORGERY)
export const combustor = new Material('Combustor', MAT_TYPE.FORGERY)
export const phlogiston = new Material('Phlogiston', MAT_TYPE.FORGERY)
export const polarizer = new Material('Polarizer', MAT_TYPE.FORGERY)
export const waveworn_shard = new Material('Waveworn Shard', MAT_TYPE.FORGERY)
export const string = new Material('String', MAT_TYPE.FORGERY)
export const carved_crystal = new Material('Carved Crystal', MAT_TYPE.FORGERY)

// Weekly type materials
export const monument_bell = new Material('Monument Bell', MAT_TYPE.WEEKLY)
export const unending_destruction = new Material(
  'Unending Destruction',
  MAT_TYPE.WEEKLY,
)
export const dreamless_feather = new Material(
  'Dreamless Feather',
  MAT_TYPE.WEEKLY,
)
export const sentinels_dagger = new Material(
  "Sentinel's Dagger",
  MAT_TYPE.WEEKLY,
)
export const netherworlds_stare = new Material(
  "The Netherworld's Stare",
  MAT_TYPE.WEEKLY,
)
export const when_irises_bloom = new Material(
  'When Irises Bloom',
  MAT_TYPE.WEEKLY,
)
export const curse_of_the_abyss = new Material(
  'Curse of the Abyss',
  MAT_TYPE.WEEKLY,
)
export const gold_in_memory = new Material('Gold in Memory', MAT_TYPE.WEEKLY)

// Boss type materials
export const sound_keeping_tacet_core = new Material(
  'Sound-Keeping Tacet Core',
  MAT_TYPE.BOSS,
)
export const roaring_rock_fist = new Material(
  'Roaring Rock Fist',
  MAT_TYPE.BOSS,
)
export const topological_confinement = new Material(
  'Topological Confinement',
  MAT_TYPE.BOSS,
)
export const suncoveters_reach = new Material(
  "Suncoveter's Reach",
  MAT_TYPE.BOSS,
)
export const elegy_tacet_core = new Material('Elegy Tacet Core', MAT_TYPE.BOSS)
export const rage_tacet_core = new Material('Rage Tacet Core', MAT_TYPE.BOSS)
export const cleansing_conch = new Material('Cleansing Conch', MAT_TYPE.BOSS)
export const blazing_bone = new Material('Blazing Bone', MAT_TYPE.BOSS)
export const platinum_core = new Material('Platinum Core', MAT_TYPE.BOSS)
export const unfading_glory = new Material('Unfading Glory', MAT_TYPE.BOSS)
export const truth_in_lies = new Material('Truth in Lies', MAT_TYPE.BOSS)
export const abyssal_husk = new Material('Abyssal Husk', MAT_TYPE.BOSS)
export const blighted_crown_of_puppet_king = new Material(
  'Blighted Crown of Puppet King',
  MAT_TYPE.BOSS,
)
export const our_choice = new Material('Our Choice', MAT_TYPE.BOSS)
export const burning_judgement = new Material(
  'Burning Judgement',
  MAT_TYPE.BOSS,
)
export const gold_dissolving_feather = new Material(
  'Gold-Dissolving Feather',
  MAT_TYPE.BOSS,
)
export const group_abomination_tacet_core = new Material(
  'Group Abomination Tacet Core',
  MAT_TYPE.BOSS,
)
export const hidden_thunder_tacet_core = new Material(
  'Hidden Thunder Tacet Core',
  MAT_TYPE.BOSS,
)
export const strife_tacet_core = new Material(
  'Strife Tacet Core',
  MAT_TYPE.BOSS,
)
export const thundering_tacet_core = new Material(
  'Thundering Tacet Core',
  MAT_TYPE.BOSS,
)

// Overworld type materials
export const lantern_berry = new Material('Lantern Berry', MAT_TYPE.OVERWORLD)
export const pecok_flower = new Material('Pecok Flower', MAT_TYPE.OVERWORLD)
export const nova = new Material('Nova', MAT_TYPE.OVERWORLD)
export const rimewisp = new Material('Rimewisp', MAT_TYPE.OVERWORLD)
export const loongs_pearl = new Material("Loong's Pearl", MAT_TYPE.OVERWORLD)
export const pavo_plum = new Material('Pavo Plum', MAT_TYPE.OVERWORLD)
export const firecracker_jewelweed = new Material(
  'Firecracker Jewelweed',
  MAT_TYPE.OVERWORLD,
)
export const golden_fleece = new Material('Golden Fleece', MAT_TYPE.OVERWORLD)
export const sword_acorus = new Material('Sword Acorus', MAT_TYPE.OVERWORLD)
export const bloodleaf_viburnum = new Material(
  'Bloodleaf Viburnum',
  MAT_TYPE.OVERWORLD,
)
export const afterlife = new Material('Afterlife', MAT_TYPE.OVERWORLD)
export const silverglow_bloom = new Material(
  'Silverglow Bloom',
  MAT_TYPE.OVERWORLD,
)
export const seaside_cendrelis = new Material(
  'Seaside Cendrelis',
  MAT_TYPE.OVERWORLD,
)
export const summer_flower = new Material('Summer Flower', MAT_TYPE.OVERWORLD)
export const luminous_calendula = new Material(
  'Luminous Calendula',
  MAT_TYPE.OVERWORLD,
)
export const stone_rose = new Material('Stone Rose', MAT_TYPE.OVERWORLD)
export const wintry_bell = new Material('Wintry Bell', MAT_TYPE.OVERWORLD)
export const moss_amber = new Material('Moss Amber', MAT_TYPE.OVERWORLD)
export const edelschnee = new Material('Edelschnee', MAT_TYPE.OVERWORLD)
export const arithmetic_shell = new Material(
  'Arithmetic Shell',
  MAT_TYPE.OVERWORLD,
)
export const gemini_spore = new Material('Gemini Spore', MAT_TYPE.OVERWORLD)
export const belle_poppy = new Material('Belle Poppy', MAT_TYPE.OVERWORLD)
export const iris = new Material('Iris', MAT_TYPE.OVERWORLD)
export const coriolus = new Material('Corioulus', MAT_TYPE.OVERWORLD)
export const terraspawn_fungus = new Material(
  'Terraspawn Fungus',
  MAT_TYPE.OVERWORLD,
)
export const violet_coral = new Material('Violet Coral', MAT_TYPE.OVERWORLD)
export const bamboo_iris = new Material('Bamboo Iris', MAT_TYPE.OVERWORLD)

// Special type materials
export const mysterious_code = new Material('Mysterious Code', MAT_TYPE.SPECIAL)

// Credit type materials
export const shell_credit = new Material('Shell Credit', MAT_TYPE.CREDIT)
