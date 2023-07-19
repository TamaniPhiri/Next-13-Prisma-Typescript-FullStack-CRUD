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

interface Notes {
  notes: {
    id: string;
    title: string;
    description: string;
  }[];
}

export default function Home({ notes }: Notes) {
  const router = useRouter();
  const [error, setError] = useState("");
  const[selected,setSelected]=useState(false);
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    id: "",
  });

  const refreshData = () => {
    router.replace(router.asPath);
  };

  async function create(data: FormData) {
    if (data.description === "" || data.title === "") {
      return setError("Fill in the missing fields");
    }
    try {
      fetch("http://localhost:3000/api/create", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        if (data.id) {
          deleteNote(data.id);
          setSelected(true)
          setForm({ title: "", description: "", id: "" });
          refreshData();
          setSelected(false)
        } else {
          setForm({ title: "", description: "", id: "" });
          refreshData();
        }
      });
    } catch (error) {
      console.log(error);
      setSelected(false)
    }
  }

  async function deleteNote(id: string) {
    setSelected(false)
    try {
      fetch(`http://localhost:3000/api/note/${id}`, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      }).then(() => {
        refreshData();
        console.log("Successfully deleted note");
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      create(data);
      setSelected(false)
    } catch (error) {
      console.log(error);
      setSelected(false)
    }
  };
  const handleUpdate = (title:string,description:string,id:string) => {
    setForm({
      title,
      description,
      id
    })
    setSelected(true)
  }
  return (
    <main
      className={`${inter.className} flex w-full gap-3 flex-col px-4 md:px-10 justify-center items-center min-h-screen`}
    >
      <div>Notes</div>
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
          onChange={(e) => {
            setError("");
            setForm({ ...form, title: e.target.value });
          }}
        />
        <textarea
          className="p-2 rounded-md w-72 bg-gray-800"
          placeholder="Description"
          value={form.description}
          onChange={(e) => {
            setError("");
            setForm({ ...form, description: e.target.value });
          }}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className={`w-72 ${selected?"bg-green-600 text-black hover:bg-green-700":"bg-blue-800 text-white hover:bg-blue-900"} flex items-center justify-center p-2 rounded`}
        >
          {selected?"Save":"Create"}
        </button>
      </form>
      <div className="flex flex-col w-72 pt-5 gap-4 items-center">
        {notes.map((note) => {
          return (
            <div key={note.id} className="flex w-full flex-col gap-2">
              <span className="font-bold">{note.title}</span>
              <p className="font-bold border-b text-gray-400">{note.description}</p>
              <div className="flex w-full justify-end gap-2 items-center">
                <button
                  onClick={() => deleteNote(note.id)}
                  className="bg-red-500 hover:bg-red-700 text-white text-2xl p-1 rounded"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M20 7v14a1 1 0 01-1 1H5a1 1 0 01-1-1V7H2V5h20v2h-2zM6 7v13h12V7H6zm1-5h10v2H7V2zm4 8h2v7h-2v-7z" />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    {handleUpdate(note.description,note.title,note.id)}
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white text-2xl p-1 rounded"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                  >
                    <path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3l1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma?.notes.findMany({
    select: {
      title: true,
      id: true,
      description: true,
    },
  });
  return {
    props: {
      notes,
    },
  };
};
