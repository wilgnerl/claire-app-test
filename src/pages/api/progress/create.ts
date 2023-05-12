import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // Process a POST request
    const { userId, checkBoxId, finished } = req.body
    const createTask = await prisma.progressTask.create({
      data: {
        userId,
        checkBoxId,
        finished,
      },
    })

    try {
      res.status(200).json(createTask)
    } catch (err: any) {
      console.log(err.message)
      res.status(500).json({ ok: true })
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: 'Method not allowed.' })
  }
}
