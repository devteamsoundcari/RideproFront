import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./SearchParticipant.scss";
import { FaSearch } from "react-icons/fa";

const SeachParticipant = (props) => {
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
      suggestions = props.participants.filter((itm) =>
        regex.test(itm.official_id)
      );
    }
    setFilteredItems(() => ({
      suggestions,
      text: value,
    }));
  };

  return (
    <Form className="searchParticipant">
      <Form.Group>
        <Form.Label>
          {props.title} <FaSearch />
        </Form.Label>
        <Form.Control
          type="text"
          id="searchField"
          placeholder={props.placeholder}
          onChange={(e) => handleChange(e)}
          autoComplete="off"
        />
      </Form.Group>
      <div className="searchResults">
        {filteredItems.suggestions.map((item, idx) => {
          return (
            <div className="result" key={idx} onClick={() => handleClick(item)}>
              <p>
                <strong>{item.official_id}</strong> - {item.first_name}{" "}
                {item.last_name}
              </p>
            </div>
          );
        })}
      </div>
    </Form>
  );
};

export default SeachParticipant;
