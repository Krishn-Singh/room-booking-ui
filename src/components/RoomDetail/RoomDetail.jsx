import React, { useState, useEffect } from 'react';
import { API_ROOT } from '../../api';



const RoomDetail = () => {
  const [roomData, setRoomData] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    // Fetch room data from the API
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`${API_ROOT}room`); // Replace 'API_URL' with the actual URL of your GET API
        if (response.ok) {
          const data = await response.json();
          console.log("room", data.rooms)
          setRoomData(data.rooms);
        } else {
          console.error('Failed to fetch room data:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error occurred while fetching room data:', error);
      }
    };

    fetchRoomData();
  }, []);

  const cardWidth = {
    width: '18rem',
  };

  const handleBookNow = async (roomId) => {
    console.log(roomId)
    try {
      // Make the API request to book the room
      const response = await fetch(`${API_ROOT}booking-requests`, {
        method: 'POST',
        headers: {
          authorization: localStorage.getItem('auth'),
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          roomId,userId:localStorage.getItem('userId'), date:new Date()
        }),
      });

      if (response.ok) {
        // Booking request successful, handle the response
        const responseData = await response.json();
        console.log('Booking request successful:', responseData);
        setBookingStatus('success');
        // Perform any additional actions after successful booking
      } else {
        // Booking request failed, handle the error
        console.error('Booking request failed:', response.status, response.statusText);
        setBookingStatus('failure');
      }
    } catch (error) {
      console.error('Error occurred during booking request:', error);
      setBookingStatus('failure');
    }
  };

  return (
    <>
      {bookingStatus === 'success' && <p>Your request has been forwarded.</p>}
      {bookingStatus === 'failure' && <p>Failed to process your request. Please try again.</p>}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
        {roomData ? (
          roomData.map((room) => (
            <div className="col" key={room._id}>
              <div className="card mx-3">
                <img src={room.image} className="card-img-top" alt="image of rooms" />
                <div className="card-body">
                  <h5 className="card-title">{room.name}</h5>
                  <p className="card-text">{room.price}</p>
                  <p className="card-text">{room.status}</p>
                  <button className="btn btn-primary" onClick={() => handleBookNow(room._id)}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading room data...</p>
        )}
      </div>
    </>
  );
};

export default RoomDetail;
