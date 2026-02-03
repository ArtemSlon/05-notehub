// import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import { deleteNote, fetchNotes } from "../../services/noteService";

function App() {
  // const [count, setCount] = useState(0)
  const page = 1;
const perPage = 12;

const { data, isLoading, isError } = useQuery({
  queryKey: ['notes', page],
  queryFn: () =>
    fetchNotes({
      page,
      perPage,
    }),
});

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Something went wrong</p>;
  }

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          {/* Компонент SearchBox */}
          {/* Пагінація */}
          {/* Кнопка створення нотатки */}
        </header>
      </div>
      {data?.notes.length > 0 && (
  <NoteList
    notes={data.notes}
    onDelete={handleDelete}
  />
)}
    </>
  );
}

export default App;
