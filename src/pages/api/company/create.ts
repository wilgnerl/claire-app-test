import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // Process a POST request
    const { companyName } = req.body

    const createCompany = await prisma.company.create({
      data: {
        name: companyName,
      },
    })

    try {
      res.status(200).json(createCompany)
    } catch (err) {
      console.log(err)
      res.status(500).json({ ok: true })
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: 'Method not allowed.' })
  }
}
