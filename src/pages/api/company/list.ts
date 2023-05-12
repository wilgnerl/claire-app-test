import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const header = req.headers.authorization
    const token = header?.split(' ')[1]
    let compare
    try {
      compare = jwt.verify(token as string, process.env.JWT_TOKEN as string)
    } catch (err) {
      return res.status(500).json({ message: 'Error Token' })
    }

    if (compare) {
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
      } catch (err) {
        console.log(err)
        res.status(500).json({ ok: true })
      }
    } else {
      return res.status(400).json({ error: 'Error' })
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: 'Method not allowed.' })
  }
}
