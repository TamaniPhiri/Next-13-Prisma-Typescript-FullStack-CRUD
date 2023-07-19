import { GetServerSideProps } from "next";
import { Epilogue } from "next/font/google";
import { useState } from "react";
import { prisma } from "@/lib/prisma";

const inter = Epilogue({ subsets: ["latin"] });

interface FormData {
  title: string;
  description: string;
  id: string;
}

export default function Home() {
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    id: "",
  });

  async function create(data: FormData){
    try {
      fetch('http://localhost:3000/api/create',{
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        },
        method:'POST'
      }).then(()=>setForm({title:"", description:"",id:""}))
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
