import { useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import { fetchNotes } from "../../services/noteService";
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

 
const { data, isLoading, isError } = useQuery({
  queryKey: ['notes', page, search],
  queryFn: () =>
    fetchNotes({
      page,
      perPage,
      search,
    }),
    placeholderData: (prev) => prev,
});
  
  const debouncedSearch = useDebouncedCallback(
  (value: string) => {
    setSearch(value);
    setPage(1);
  },
  500
);

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
    onPageChange={setPage}
  />
)}
          {<button type='button' onClick={() => setIsModalOpen(true)} className={css.button }>Create note +</button>}
        </header>
      </div>
      {data && data.notes.length > 0 && (
  <NoteList
    notes={data.notes}
  />
      )}
      {isModalOpen && (
  <Modal onClose={() => setIsModalOpen(false)}>
    <NoteForm onCancel={() => setIsModalOpen(false)} />
  </Modal>
)}
    </>
  );
}

export default App;
