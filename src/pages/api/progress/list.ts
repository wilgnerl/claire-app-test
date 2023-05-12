import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Sua lógica de rota aqui
  if (req.method === 'GET') {
    const { id } = req.query

    const header = req.headers.authorization
    const token = header?.split(' ')[1]
    let compare
    try {
      compare = jwt.verify(token as string, process.env.JWT_TOKEN as string)
    } catch (err) {
      return res.status(500).json({ message: 'Error Token' })
    }

    if (compare) {
      // Process a POST request
      const listProgress = await prisma.progressTask.findMany({
        where: {
          userId: id as string,
        },
      })

      try {
        res.status(200).json(listProgress)
      } catch (err: any) {
        console.error(err.message)
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
