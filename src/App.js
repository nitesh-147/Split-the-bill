import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function toggleShowAddFriend() {
    setShowAddFriend((c) => !c);
  }

  function handleAddFriend(newFriend) {
    setFriends([...friends, newFriend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend(selectedFriend?.id === friend.id ? null : friend);
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        ></FriendList>
        {showAddFriend && (
          <FormAddFriend addFriend={handleAddFriend}></FormAddFriend>
        )}
        <Button clickHandler={toggleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          friend={selectedFriend}
          onSplitBill={handleSplitBill}
        ></FormSplitBill>
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
          key={friend.id}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}.
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${friend.balance}.
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}
      <Button clickHandler={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ clickHandler, children }) {
  return (
    <button className="button" onClick={clickHandler}>
      {children}
    </button>
  );
}

function FormAddFriend({ addFriend }) {
  const [name, setName] = useState(null);
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=933372");

  function handleFormAddFriend(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };
    addFriend(newFriend);
    // console.log(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48?u=933372");
  }

  return (
    <form action="" className="form-add-friend">
      <label>🙂Friend Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📷 Image URL: </label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button clickHandler={handleFormAddFriend}>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState(1);
  const paidByFriend = bill ? bill - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === 1 ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill">
      <h2>Split a bill with {friend.name}</h2>
      <label htmlFor="">💵Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label htmlFor="">💵Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label htmlFor="">💵{friend.name}'s Expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label htmlFor="">💵Who Paid the bill?</label>
      <select
        name=""
        id=""
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="1">You</option>
        <option value="-1">{friend.name}</option>
      </select>
      <Button clickHandler={handleSubmit}>Split Bill</Button>
    </form>
  );
}
