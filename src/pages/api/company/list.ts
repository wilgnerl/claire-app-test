import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    })

    try {
      res.status(200).json(companies)
    } catch (err: any) {
      console.log(err.message)
      res.status(500).json({ ok: true })
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: 'Method not allowed.' })
  }
}
