'use client';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';
import { BsThreeDots } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa6';
import { FaRegCalendarAlt } from 'react-icons/fa';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';


export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusLabel, setstatusLael] = useState('');
  const [show, setShow] = useState(false);
  //context menu open state
  const [contextMenu, setContextMenu] = useState({
    x: 0,
    y: 0,
    visible: false,
    item: null,
  });

  const createTodo = () => {
    if (!title.trim()) return;
    setTodos([
      {
        id: uuidv4(),
        title,
        description,
        statusLabel,
        createdAt: new Date(),
        movedToOngoingAt: null,
        dueTime: null,
      },
      ...todos,
    ]);

    setTitle('');
    setDescription('');
    setstatusLael('');
  };



  const groupedTodos = {
  new: todos
    .filter((t) => t.statusLabel === 'new')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), // Newest first

  ongoing: todos
    .filter((t) => t.statusLabel === 'ongoing')
    .sort((a, b) => new Date(a.movedToOngoingAt) - new Date(b.movedToOngoingAt)), // Oldest first

  done: todos
    .filter((t) => t.statusLabel === 'done')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), // Newest first (or sort by dueTime if needed)
};



  
//drag and drop functionality
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === draggableId
          ? {
            ...todo,
            statusLabel: destination.droppableId,
            movedToOngoingAt:
              destination.droppableId === 'ongoing' ? new Date() : todo.movedToOngoingAt,
          }
          : todo
      )
    );
  };

const [now, setNow] = useState(new Date());

useEffect(() => {
  const interval = setInterval(() => {
    setNow(new Date());
  }, 10000); // Update every 60 seconds

  return () => clearInterval(interval);
}, []);


//right click context menu open and move functionality
 const handleRightClick = (e, item) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true,
      item,
    });
  };
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu.visible]);

 


  return (
    <>
      <Head>
        <title>Kanban Todo App</title>
      </Head>

      <div className=" p-2 md:p-6 max-w-7xl mx-auto overflow-x-hidden">
        <h1 className="text-3xl font-bold text-center mb-6">Kanban Todo List</h1>

        {show && (
          <div className="s:mx-0 lg:mx-10 mt-10 border-2 border-blue-400 rounded-lg">
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


        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid gap-4 lg:gap-8 md:grid-cols-3 p-8 items-start">
            {['new', 'ongoing', 'done'].map((status) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                     className="p-6 rounded-2xl bg-slate-200 shadow space-y-4 flex flex-col"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-bold pb-2">
                        <p className="capitalize ">{status}</p>
                        <BsThreeDots className="text-lg" />
                      </div>
                      <div className="space-y-3">
                        {groupedTodos[status].map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onContextMenu={(e) => handleRightClick(e, item)}
                                className="bg-white rounded-md shadow p-4 hover:shadow-md transition"
                              >
                                <p
                                  className={`font-medium ${status === 'new'
                                    ? 'bg-blue-400'
                                    : status === 'ongoing'
                                      ? 'bg-orange-400'
                                      : 'bg-green-400'
                                    } px-1 rounded-md text-white w-fit`}
                                >
                                  {item.statusLabel.toUpperCase()}
                                </p>
                                <p className="text-gray-500 text-sm pt-2">{item.description}</p>

                                {status === 'ongoing' && (
                                  <div className="mt-2 flex items-center gap-2">
                                    {item.dueTime && new Date(item.dueTime) < now ?
                                      <></> :
                                      <>
                                        <label className="text-xs text-gray-600">Due Time:</label>


                                        <FaRegCalendarAlt
                                          className="text-xl text-blue-600 cursor-pointer"
                                          onClick={() => {
                                            const input = document.getElementById(`due-time-${item.id}`);
                                            if (input) input.showPicker?.(); // Try showPicker() if supported
                                            else input?.click(); // fallback to click
                                          }}
                                        /></>}

                                    {/* Display selected value */}
                                    {item.dueTime && new Date(item.dueTime) < now ?
                                      (
                                        <p className='text-white bg-red-400 p-1 rounded-md'>This task is past its due time.</p>
                                      ) :
                                      <>
                                        <p className="text-sm text-gray-700">
                                          {new Date(item.dueTime).toLocaleString()}
                                        </p>
                                      </>}

                                    {/* Hidden but accessible datetime input */}
                                    <input
                                      type="datetime-local"
                                      id={`due-time-${item.id}`}
                                      style={{ position: 'absolute', visibility: 'hidden', width: 0, height: 0 }}
                                      value={item.dueTime ? new Date(item.dueTime).toISOString().slice(0, 16) : ''}
                                      onChange={(e) => {
                                        const newDueTime = e.target.value;
                                        setTodos((prev) =>
                                          prev.map((todo) =>
                                            todo.id === item.id ? { ...todo, dueTime: newDueTime } : todo
                                          )
                                        );
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>





                      <div className="flex justify-between pt-4">
                        <div
                          className={`flex items-center gap-2 ${status == 'new' ? 'text-blue-600 hover:text-blue-800 cursor-pointer text-lg font-medium' : "text-lg font-medium text-slate-400 "}`}
                              onClick={status === 'new' ? () => setShow((prev) => !prev) : undefined}
                        >
                          <FaPlus className="" />
                          <p>Add a Card</p>
                        </div>
                      </div>


                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

      </div>
    </>
  );
}
