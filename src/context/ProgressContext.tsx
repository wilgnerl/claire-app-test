import { api } from '@/lib/axios'
import { getSession } from 'next-auth/react'
import { createContext, ReactNode, useEffect, useState } from 'react'

interface ProgressType {
  id: string
  userId: string
  checkBoxId: string
  finished: boolean
}

interface ProgressTypeNew {
  userId: string
  checkBoxId: string
}

interface ProgressContextProps {
  tasks: ProgressType[]
  updateItem: (task: ProgressTypeNew) => void
  listTasks: (userId: string) => void
}
interface ProgressContextProviderProps {
  children: ReactNode
}

export const ProgressContext = createContext({} as ProgressContextProps)

export function ProgressContextProvider({
  children,
}: ProgressContextProviderProps) {
  const [tasks, setTasks] = useState<ProgressType[]>([])

  async function getSessionUser() {
    try {
      const session = await getSession()

      if (session) {
        const response = await api.get(
          `api/progress/list?id=${session?.user.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.token}`,
            },
          },
        )

        setTasks(response.data)
      }
    } catch (error: any) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    const fn = async () => {
      await getSessionUser()
    }
    fn()
  }, [])

  async function updateItem(task: ProgressTypeNew): Promise<void> {
    const index = tasks.findIndex((t) => t.checkBoxId === task.checkBoxId)

    if (index > -1) {
      const updatedTasks = [...tasks]
      updatedTasks[index].finished = !updatedTasks[index].finished

      await api.put('/api/progress/update', {
        id: updatedTasks[index].id,
        finished: true,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      setTasks(updatedTasks)
    } else {
      const taskCreated: ProgressType = await api.post('/api/progress/create', {
        userId: task.userId,
        checkBoxId: task.checkBoxId,
        finished: true,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      setTasks([...tasks, taskCreated])
    }
  }

  async function listTasks(userId: string) {
    const response = await api.get(`/api/progress/list?id=${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    setTasks(response.data)
  }

  return (
    <ProgressContext.Provider value={{ tasks, updateItem, listTasks }}>
      {children}
    </ProgressContext.Provider>
  )
}
