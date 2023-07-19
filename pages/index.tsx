import { GetServerSideProps } from "next";
import { Epilogue } from "next/font/google";
import { useState } from "react";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";

const inter = Epilogue({ subsets: ["latin"] });

interface FormData {
  title: string;
  description: string;
  id: string;
}

interface Notes{
  notes:{
    id: string,
    title: string,
    description: string
  }[]
}

export default function Home({notes}:Notes) {
  const router=useRouter()
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    id: "",
  });

  const refreshData =()=>{
    router.replace(router.asPath)
  }

  async function create(data: FormData){
    try {
      fetch('http://localhost:3000/api/create',{
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        },
        method:'POST'
      }).then(()=>{
        setForm({title:"", description:"",id:""})
        refreshData()
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit=async(data:FormData)=>{
    try {
      create(data)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <main
      className={`${inter.className} flex w-full gap-3 flex-col px-4 md:px-10 justify-center items-center min-h-screen`}
    >
      <div>CRUD</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(form);
        }}
        className="flex flex-col items-center gap-2"
      >
        <input
          type="text"
          className="p-2 rounded-md w-72 bg-gray-800"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="p-2 rounded-md w-72 bg-gray-800"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit" className="w-72 bg-blue-800 hover:bg-blue-900 flex items-center justify-center p-2 rounded">
          Save
        </button>
      </form>
      <div className="flex flex-col w-72 pt-5 gap-2 items-center">
        {notes.map(note =>{
          return(
            <div key={note.id} className="flex w-full border-b flex-col gap-2">
              <span className="font-bold">
              {note.title}
              </span>
              <p className="font-bold text-gray-400">
                {note.description}
              </p>
            </div>
          )
        })}
      </div>
    </main>
  );
}

export const getServerSideProps:GetServerSideProps=async()=>{
  const notes=await prisma?.notes.findMany({
    select:{
      title:true,
      id:true,
      description:true
    }
  })
  return{
    props:{
      notes
    }
  }
}
