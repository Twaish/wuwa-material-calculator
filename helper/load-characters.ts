import fs from 'fs'

export function loadCharacters(charactersPath: string): Set<string> {
  return new Set(
    JSON.parse(fs.readFileSync(charactersPath, 'utf8')) as string[],
  )
}
