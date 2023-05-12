import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import ModalCreateCompany from '@/components/ModalCreateCompany'
import { api } from '@/lib/axios'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'
import Link from 'next/link'

interface Company {
  id: string
  name: string
  createdAt: string
  _count: {
    users: number
  }
}

export default function Admin({ session }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [companiesList, setCompaniesList] = useState<Company[]>([])

  useEffect(() => {
    const fn = async () => {
      try {
        const result = await api.get('/api/company/list', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
          method: 'GET',
        })
        setCompaniesList(result.data)
      } catch (error: any) {
        console.error(error.message)
        setCompaniesList([])
      }
    }
    fn()
  }, [session.token])

  async function handleDeleteCompany(id: string) {
    await api.delete(`/api/company/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const newCompaniesList = companiesList.filter(
      (company) => company.id !== id,
    )

    setCompaniesList(newCompaniesList)
  }

  const fontSizeHead: string = '14'
  return (
    <Box bgColor="white" w="100wh" height="100vh">
      <Flex justify="space-between" bgColor="orange.600" align="center" px="8">
        <Container color="white" fontSize="3xl" fontWeight="light" py="10">
          Cadastrar Empresas
          <Link href="/main">
            <Button
              display="block"
              fontSize="xl"
              bgColor="orange.200"
              _hover={{
                backgroundColor: 'orange.400',
              }}
              w="40"
              textAlign="center"
              mt="2"
            >
              Voltar
            </Button>
          </Link>
        </Container>
        <Button
          bgColor="orange.200"
          _hover={{
            backgroundColor: 'orange.400',
          }}
          color="white"
          px="10"
          fontWeight="bold"
          onClick={onOpen}
        >
          Cadastrar empresa
        </Button>
      </Flex>

      <TableContainer mt="10" mx="20">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th fontSize={fontSizeHead} fontWeight="extrabold">
                Empresa
              </Th>
              <Th fontSize={fontSizeHead} fontWeight="extrabold">
                Cadastrado em
              </Th>
              <Th isNumeric fontSize={fontSizeHead} fontWeight="extrabold">
                Numero de funcionarios
              </Th>
              <Th fontSize={fontSizeHead} fontWeight="extrabold">
                Remover
              </Th>
            </Tr>
          </Thead>
          <Tbody fontSize="sm">
            {companiesList.map((company) => {
              const data = new Date(company.createdAt)
              const dataFormatada = format(data, 'dd/MM/yyyy')
              return (
                <Tr key={company.id}>
                  <Td>{company.name}</Td>
                  <Td>{dataFormatada}</Td>
                  <Td isNumeric>{company._count.users}</Td>
                  <Td>
                    <IconButton
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDeleteCompany(company.id)}
                    >
                      Remover
                    </IconButton>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <ModalCreateCompany
        isOpen={isOpen}
        onClose={onClose}
        setCompany={setCompaniesList}
        companies={companiesList}
      />
    </Box>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context)
  // let response
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  } else {
    if (session.user!.role !== 'admin') {
      return {
        redirect: {
          destination: '/main',
          permanent: false,
        },
      }
    }
  }

  return {
    props: { session }, // will be passed to the page component as props
  }
}
