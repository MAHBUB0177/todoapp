'use client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';
import { BsThreeDots } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa6';

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusLabel, setstatusLael] = useState('');
  const [show, setShow] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    x: 0,
    y: 0,
    visible: false,
    item: null,
  });

  const createTodo = () => {
    if (!title.trim()) return;
    setTodos([
      { id: uuidv4(), title, description, statusLabel, createdAt: new Date() },
      ...todos,
    ]);
    setTitle('');
    setDescription('');
    setstatusLael('');
  };

  const newTodos = todos.filter((item) => item.statusLabel.toLowerCase() === 'new');
  const ongoingTodos = todos.filter((item) => item.statusLabel.toLowerCase() === 'ongoing');
  const doneTodos = todos.filter((item) => item.statusLabel.toLowerCase() === 'done');

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu.visible]);

  const handleRightClick = (e, item) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true,
      item,
    });
  };

  const renderTodoCard = (todos, colorClass) =>
    todos.map((item, i) => (
      <div
        key={i}
        onContextMenu={(e) => handleRightClick(e, item)}
        className="bg-white rounded-md shadow p-4 hover:shadow-md transition"
      >
        <p className={`font-medium ${colorClass} px-1 rounded-md text-white w-fit`}>
          {item?.statusLabel.toUpperCase()}
        </p>
        <p className="text-gray-500 text-sm pt-2">{item?.description}</p>
      </div>
    ));

  return (
    <>
      <Head>
        <title>Kanban Todo App</title>
      </Head>

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Kanban Todo List</h1>

        {show && (
          <div className="mx-14 mt-10 border-2 border-blue-400 rounded-lg">
            <div className="p-8">
              <div className="grid gap-4 md:grid-cols-4">
                <input
                  type="text"
                  name="title"
                  className="block rounded-md border border-slate-300 bg-white px-3 py-4 placeholder:font-semibold placeholder:text-gray-500 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  type="text"
                  name="description"
                  className="block rounded-md border border-slate-300 bg-white px-3 py-4 placeholder:font-semibold placeholder:text-gray-500 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input
                  type="text"
                  name="status"
                  className="block rounded-md border border-slate-300 bg-white px-3 py-4 placeholder:font-semibold placeholder:text-gray-500 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm lowercase"
                  placeholder="Status (new, ongoing, done)"
                  value={statusLabel}
                  onChange={(e) => setstatusLael(e.target.value.toLowerCase())}
                />
                <button
                
                  className="rounded-lg bg-blue-700 px-8 py-5 text-sm font-semibold text-white cursor-pointer"
                  onClick={createTodo}
                >
                  Add a Card
                </button>
              </div>
            </div>
          </div>
        )}

        {contextMenu.visible && (
          <ul
            className="fixed z-50 bg-white border border-gray-300 shadow-lg rounded-md py-2 text-sm"
            style={{ top: contextMenu.y, left: contextMenu.x, minWidth: '150px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {['new', 'ongoing', 'done']
              .filter((s) => s !== contextMenu.item?.statusLabel.toLowerCase())
              .map((targetStatus) => (
                <li
                  key={targetStatus}
                  onClick={() => {
                    setTodos((prev) =>
                      prev.map((todo) =>
                        todo.id === contextMenu.item.id
                          ? { ...todo, statusLabel: targetStatus }
                          : todo
                      )
                    );
                    setContextMenu({ ...contextMenu, visible: false });
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                >
                  Move to {targetStatus}
                </li>
              ))}
          </ul>
        )}

        <div className="grid gap-4 lg:gap-8 md:grid-cols-3 p-8">
          {/* New Column */}
          <div className="p-6 rounded-2xl bg-slate-200 shadow space-y-4 h-auto">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <p>New</p>
                <BsThreeDots className="text-lg" />
              </div>
              <div className="space-y-3">{renderTodoCard(newTodos, 'bg-blue-400')}</div>
              <div className="flex justify-between pt-4">
                <div
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => setShow((prev) => !prev)}
                >
                  <FaPlus className="text-lg" />
                  <p>Add a Card</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ongoing Column */}
          <div className="p-6 rounded-2xl bg-slate-200 shadow space-y-4 h-auto">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <p>Ongoing</p>
                <BsThreeDots className="text-lg" />
              </div>
              <div className="space-y-3">{renderTodoCard(ongoingTodos, 'bg-orange-400')}</div>
            </div>
          </div>

          {/* Done Column */}
          <div className="p-6 rounded-2xl bg-slate-200 shadow space-y-4 h-auto">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <p>Done</p>
                <BsThreeDots className="text-lg" />
              </div>
              <div className="space-y-3">{renderTodoCard(doneTodos, 'bg-green-400')}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
