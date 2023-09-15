import { splatPalette } from '../../src/lib/colour';
import { describe, expect, it } from '@jest/globals';
import { Palette } from '../../src/types';

describe('colour', () => {
  describe('splatPalette', () => {
    it('expands the keys', () => {
      const palette = ({
        one: '1A1G1B',
        two: '2A2G2B',
        three: '3A3G3B',
      } as any) as Palette

      const result = splatPalette(palette)

      expect(result).toEqual({
        'one-hex': '1A1G1B',
        'two-hex': '2A2G2B',
        'three-hex': '3A3G3B',
        'one-hex-r': '1A',
        'one-hex-g': '1G',
        'one-hex-b': '1B',
        'two-hex-r': '2A',
        'two-hex-g': '2G',
        'two-hex-b': '2B',
        'three-hex-r': '3A',
        'three-hex-g': '3G',
        'three-hex-b': '3B',
      })
    })
  })
});
