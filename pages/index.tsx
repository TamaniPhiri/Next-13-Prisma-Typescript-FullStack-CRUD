import { Epilogue } from "next/font/google";
import { useState } from "react";

const inter = Epilogue({ subsets: ["latin"] });

export default function Home() {
  const[form,setForm]=useState({title:"",description:"",id:""})
  return (
    <main
      className={`${inter.className} flex w-full gap-3 flex-col px-4 md:px-10 justify-center items-center min-h-screen`}
    >
      <div>CRUD</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex flex-col items-center gap-2"
      >
        <input
          type="text"
          className="p-2 rounded-md w-72 bg-gray-800"
          placeholder="Title"
          value={form.title}
          onChange={e=>setForm({...form,title: e.target.value})}
        />
        <textarea
          className="p-2 rounded-md w-72 bg-gray-800"
          placeholder="Description"
          value={form.description}
          onChange={e=>setForm({...form,description: e.target.value})}
        />
      </form>
    </main>
  );
}
