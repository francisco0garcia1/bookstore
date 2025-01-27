import React, { useState } from "react";

import "./Modal.css";

export const Modal = ({ closeModal, onSubmit, defaultValue, authorsList}) => {
  const [formState, setFormState] = useState(
    defaultValue || {
      "title": "",
      "id": "-1",
      "year": "",
      "author_id": "-1",
      "status": "",
      "author_name": ""
    }
  );
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    const requiredKeys = ["title","year"];

    if (formState.title && formState.year && (formState.author_id !== "-1" || formState.author_name)) {
      setErrors("");
      return true;
    } else {
      let errorFields = [];
      for (const key of requiredKeys) {
        if ((!formState[key] || formState[key] === "")) {
          errorFields.push(key);
        }
      }
      if(formState.author_id === "-1")
      {
        if(formState.author_name === ""){
          errorFields.push("new author's name")
        }
      }
      setErrors(errorFields.join(", "));
      return false;
    }
  };

  const handleChange = (e) => {
    if(e.target.name == 'author_id'){
      if(e.target.value == "-1"){
        formState.author_name = "";
      }else{
        // get author name
        const authorName = (authorsList.filter(author => {return author.id == e.target.value}))[0].name
        //set it in the edit author field
        formState.author_name = authorName;
      }
    }
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formState);

    closeModal();
  };

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
    >
      <div className="modal">
        <form>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input name="title" onChange={handleChange} value={formState.title} />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input name="year" onChange={handleChange} value={formState.year} />
          </div>
          <div className="form-group">
            <label htmlFor="author_id">Author</label>
            <select
              name="author_id"
              onChange={handleChange}
              defaultValue={formState.author_id}
            >
              <option value="-1">New Author...</option>
              {authorsList.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))
              }
            </select>
          <div className="form-group">
            <label htmlFor="author_name">{formState.author_id === "-1" ? "New Author's name": "Edit Author's name"}</label>
            <input name="author_name" value={formState.author_name} onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
          </div>
            <select
              name="status"
              onChange={handleChange}
              value={formState.status}
            >
              <option value="">Select a Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="NA">Not Available</option>
            </select>
          </div>
          {errors && <div className="error">{`Please include: ${errors}`}</div>}
          <button type="submit" className="btn" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};