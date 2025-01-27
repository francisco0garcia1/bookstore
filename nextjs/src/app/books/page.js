import { useState, useEffect } from "react";
import axios from 'axios';
import "./books.css";
import { Table } from "../components/Table";
import { Modal } from "../components/Modal";

function Books() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [authorsList, setAuthorsList] = useState([])


  const handleEditRow = (idx) => {
    setRowToEdit(idx);
    setModalOpen(true);
  };

  const handleSubmit = (newRow) => {
    if(rowToEdit === null){
      // new book
      const postBook = async () => {
        try{
          const response = await axios.post("http://localhost:8000/books", {
            "title": newRow.title,
            "year": parseInt(newRow.year),
            "status": newRow.status === "" ? "NA" : newRow.status,
            "author": {
              "id": newRow.author_id === "-1" ? null : parseInt(newRow.author_id),
              "name": newRow.author_name,
            }
          });
        }catch(error){
          console.error('Failed to post new book:', error);
        }
      }
      postBook();
    }else{
      // edit book
      const book_id = rows[rowToEdit].id
      const putBook = async () => {
        try{
          const response = await axios.put(`http://localhost:8000/books/${book_id}`, {
            "title": newRow.title,
            "year": parseInt(newRow.year),
            "status": newRow.status === "" ? "NA" : newRow.status,
            "author_id": newRow.author_id === "-1" ? null : parseInt(newRow.author_id),
            "author_name": newRow.author_name,
            }
          );
        }catch(error){
          console.error('Failed to update book:', error);
        }
      }

      putBook();
    }
  };

  const extractBookData = (row) => {
    return {
      "title": row.title,
      "id": row.id,
      "year": row.year,
      "author_id": row.author.id,
      "status": row.status,
      "author_name": row.author.name,
    };
  }

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksResponse = await axios.get('http://localhost:8000/books');
        setRows(booksResponse.data);
        // get authors list
        const al = booksResponse.data.map(row => row.author)
        const uniqueAl = [...new Map(al.map(item => [item["id"], item])).values()]
        setAuthorsList(uniqueAl);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchBooks();
  }, [modalOpen]);

  return (
    <div className="Books">
      <Table rows={rows} editRow={handleEditRow} />
      <button onClick={() => setModalOpen(true)} className="btn">
        Add
      </button>
      {modalOpen && (
        <Modal
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null && extractBookData(rows[rowToEdit])}
          authorsList={authorsList}
        />
      )}
    </div>
  );
}

export default Books;