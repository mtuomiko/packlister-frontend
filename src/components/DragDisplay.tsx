import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Route, Routes } from 'react-router-dom';
import Packlist from './Packlist';
import PacklistList from './PacklistList';
import UserItemList from './UserItemList';

const DragDisplay = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <UserItemList />
      <PacklistList />
      <Routes>
        <Route path="packlists/:packlistId" element={<Packlist />} />
      </Routes>
    </DndProvider>
  );
};

export default DragDisplay;
