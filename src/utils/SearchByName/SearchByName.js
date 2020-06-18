import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./SearchByName.scss";
import { FaSearch } from "react-icons/fa";

const SearchByName = (props) => {
  const [filteredItems, setFilteredItems] = useState({
    suggestions: [],
    text: "",
  });

  const handleClick = (item) => {
    document.getElementById("searchField").value = "";
    setFilteredItems({ suggestions: [], text: "" });
    props.returnedItem(item);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    let suggestions = [];
    if (value) {
      const regex = new RegExp(`^${value}`, "i"); // i to ignore case
      suggestions = props.items.filter((itm) => regex.test(itm.name));
    }
    setFilteredItems(() => ({
      suggestions,
      text: value,
    }));
  };

  return (
    <Form className="search-by-name">
      <Form.Group>
        <Form.Label>
          {props.title} <FaSearch />
        </Form.Label>
        <Form.Control
          type="text"
          id="searchField"
          placeholder={
            props.items.length > 0
              ? `Buscar pistas en ${props.city}`
              : `No tienes pistas en ${props.city}`
          }
          onChange={(e) => handleChange(e)}
          autoComplete="off"
          disabled={props.items.length > 0 ? false : true}
        />
      </Form.Group>
      <div className="searchResults">
        {filteredItems.suggestions.map((item, idx) => {
          return (
            <div className="result" key={idx} onClick={() => handleClick(item)}>
              <p>
                <strong>{item.name}</strong> - {item.municipality.name}{" "}
                {item.municipality.department.name}
              </p>
            </div>
          );
        })}
      </div>
    </Form>
  );
};

export default SearchByName;
