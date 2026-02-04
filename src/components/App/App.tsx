import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import { deleteNote, fetchNotes, createNote } from "../../services/noteService";
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { useDebouncedCallback } from 'use-debounce';
import SearchBox from '../SearchBox/SearchBox';

function App() {
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
const perPage = 12;

const handlePageChange = (page: number) => {
  setPage(page);  
}; 
const { data, isLoading, isError } = useQuery({
  queryKey: ['notes', page, search],
  queryFn: () =>
    fetchNotes({
      page,
      perPage,
    }),
});
  
  const debouncedSearch = useDebouncedCallback(
  (value: string) => {
    setSearch(value);
    setPage(1);
  },
  500
);

  const queryClient = useQueryClient();
  const createMutation = useMutation({
  mutationFn: createNote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    setIsModalOpen(false);
  },
  });
  const handleCreateNote = (values: {
  title: string;
  content: string;
  tag: string;
}) => {
  createMutation.mutate(values);
};
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
          {<SearchBox onSearch={debouncedSearch} />}
          {data && data.totalPages > 1 && (
  <Pagination
    pageCount={data.totalPages}
    currentPage={page}
    onPageChange={handlePageChange}
  />
)}
          {<button onClick={() => setIsModalOpen(true)} className={css.button }>Create note +</button>}
        </header>
      </div>
      {data && data.notes.length > 0 && (
  <NoteList
    notes={data.notes}
    onDelete={handleDelete}
  />
      )}
      {isModalOpen && (
  <Modal onClose={() => setIsModalOpen(false)}>
    <NoteForm onCancel={() => setIsModalOpen(false)} onSubmit={handleCreateNote}
      isSubmitting={createMutation.isPending} />
  </Modal>
)}
    </>
  );
}

export default App;
