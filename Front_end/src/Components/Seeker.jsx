import React from "react";


const Seeker = ({ records }) => {
  return (
    <div className="seeker-container">
    <h2>Available Food</h2>

      

      <div className="seeker-list">
        {records && records.length > 0 ? (
          records.map((record, index) => (
            <div className="seeker-card" key={index}>
              <h5>Food Type: {record[1]}</h5>
              <p>Amount: {record[2]}</p>
              <p>Location: {record[3]}</p>
              <p>Contact: {record[4]}</p>
              <p>Available Time: {record[5]}</p>
            </div>
          ))
        ) : (
          <p>No food records available at the moment.</p>
        )}
      </div>
      <div className="seeker-back">
        <a href="/">Back</a>
      </div>
    </div>
  );
};

export default Seeker;
