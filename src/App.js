import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch('https://reqres.in/api/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data.data);
      });
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditing(true);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
  };

  const handleCreateUser = async (newUser) => {
    try {
      const response = await fetch('https://reqres.in/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers([...users, createdUser]);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdate = async (updatedUser) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updatedUsers = users.map(user => (user.id === updatedUser.id ? updatedUser : user));
        setUsers(updatedUsers);
        setSelectedUser(null);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="App">
      <h1>Users List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <img src={user.avatar} alt={`Avatar of ${user.first_name}`} className="avatar" />
              </td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
                <button onClick={() => handleViewProfile(user)}>View Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
        <div className="edit-form">
          <h2>Edit User</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedUser = {
                ...selectedUser,
                first_name: e.target.first_name.value,
                last_name: e.target.last_name.value,
                email: e.target.email.value,
              };
              handleUpdate(updatedUser);
            }}
          >
            <label>
              First Name:
              <input type="text" name="first_name" defaultValue={selectedUser.first_name} />
            </label>
            <label>
              Last Name:
              <input type="text" name="last_name" defaultValue={selectedUser.last_name} />
            </label>
            <label>
              Email:
              <input type="email" name="email" defaultValue={selectedUser.email} />
            </label>
            <button type="submit">Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </form>
        </div>
      )}
      {selectedUser && (
        <div className="profile">
          <h2>Profile</h2>
          <img src={selectedUser.avatar} alt={`Avatar of ${selectedUser.first_name}`} className="avatar" />
          <p>ID: {selectedUser.id}</p>
          <p>First Name: {selectedUser.first_name}</p>
          <p>Last Name: {selectedUser.last_name}</p>
          <p>Email: {selectedUser.email}</p>
          <button onClick={() => setSelectedUser(null)}>Close Profile</button>
        </div>
      )}
      <div className="create-user-form">
        <h2>Create New User</h2>
        <form
          onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const newUser = {
          email: formData.get('email'),
          first_name: formData.get('first_name'),
          last_name: formData.get('last_name'),
          avatar: formData.get('avatar'),
        };
        handleCreateUser(newUser);
      }}
    >
      <label>
       Email:
        <input type="email" name="email" required />
      </label>
      <label>
        First Name:
        <input type="text" name="first_name" required />
      </label>
      <label>
        Last Name:
        <input type="text" name="last_name" required />
      </label>
      <label>
        Avatar:
        <input type="file" name="avatar" accept="image/*" />
      </label>
      <button type="submit">Create User</button>
    </form>
  </div>
  </div>
  );
}

export default App;
