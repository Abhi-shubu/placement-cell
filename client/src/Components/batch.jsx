import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa"; // Import the trash and edit icons
import "./batch.css"; // Import CSS file
import Navbar from "./Navbar"; // Import the Navbar component
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BatchDetailsPage = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [batches, setBatches] = useState([]);
  const [editingBatch, setEditingBatch] = useState(null); // State to track editing batch

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await fetch(
        "https://pacementcellbackend.onrender.com/api/v1/batches"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch batches");
      }
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Get only the date part
  };

  const handleNameChange = e => {
    setName(e.target.value);
  };

  const handleStartDateChange = e => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = e => {
    setEndDate(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (editingBatch) {
      // Send data to backend API endpoint for editing
      fetch(
        `https://pacementcellbackend.onrender.com/api/v1/batches/${editingBatch._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            startDate,
            endDate,
          }),
        }
      )
        .then(response => response.json())
        .then(data => {
          console.log("Batch edited successfully:", data);
          setEditingBatch(null);
          setShowPopup(false);
          fetchBatches();
          setName("");
          setStartDate("");
          setEndDate(""); // Fetch batches again to update the table
          toast.success("Batch edited successfully");
        })
        .catch(error => {
          console.error("Error editing batch:", error);
          // Optionally, handle error
          toast.error("Failed to edit batch");
        });
    } else {
      // Send data to backend API endpoint for adding
      fetch("https://pacementcellbackend.onrender.com/api/v1/batches/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          startDate,
          endDate,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log("Batch added successfully:", data);
          setShowPopup(false);
          fetchBatches();
          // Reset form data
          setName("");
          setStartDate("");
          setEndDate("");
          toast.success("Batch added successfully");
        })
        .catch(error => {
          console.error("Error adding batch:", error);
          // Optionally, handle error
          toast.error("Failed to add batch");
        });
    }
  };

  const handleDeleteBatch = async id => {
    try {
      const response = await fetch(
        `https://pacementcellbackend.onrender.com/api/v1/batches/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete batch");
      }
      fetchBatches(); // Fetch batches again to update the table
      toast.success("Batch deleted successfully");
    } catch (error) {
      console.error("Error deleting batch:", error);
      toast.error("Failed to delete batch");
    }
  };

  const handleEditBatch = batch => {
    setEditingBatch(batch); // Set the batch to edit
    setName(batch.name);
    setStartDate(formatDate(batch.startDate));
    setEndDate(formatDate(batch.endDate));
    setShowPopup(true);
  };

  const handleCancel = () => {
    // Close the popup and reset form data
    setShowPopup(false);
    setName("");
    setStartDate("");
    setEndDate("");
    setEditingBatch(null);
  };

  return (
    <div>
      <Navbar />
      <div className="batch-details">
        <h1>Batch Details</h1>
        <div className="button-container">
          <button
            className="add-batch-button"
            onClick={() => setShowPopup(true)}
          >
            Add Batch
          </button>
        </div>
        <table id="batchs">
          <thead>
            <tr>
              <th>slno.</th>
              <th>Batch Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{batch.name}</td>
                <td>{formatDate(batch.startDate)}</td>
                <td>{formatDate(batch.endDate)}</td>
                <td>
                  <FaEdit onClick={() => handleEditBatch(batch)} />
                  &nbsp;&nbsp;
                  <FaTrash onClick={() => handleDeleteBatch(batch._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="popup-content">
                <h2>{editingBatch ? "Edit Batch" : "Add Batch"}</h2>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name">Batch Name:</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={handleNameChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={handleStartDateChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate">End Date:</label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={handleEndDateChange}
                      required
                    />
                  </div>
                  <button type="submit">
                    {editingBatch ? "Save" : "Submit"}
                  </button>
                  <button type="cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchDetailsPage;
