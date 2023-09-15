import { describe, expect, it } from '@jest/globals';
import { parseFromBash, parseFromYaml } from '../../src/lib/parse';
import { loadFixture } from '../utils';

describe('parse', () => {
  const expectedAttributes = {
    name: "Scheme name (light - variant)",
    author: "Tony O'Grady. Username (http://github.com/asdf)",
  }

  describe('parseFromYaml', () => {
    const expectedPalette = {base00: "000000", base01: "111111", base02: "222222", base03: "333333", base04: "444444", base05: "555555", base06: "666666", base07: "777777", base08: "888888", base09: "999999", base0A: "AAAAAA", base0B: "BBBBBB", base0C: "CCCCCC", base0D: "DDDDDD", base0E: "EEEEEE", base0F: "FFFFFF"}

    it('correctly parses the palette', async () =>
      loadFixture('template.yaml').then(buffer => {
        const result = parseFromYaml(buffer.toString())
        // expect(result).toEqual(expect.objectContaining(expectedPalette));
        expect(result).toEqual({...expectedPalette, ...expectedAttributes});
      })
    )
  })

  describe('parseFromBash', () => {
    const expectedPalette = {base00: "0R0G0B", base01: "1R1G1B", base02: "2R2G2B", base03: "3R3G3B", base04: "4R4G4B", base05: "5R5G5B", base06: "6R6G6B", base07: "7R7G7B", base08: "8R8G8B", base09: "9R9G9B", base0A: "ARAGAB", base0B: "BRBGBB", base0C: "CRCGCB", base0D: "DRDGDB", base0E: "EREGEB", base0F: "FRFGFB"}

    it('correctly parses the palette', async () =>
      loadFixture('template.sh').then(buffer => {
        const result = parseFromBash(buffer.toString())
        expect(result).toEqual({...expectedPalette, ...expectedAttributes});
      })
    )
  })
});
