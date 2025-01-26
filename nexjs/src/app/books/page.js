import { useState, useEffect } from "react";
import axios from 'axios';

import "./Books.css";
import { Table } from "../components/Table";
import { Modal } from "../components/Modal";

function Books() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [authorsList, setAuthorsList] = useState([])

  const handleDeleteRow = (targetIndex) => {
    setRows(rows.filter((_, idx) => idx !== targetIndex));
  };

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
            "status": newRow.status,
            "author": {
              "id": newRow.author_id === "-1" ? null : parseInt(newRow.author_id),
              "name": newRow.author_name,
            }
          });
          console.log(response.data);
        }catch(error){
          console.error('Failed to post new book:', error);
        }
      }

      postBook();
    }else{
      // edit book
      const putBook = async () => {
        try{

        }catch(error){
          console.error('Failed to update book:', error);
        }
      }
    }
    // rowToEdit === null
    //   ? setRows([...rows, newRow])
    //   : setRows(
    //       rows.map((currRow, idx) => {
    //         if (idx !== rowToEdit) return currRow;

    //         return newRow;
    //       })
    //     );
  };

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
  }, []);

  return (
    <div className="Books">
      <Table rows={rows} deleteRow={handleDeleteRow} editRow={handleEditRow} />
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
          defaultValue={rowToEdit !== null && rows[rowToEdit]}
          authorsList={authorsList}
        />
      )}
    </div>
  );
}

export default Books;