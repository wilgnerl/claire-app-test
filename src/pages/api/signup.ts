import { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // Process a POST request
    const { email, password, companyId, name } = req.body

    const salt = Number(process.env.SALT)

    const hashed = await hash(password, salt)

    const createCompany = await prisma.user.create({
      data: {
        name,
        companyId,
        email,
        password: hashed,
      },
    })

    try {
      res.status(200).json(createCompany)
    } catch (err) {
      console.error(err)
      res.status(500).json({ erro: true })
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: 'Method not allowed.' })
  }
}
