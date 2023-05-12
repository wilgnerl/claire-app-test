import { ProgressContext } from '@/context/ProgressContext'
import {
  AccordionButton,
  AccordionIcon,
  Text,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Link,
} from '@chakra-ui/react'
import { useContext } from 'react'
import { v4 as uuidV4 } from 'uuid'

export default function WeekAccordion({ weekName, content }: any) {
  const { tasks } = useContext(ProgressContext)

  function hasFinished(id: string, checkboxes: any) {
    let hasFinished = false

    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checkBoxId === id) {
        hasFinished = checkboxes[i].finished
        break
      }
    }

    return hasFinished
  }

  return (
    <AccordionItem>
      <AccordionButton>
        <AccordionIcon />
        <Box as="span" flex="1" textAlign="left" fontSize="sm">
          <strong>{weekName}</strong>
        </Box>
      </AccordionButton>

      {content.map((x: any) => {
        const isChecked = hasFinished(x.id, tasks)
        return (
          <AccordionPanel pb={4} key={uuidV4()}>
            <Checkbox
              pt={1}
              pb={1}
              pl={8}
              size="md"
              colorScheme="green"
              key={x.id}
              flex="1"
              isChecked={isChecked}
            >
              <Link href={`/day/${x.id}`}>
                <Text>{x.text.children[0].text}</Text>
              </Link>
            </Checkbox>
          </AccordionPanel>
        )
      })}
    </AccordionItem>
  )
}
