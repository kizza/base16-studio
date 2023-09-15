import { describe, expect, it } from '@jest/globals';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { maybeErrored } from '../../src/lib/api'

describe('api', () => {
  describe('maybeErrored', () => {
    it('response with the error', () => {
      let resStatus = 0
      let resJson = {}
      const res = {
        status: (code: number) => {
          resStatus = code
          return {
            json: (object: {}) => {
              resJson = object
            }
          }
        }
      } as NextApiResponse

      const handler = (_req: NextApiRequest, _res: NextApiResponse) => {
        throw new Error('There was an error');
      }

      const wrappedHandler = maybeErrored(handler)
      wrappedHandler({ } as NextApiRequest, res)
      expect(resStatus).toEqual(500)
      expect(resJson).toEqual({message: 'There was an error'})
    })
  })
})
