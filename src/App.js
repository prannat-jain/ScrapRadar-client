import { useState, useEffect } from "react";

//const API_BASE = "http://localhost:3001";
const API_BASE = "http://3.142.251.170";

function App() {
  //item list state
  const [items, setItems] = useState([]);
  //add popup box state
  const [addPopupActive, setAddPopupActive] = useState(false);
  //add item text state
  const [newItem, setNewItem] = useState();

  //useeffect is being used to fetch data when the page FIRST loads, hence the empty array
  useEffect(() => {
    GetItems();

    console.log(items);
  }, []);

  const GetItems = () => {
    fetch(API_BASE + "/saleinventory")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.log(err));
  };

  //sell items by using state
  const sellItem = async (id) => {
    const data = await fetch(API_BASE + "/saleinventoryitem/sold/" + id, {
      method: "PUT",
    }).then((res) => res.json());

    setItems((items) =>
      items.map((item) => {
        if (item._id === data._id) {
          item.stillAvailable = data.stillAvailable;
        }

        return item;
      })
    );
  };

  //delete item listing:
  const deleteItem = async (id) => {
    const data = await fetch(API_BASE + "/saleinventoryitem/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    //filter out the item with id from db
    setItems((items) => items.filter((item) => item._id !== data._id));
  };

  const addItem = async () => {
    const data = await fetch(API_BASE + "/saleinventoryitem/new/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newItem }),
    }).then((res) => res.json());

    //add the new item(in data constant) to the list by using the spread operator
    setItems([...items, data]);
    //hide popup once added
    setAddPopupActive(false);
    //make input field empty
    setNewItem("");
  };
  return (
    <div className="App">
      <h1>Welcome to the marketplace!</h1>
      <h4>Items for Sale</h4>

      <div className="saleinventory">
        {items.map((item) => (
          <div
            className={
              "saleinventoryitem " + (item.stillAvailable ? "" : "is-sold")
            }
            key={item._id}
          >
            <div className="checkbox"></div>
            <div className="text" onClick={() => sellItem(item._id)}>
              {item.text}
            </div>

            <div className="deleteitem" onClick={() => deleteItem(item._id)}>
              x
            </div>
          </div>
        ))}
      </div>

      <div className="additem" onClick={() => setAddPopupActive(true)}>
        Add Item Listing
      </div>

      {addPopupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setAddPopupActive(false)}>
            close
          </div>
          <div className="content">
            <h3>Add Item Listing</h3>
            <input
              type="text"
              className="itemListingText"
              //set the value of the input to the state..event e is implicit and carries text
              onChange={(e) => setNewItem(e.target.value)}
              //any input text will be set to the newItem state
              value={newItem}
            />
            <div className="button" onClick={addItem}>
              Done
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
