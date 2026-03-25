import { BoundMaterial } from '../lib/Material'
import NamingRegistry from '../lib/NamingRegistry'

export function prettyPrintWithRegistry(
  character: any,
  namingRegistry: NamingRegistry,
): string {
  const lines: string[] = []

  lines.push(`Character: ${character.name}\n`)

  function printSection(title: string, section: any) {
    lines.push(`${title}:`)

    for (const [type, data] of Object.entries(section) as [
      string,
      BoundMaterial,
    ][]) {
      lines.push(`  ${type}:`)

      const material = data.material
      const tiers = data.tiers

      if (Array.isArray(tiers)) {
        tiers.forEach((amount: number, i: number) => {
          const name = namingRegistry.format(material, i)
          lines.push(`    ${name} x${amount}`)
        })
      } else {
        const name = namingRegistry.format(material, 0)
        lines.push(`    ${name} x${tiers}`)
      }

      lines.push('')
    }
  }

  printSection('Ascension', character.ascension)
  printSection('Forte', character.forte)

  return lines.join('\n')
}
