import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "./SearchParticipant.scss";

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
        <Form.Label>Buscar por identificación:</Form.Label>
        <Form.Control
          type="text"
          id="searchField"
          placeholder="Número de identificación"
          onChange={(e) => handleChange(e)}
        />
      </Form.Group>
      <div className="searchResults">
        {filteredItems.suggestions.map((item, idx) => {
          return (
            <div className="result" key={idx}>
              <p>
                {item.official_id} - {item.first_name} {item.last_name}
              </p>
              <Button
                varitant={"primary"}
                size="sm"
                onClick={() => handleClick(item)}
              >
                Add
              </Button>
            </div>
          );
        })}
      </div>
    </Form>
  );
};

export default SeachParticipant;
