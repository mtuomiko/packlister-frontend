import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Route, Routes } from 'react-router-dom';
import { Flex, useDisclosure } from '@chakra-ui/react';
import Packlist from 'components/Packlist';
import Header from 'components/Header';
import Sidebar from './Sidebar';

const MainDisplay = () => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  return (
    <>
      <Header isSidebarOpen={isOpen} onToggleSidebar={onToggle} />

      <DndProvider backend={HTML5Backend}>
        <Flex direction={'row'}>
          {isOpen ? <Sidebar /> : null}
          <Routes>
            <Route path="packlists/:packlistId" element={<Packlist />} />
          </Routes>
        </Flex>
      </DndProvider>
    </>
  );
};

export default MainDisplay;
