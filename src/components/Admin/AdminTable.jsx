import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../api";

const AdminTable = () => {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    image: "",
    name: "",
    price: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_ROOT}room`, {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("auth"),
          "content-type": "application/json",
        },
        body: JSON.stringify(newRoom),
      });
      if (response.ok) {
        setShowForm(false); // Close the form after successful submission
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
      const response = await fetch("http://localhost:8001/api/v1/room");
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
    try {
      const response = await fetch(
        `http://localhost:8001/api/v1/room/${roomId}`,
        {
          method: "PUT",
          headers: {
            authorization: localStorage.getItem("auth"),
            "content-type": "application/json",
          },
        }
      );
      if (response.ok) {
        // Handle the successful edit, if needed
      } else {
        console.error("Failed to edit room:", response.status);
      }
    } catch (error) {
      console.error("Error editing room:", error);
    }
  };

  const closeFormModal = () => {
    setShowForm(false);
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
    <div className="container">
      <div className="row">
        <div className="col-12 mb-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Create Room
          </button>
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
          <div
            className={`modal fade ${showForm ? "show" : ""}`}
            style={{ display: showForm ? "block" : "none" }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Room</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeFormModal}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="imageInput" className="form-label">
                        Image:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="imageInput"
                        value={newRoom.image}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, image: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="nameInput" className="form-label">
                        Name:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nameInput"
                        value={newRoom.name}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="priceInput" className="form-label">
                        Price:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="priceInput"
                        value={newRoom.price}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, price: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeFormModal}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Room Price</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.price}</td>
                  <td>{room.status}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(room._id)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(room._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTable;
