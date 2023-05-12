import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PUT') {
    // Process a POST request
    const { id } = req.body
    const task = await prisma.progressTask.findUnique({
      where: {
        id,
      },
    })

    const updateTask = await prisma.progressTask.update({
      where: {
        id,
      },
      data: {
        finished: !task?.finished,
      },
    })

    try {
      res.status(200).json(updateTask)
    } catch (err: any) {
      console.log(err.message)
      res.status(500).json({ ok: true })
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: 'Method not allowed.' })
  }
}
