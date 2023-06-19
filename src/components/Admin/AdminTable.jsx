import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../api";

const AdminTable = () => {
  const [rooms, setRooms] = useState([]);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [createRoom, setCreateRoom] = useState({
    image: "",
    name: "",
    price: "",
  });
  const [updateRoom, setUpdateRoom] = useState({
    image: "",
    name: "",
    price: "",
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const openCreateForm = () => {
    setCreateModalOpen(true);
  };

  const closeCreateForm = () => {
    setCreateModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_ROOT}room`, {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("auth"),
          "content-type": "application/json",
        },
        body: JSON.stringify(createRoom),
      });
      if (response.ok) {
        setCreateFormOpen(false); // Close the form after successful submission
        fetchRooms(); // Refresh the room list
      } else {
        console.error("Failed to create room:", response.status);
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_ROOT}room`);
      const data = await response.json();
      setRooms(data.rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchBookingRequests = async () => {
    try {
      const response = await fetch(`${API_ROOT}booking-requests`, {
        method: "GET",
        headers: {
          authorization: localStorage.getItem("auth"),
          "content-type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Booking Requests:", data.bookingRequests);
        setBookingRequests(data.bookingRequests);
      } else {
        console.error(
          "Failed to fetch booking requests:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error occurred while fetching booking requests:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openModal = () => {
    setModalOpen(true);
    fetchBookingRequests(); // Fetch booking requests when opening the modal
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleDelete = async (roomId) => {
    try {
      const response = await fetch(`${API_ROOT}room/${roomId}`, {
        method: "DELETE",
        headers: {
          authorization: localStorage.getItem("auth"),
          "content-type": "application/json",
        },
      });
      if (response.ok) {
        setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
      } else {
        console.error("Failed to delete room:", response.status);
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
    fetchRooms();
  };

  const handleEdit = async (roomId) => {
    setCreateFormOpen(false);
    try {
      const response = await fetch(`${API_ROOT}room/${roomId}`);
      if (response.ok) {
        const roomData = await response.json();
        setUpdateRoom(roomData.room); // Set the updateRoom state with fetched data
        console.log(updateRoom)
        setUpdateFormOpen(true); // Open the update form
        setEditModalOpen(true)
      } else {
        console.error("Failed to fetch room data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const handleUpdate = async (event,roomId) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_ROOT}room/${roomId}`, {
        method: "PUT",
        headers: {
          authorization: localStorage.getItem("auth"),
          "content-type": "application/json",
        },
        body: JSON.stringify(updateRoom),
      });
      if (response.ok) {
        setUpdateFormOpen(false); // Close the update form after successful update
        fetchRooms(); // Refresh the room list
      } else {
        console.error("Failed to update room:", response.status);
      }
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };
 
  const handleAccept = async (bookingRequestId,status) => {
    try {
      const response = await fetch(
        `${API_ROOT}booking-requests/${bookingRequestId}`,
        {
          method: "PUT",
          headers: {
            authorization: localStorage.getItem("auth"),
            "content-type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (response.ok) {
        // Handle the successful rejection, if needed
      } else {
        console.error("Failed to reject booking request:", response.status);
      }
    } catch (error) {
      console.error("Error rejecting booking request:", error);
    }
    fetchBookingRequests();
  }
  return (
    <div>
      {/* Create Room Form */}
      <button onClick={() => setCreateFormOpen(true)} className="btn btn-primary mx-2">Create Room</button>
      <button type="button" className="btn btn-primary" onClick={openModal}>
            View Request
          </button>

          <div
            className={`modal fade ${modalOpen ? "show" : ""}`}
            style={{ display: modalOpen ? "block" : "none" }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">View Request</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>User Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingRequests.length > 0 ? (
                      bookingRequests.map(
                        (bookingRequest) =>
                          bookingRequest.roomId != null && (
                            <tr key={bookingRequest._id}>
                              <td>{bookingRequest.roomId.name}</td>
                              <td>{bookingRequest.roomId.price}</td>
                              <td>{bookingRequest.userId.email}</td>
                              <td>
                                {bookingRequest.status === "pending" ? (
                                  <>
                                    <button onClick={() => handleAccept(bookingRequest._id,"accepted")}>Accept</button>
                                    <button onClick={() => handleAccept(bookingRequest._id,"rejected")}>Reject</button>
                                  </>
                                ) : (
                                  bookingRequest.status
                                )}
                              </td>
                            </tr>
                          )
                      )
                    ) : (
                      <tr>
                        <td colSpan="4">No booking requests found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      {createFormOpen && (
        <form onSubmit={handleSubmit}>
          {/* Form inputs for creating a room */}
          <input
            type="text"
            placeholder="Image URL"
            value={createRoom.image}
            onChange={(event) =>
              setCreateRoom({ ...createRoom, image: event.target.value })
            }
          />
          <input
            type="text"
            placeholder="Name"
            value={createRoom.name}
            onChange={(event) =>
              setCreateRoom({ ...createRoom, name: event.target.value })
            }
          />
           <input
            type="text"
            placeholder="Price"
            value={createRoom.price}
            onChange={(event) =>
              setCreateRoom({ ...createRoom, price: event.target.value })
            }
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {/* Update Room Form */}
      {updateFormOpen && (
  <form onSubmit={(event) => handleUpdate(event, updateRoom._id)}>
    {/* Form inputs for updating a room */}
    <div className="mb-3">
      <label htmlFor="image" className="form-label">Image URL:</label>
      <input
        type="text"
        className="form-control"
        id="image"
        placeholder="Image URL"
        value={updateRoom.image}
        onChange={(event) =>
          setUpdateRoom({ ...updateRoom, image: event.target.value })
        }
      />
    </div>
    <div className="mb-3">
      <label htmlFor="name" className="form-label">Name:</label>
      <input
        type="text"
        className="form-control"
        id="name"
        placeholder="Name"
        value={updateRoom.name}
        onChange={(event) =>
          setUpdateRoom({ ...updateRoom, name: event.target.value })
        }
      />
    </div>
    <div className="mb-3">
      <label htmlFor="price" className="form-label">Price:</label>
      <input
        type="text"
        className="form-control"
        id="price"
        placeholder="Price"
        value={updateRoom.price}
        onChange={(event) =>
          setUpdateRoom({ ...updateRoom, price: event.target.value })
        }
      />
    </div>
    <button type="submit" className="btn btn-primary">Update</button>
  </form>
)}

<ul className="list-group">
  {rooms.map((room) => (
    <li className="list-group-item d-flex justify-content-between align-items-center" key={room.id}>
      <div>
        <span className="me-2">{room.name} - {room.price}</span>
      </div>
      <div>
        <button className="btn btn-primary me-2" onClick={() => handleEdit(room._id)}>Edit</button>
        <button className="btn btn-danger" onClick={() => handleDelete(room._id)}>Delete</button>
      </div>
    </li>
  ))}
</ul>



    </div>
  );
};

export default AdminTable;
