import NamingRegistry, {
  PrefixScheme,
  SuffixScheme,
} from '../lib/NamingRegistry'
import * as materials from '../resources/materials'

export function registerNamingSchemes(namingRegistry: NamingRegistry) {
  const {
    howler_core,
    whisperin_core,
    polygon_core,
    tidal_residuum,
    waveworn_shard,
    carved_crystal,
    exoswarm_core,
    mech_core,
    waveworn_residue,
    cadence,
    helix,
    phlogiston,
    metallic_drip,
    mask,
    ring,
    string,
    combustor,
    polarizer,
    exoswarm_pendant,
  } = materials
  const T4 = new PrefixScheme(['LF', 'MF', 'HF', 'FF'])

  namingRegistry.register(howler_core, T4)
  namingRegistry.register(whisperin_core, T4)
  namingRegistry.register(polygon_core, T4)
  namingRegistry.register(tidal_residuum, T4)
  namingRegistry.register(waveworn_shard, T4)
  namingRegistry.register(carved_crystal, T4)
  namingRegistry.register(exoswarm_core, T4)
  namingRegistry.register(mech_core, T4)

  namingRegistry.register(
    waveworn_residue,
    new SuffixScheme([239, 235, 226, 210]),
  )
  namingRegistry.register(
    cadence,
    new SuffixScheme(['Seed', 'Bud', 'Leaf', 'Blossom']),
  )
  namingRegistry.register(
    helix,
    new PrefixScheme(['Lento', 'Adagio', 'Andante', 'Presto']),
  )
  namingRegistry.register(
    phlogiston,
    new PrefixScheme(['Impure', 'Extracted', 'Refined', 'Flawless']),
  )
  namingRegistry.register(
    metallic_drip,
    new PrefixScheme(['Inert', 'Reactive', 'Polarized', 'Heterized']),
  )
  namingRegistry.register(
    mask,
    new SuffixScheme([
      'of Constraint',
      'of Erosion',
      'of Distortion',
      'of Insanity',
    ]),
  )
  namingRegistry.register(
    ring,
    new PrefixScheme(['Crude', 'Basic', 'Improved', 'Tailored']),
  )
  namingRegistry.register(
    string,
    new PrefixScheme(['Spliced', 'Broken', 'Solidified', 'Melodic']),
  )
  namingRegistry.register(
    combustor,
    new PrefixScheme(['Incomplete', 'Aftertune', 'Remnant', 'Reverb']),
  )
  namingRegistry.register(
    polarizer,
    new PrefixScheme(['Broken Wing', 'Monowing', 'Polywing', 'Layered Wing']),
  )
  namingRegistry.register(
    exoswarm_pendant,
    new PrefixScheme(['Fractured', 'Worn', 'Chipped', 'Intact']),
  )
}
