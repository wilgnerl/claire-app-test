import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'DELETE') {
    const { id } = req.query

    const companies = await prisma.company.delete({
      where: {
        id: id as string,
      },
    })

    try {
      res.status(200).json(companies)
    } catch (err) {
      console.log(err)
      res.status(500).json({ ok: true })
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: 'Method not allowed.' })
  }
}
