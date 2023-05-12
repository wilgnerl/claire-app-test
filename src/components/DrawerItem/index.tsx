import {
  Accordion,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import { v4 as uuidV4 } from 'uuid'
import ModuleAccordion from '../ModuleAccordion'

export default function DrawerItem({ contents, isOpen, onClose }: any) {
  return (
    <>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bgColor="orange.600">
          <DrawerCloseButton />
          <DrawerHeader>
            <Center
              color="white"
              fontWeight="bold"
              fontSize="2xl"
              pt="12"
              pl="12"
              pr="12"
            >
              Metodologia
            </Center>
          </DrawerHeader>

          <DrawerBody>
            <Accordion allowToggle color="white">
              {contents.map((item: any) => {
                return (
                  <ModuleAccordion
                    key={uuidV4()}
                    moduleName={item.moduleName}
                    data={item.data}
                  />
                )
              })}
            </Accordion>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
