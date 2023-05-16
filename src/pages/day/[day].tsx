import { cms } from '@/lib/cms'
import { v4 as uuidV4 } from 'uuid'

import {
  AspectRatio,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import Header from '@/components/Header'
import DrawerItem from '@/components/DrawerItem'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { ProgressContext } from '@/context/ProgressContext'
import { File } from 'phosphor-react'

export default function Day({ content, contents, session }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { updateItem } = useContext(ProgressContext)
  const toast = useToast()

  const router = useRouter()
  const checkBoxId = router.query.day as string
  const userId = session.user.id

  function handleTaskFinished() {
    toast({
      title: 'Task atualizada.',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
    updateItem({ userId, checkBoxId })
  }

  return (
    <>
      <Header onOpen={onOpen} session={session} />
      <DrawerItem isOpen={isOpen} onClose={onClose} contents={contents} />
      <Flex width="80%" direction="column" p="12" mx="auto">
        {content[0].WeekInfo.map((data: any) => {
          if (
            data.style === 'h1' ||
            data.style === 'h2' ||
            data.style === 'h3'
          ) {
            return (
              <div key={uuidV4()}>
                <Heading mt={3} mb={6} as="h2">
                  {data.children[0].text}
                </Heading>
                <Divider my="4" />
                {content[0].documents ? (
                  <Link
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    href={`https://cdn.sanity.io/files/krpexbv5/production/${
                      content[0].documents?.asset?._ref.split('-')[1]
                    }.pdf`}
                    download
                    target="_blank"
                  >
                    <File size={32} color="#d95319" weight="fill" />
                    <Text>{content[0].documents.description}</Text>
                  </Link>
                ) : (
                  <>
                    <Text>Sem documentos</Text>
                  </>
                )}
                <Divider my="4" />
                <Box justifyContent="center">
                  {content[0].videoUrl ? (
                    <AspectRatio mb="10" ratio={2}>
                      <iframe
                        title="video"
                        // src="https://www.youtube.com/embed/ufXYbsIQ-LI"
                        src={content[0].videoUrl}
                        allowFullScreen
                      />
                    </AspectRatio>
                  ) : (
                    <>
                      <Text>Sem video neste modulo</Text>
                      <Divider my="4" />
                    </>
                  )}
                </Box>
              </div>
            )
          } else {
            return (
              <div key={uuidV4()}>
                {data.children.map((children: any) => {
                  if (
                    children.marks.length > 0 &&
                    children.marks[0] === 'strong'
                  ) {
                    return (
                      <Text
                        mt={4}
                        key={uuidV4()}
                        textAlign="justify"
                        fontWeight="bold"
                      >
                        {children.text}
                      </Text>
                    )
                  }
                  return (
                    <Text key={uuidV4()} textAlign="justify" mt={2}>
                      {children.text}
                    </Text>
                  )
                })}
              </div>
            )
          }
        })}
        <Button
          my="10"
          bgColor="orange.300"
          _hover={{
            backgroundColor: 'orange.400',
          }}
          color="white"
          onClick={handleTaskFinished}
        >
          Finalizar tarefa
        </Button>
      </Flex>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context)

  const params = context.params

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  try {
    const ids = await cms.fetch(`*[_type=="content"]`)
    const id = params.day
    const query = `*[_id=="${id}"]`
    const responseData = await cms.fetch(query)

    const transformedData: any = {}

    ids.forEach((item: any) => {
      const moduleName = item.moduleName
      const weekName = item.weekName
      const content = { text: item.WeekInfo[0], id: item._id }

      if (!transformedData[moduleName]) {
        transformedData[moduleName] = { moduleName, data: [] }
      }

      const existingWeek = transformedData[moduleName].data.find(
        (w: any) => w.weekName === weekName,
      )

      if (existingWeek) {
        existingWeek.content.push(content)
      } else {
        transformedData[moduleName].data.push({
          weekName,
          content: [content],
        })
      }
    })

    Object.values(transformedData).forEach((module: any) => {
      module.data.forEach((week: any) => {
        week.content.sort((a: any, b: any) =>
          a.text.children[0].text.localeCompare(b.text.children[0].text),
        )
      })
    })

    // console.log(responseData[0]?.documents?.asset?._ref.split('-')[1])

    const result = Object.values(transformedData)

    return {
      props: {
        content: responseData,
        contents: result,
        session,
      },
    }
  } catch (error) {
    return {
      props: { data: null },
      revalidate: 30,
      notFound: true,
    }
  }
}
