import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  useToast,
} from '@chakra-ui/react'
import WeekAccordion from '../WeekAccordion'
import { v4 as uuidV4 } from 'uuid'
import { useState } from 'react'
import BasicUsage from '../BasicModal'
import { useSession } from 'next-auth/react'

export default function ModuleAccordion({ moduleName, data }: any) {
  const { data: session } = useSession()

  const localStorageName = `${session?.user.id} - ${moduleName}`

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  // const [closePasswordModal, setClosePasswordModal] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordCorrect, setPasswordCorrect] = useState(
    Boolean(localStorage.getItem(localStorageName)),
  )

  const toast = useToast()

  function handleAccordionButtonClick() {
    if (!passwordCorrect) {
      setShowPasswordModal(true)
    }
  }

  function handleModal() {
    setShowPasswordModal(false)
  }

  function handlePasswordModalClose() {
    if (password === 'modulo') {
      setPasswordCorrect(true)
      localStorage.setItem(localStorageName, 'true')
    }
    toast({
      title: 'Modulo desbloqueado',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
  }

  return (
    <AccordionItem>
      <h2>
        <AccordionButton onClick={handleAccordionButtonClick}>
          <AccordionIcon />
          <Box as="span" flex="1" textAlign="left">
            <strong>{moduleName}</strong>
          </Box>
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        {!passwordCorrect ? (
          <></>
        ) : (
          <>
            <Accordion allowMultiple>
              <h2>
                {data
                  .slice(0)
                  .reverse()
                  .map((dataContent: any) => {
                    return (
                      <WeekAccordion
                        key={uuidV4()}
                        weekName={dataContent.weekName}
                        content={dataContent.content}
                      />
                    )
                  })}
              </h2>
            </Accordion>
          </>
        )}
      </AccordionPanel>
      <BasicUsage
        title={moduleName}
        isOpen={showPasswordModal}
        onClose={handleModal}
        password={password}
        setPassword={setPassword}
        handleFormPassword={handlePasswordModalClose}
        handleModal={handleModal}
      />
    </AccordionItem>
  )
}
