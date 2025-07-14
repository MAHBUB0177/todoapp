// pages/index.js
'use client'
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';

const statusColors = {
  New: 'bg-blue-200',
  Ongoing: 'bg-orange-200',
  Done: 'bg-green-200',
};

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusLabel, setstatusLael] = useState('');
 

 

  const createTodo = () => {
    if (!title.trim()) return;
    setTodos([
      { id: uuidv4(), title, description,statusLabel , createdAt: new Date() },
      ...todos,
    ]);
    setTitle('');
    setDescription('');
    setstatusLael('');
  };




  

  return (
    <>
      <Head>
        <title>Kanban Todo App</title>
      </Head>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Kanban Todo List</h1>

        <div className="flex space-x-4 mb-6">
          <input
            className="border px-4 py-2 w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="border px-4 py-2 w-full"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

           <input
            className="border px-4 py-2 w-full"
            placeholder="Title"
            value={statusLabel}
            onChange={(e) => setstatusLael(e.target.value)}
          />
          <button onClick={createTodo} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Task
          </button>
        </div>

        

       
      </div>
    </>
  );
}