import z from 'zod'

// from https://github.com/umami-software/umami/blob/abc02465e386db0487176715ad0a800c7a324cab/src/lib/schema.ts#L39
export const anyObjectParam = z.looseObject({})

// from https://github.com/umami-software/umami/blob/abc02465e386db0487176715ad0a800c7a324cab/src/lib/schema.ts#L41-L53
export const urlOrPathParam = z.string().refine(
  (value) => {
    try {
      new URL(value, 'https://localhost')
      return true
    } catch {
      return false
    }
  },
  {
    message: 'Invalid URL.',
  },
)

// from https://github.com/umami-software/umami/blob/abc02465e386db0487176715ad0a800c7a324cab/src/app/api/send/route.ts#L16-L34
export const umamiPostRequestSchema = z.object({
  type: z.enum(['event', 'identify']),
  payload: z.object({
    website: z.uuid(),
    data: anyObjectParam.optional(),
    hostname: z.string().max(100).optional(),
    language: z.string().max(35).optional(),
    referrer: urlOrPathParam.optional(),
    screen: z.string().max(11).optional(),
    title: z.string().optional(),
    url: urlOrPathParam.optional(),
    name: z.string().max(50).optional(),
    tag: z.string().max(50).optional(),
    ip: z.ipv4().or(z.ipv6()).optional(),
    userAgent: z.string().optional(),
    timestamp: z.coerce.number().int().optional(),
    id: z.string().optional(),
  }),
})
export type UmamiPostRequest = z.infer<typeof umamiPostRequestSchema>
