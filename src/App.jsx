import React, { useEffect, useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import moment from 'moment'
import 'animate.css'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:8080"

const App = () => {
  const [todo, setTodo] = useState([])
  const [update, setUpdate] = useState(0)
  const [editId, seteditId] = useState(null)
  const [open, setOpen] = useState(false)

  const TodoFormModel = { title: "", des: "" }
  const [productForm, setProductForm] = useState(TodoFormModel)

  useEffect(() => {
    fetchTodo()
  }, [update])

  const fetchTodo = async () => {
    const { data } = await axios.get("/todo")
    setTodo(data)
  }

  const handleProductForm = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const createTodo = async (e) => {
    e.preventDefault()
    await axios.post("/todo", productForm)
    setUpdate(update + 1)
    setProductForm(TodoFormModel)
    setOpen(false)
  }

  const saveTodo = async (e) => {
    e.preventDefault()
    await axios.put(`/todo/${editId}`, productForm)
    setUpdate(update + 1)
    setProductForm(TodoFormModel)
    seteditId(null)
    setOpen(false)
  }

  const deleteProduct = async (id) => {
    await axios.delete(`/todo/${id}`)
    setUpdate(update + 1)
  }

  const editProduct = (item) => {
    setOpen(true)
    seteditId(item._id)
    setProductForm({ title: item.title, des: item.des })
  }

  return (
    <div className='bg-gradient-to-br from-slate-950 via-slate-900 to-black min-h-screen p-6'>

      {/* HEADER */}
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500'>
          Todo App
        </h1>

        <button
          onClick={() => {
            setOpen(true)
            seteditId(null)
            setProductForm(TodoFormModel)
          }}
          className='bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition flex items-center gap-2'
        >
          <i className='ri-add-line'></i> New Todo
        </button>
      </div>

      {/* TODO CARDS GRID */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {todo.map(item => (
          <div
            key={item._id}
            className='bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-xl hover:scale-[1.02] transition animate__animated animate__fadeInUp'
          >

            {/* TITLE + ACTIONS */}
            <div className='flex justify-between items-start mb-3'>
              <h2 className='text-lg font-semibold text-white'>
                {item.title}
              </h2>

              <div className='flex gap-2'>
                <button
                  onClick={() => editProduct(item)}
                  className='bg-emerald-500/20 text-emerald-400 w-8 h-8 rounded-full hover:bg-emerald-500 hover:text-white transition'
                >
                  <i className='ri-edit-line'></i>
                </button>

                <button
                  onClick={() => deleteProduct(item._id)}
                  className='bg-rose-500/20 text-rose-400 w-8 h-8 rounded-full hover:bg-rose-500 hover:text-white transition'
                >
                  <i className='ri-delete-bin-2-line'></i>
                </button>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className='text-slate-300 text-sm mb-4'>
              {item.des}
            </p>

            {/* DATE */}
            <span className='text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full'>
            {moment(item.createdAt).format('MMM DD YYYY, hh:mm A')}
            </span>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
          <div className='bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate__animated animate__zoomIn'>

            <h1 className='text-xl font-bold text-slate-800 mb-4'>
              {editId ? "Edit Todo" : "Add New Todo"}
            </h1>

            <form
              onSubmit={editId ? saveTodo : createTodo}
              className='flex flex-col gap-4'
            >
              <input
                name='title'
                value={productForm.title}
                onChange={handleProductForm}
                placeholder='Enter your idea'
                className='border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none'
                required
              />

              <input
                name='des'
                value={productForm.des}
                onChange={handleProductForm}
                placeholder='Share your thought'
                className='border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none'
                required
              />

              <button className='bg-gradient-to-r from-indigo-500 to-sky-500 text-white rounded-full py-2 font-semibold shadow-md hover:scale-105 transition'>
                {editId ? "Save Changes" : "Create Todo"}
              </button>
            </form>

            <button
              onClick={() => {
                setOpen(false)
                seteditId(null)
                setProductForm(TodoFormModel)
              }}
              className='absolute top-4 right-4 text-gray-500 hover:text-gray-800'
            >
              <i className='ri-close-circle-fill text-2xl'></i>
            </button>

          </div>
        </div>
      )}

    </div>
  )
}

export default App
