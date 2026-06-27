import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [buses, setBuses] = useState([]);
  const [busNumber, setBusNumber] = useState("");
  const [route, setRoute] = useState("");
  const [location, setLocation] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [search, setSearch] = useState("");

  const loadBuses = () => {
    axios
      .get("http://localhost:8080/api/buses")
      .then((response) => {
        setBuses(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addBus = () => {
    axios
      .post("http://localhost:8080/api/buses", {
        busNumber: busNumber,
        route: route,
        currentLocation: location,
        status: "Running"
      })
      .then(() => {
        alert("Bus Added!");
        loadBuses();

        setBusNumber("");
        setRoute("");
        setLocation("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteBus = (id) => {
    axios
      .delete(`http://localhost:8080/api/buses/${id}`)
      .then(() => {
        alert("Bus Deleted!");
        loadBuses();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateBus = (id) => {
    const bus = buses.find((b) => b.id === id);

    axios
      .put(`http://localhost:8080/api/buses/${id}`, {
        busNumber: bus.busNumber,
        route: bus.route,
        currentLocation: editLocation,
        status: bus.status
      })
      .then(() => {
        alert("Bus Updated!");
        loadBuses();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <h1>🚌 Public Transport Tracker</h1>
      <h2>Track buses in real time</h2>

      <input
        type="text"
        placeholder="Bus Number"
        value={busNumber}
        onChange={(e) => setBusNumber(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Route"
        value={route}
        onChange={(e) => setRoute(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Current Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <br /><br />

      <button onClick={addBus}>
        Add Bus
      </button>

      <br /><br />

      <input
        type="text"
        placeholder="Search Bus Number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br /><br />

      <button onClick={loadBuses}>
        View Buses
      </button>

      {buses
        .filter((bus) =>
          bus.busNumber.toLowerCase().includes(search.toLowerCase())
        )
        .map((bus) => (
          <div className="bus-card" key={bus.id}>
            <h3>{bus.busNumber}</h3>

            <p>Route: {bus.route}</p>

            <p>Location: {bus.currentLocation}</p>

            <p className={bus.status === "Running" ? "running" : "delayed"}>
           {bus.status === "Running"
           ? "🟢 Running"
           : "🔴 Delayed"}
           </p>


            <input
              type="text"
              placeholder="New Location"
              onChange={(e) => setEditLocation(e.target.value)}
            />

            <button onClick={() => updateBus(bus.id)}>
              Update
            </button>

            <button onClick={() => deleteBus(bus.id)}>
              Delete
            </button>
          </div>
        ))}
    </div>
  );
}

export default App;