import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [buses, setBuses] = useState([]);
  const [busNumber, setBusNumber] = useState("");
  const [route, setRoute] = useState("");
  const [location, setLocation] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const loadBuses = () => {
    axios
      .get("http://localhost:8080/api/buses")
      .then((response) => {
        setBuses(response.data);
        setLastUpdated(new Date().toLocaleTimeString());
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
  const login = () => {

  if (username === "admin" && password === "admin123") {
    setRole("ADMIN");
    setIsLoggedIn(true);
    return;
  }

  if (username === "user" && password === "user123") {
    setRole("USER");
    setIsLoggedIn(true);
    return;
  }

  alert("Invalid Username or Password");

};

  const logout = () => {
  setIsLoggedIn(false);
  setRole("");
  setUsername("");
  setPassword("");
};
  useEffect(() => {
  loadBuses();

  const interval = setInterval(() => {
    loadBuses();
  }, 5000);

  return () => clearInterval(interval);
}, []);
  if (!isLoggedIn) {
  return (
    <div className="login-container">
    <div className="login-card">

      <h1>🚌 Public Transport Tracker</h1>

      <h2>Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>
        Login
      </button>

      <br /><br />

      <div className="demo">
    <h3>Demo Accounts</h3>

    <p><b>Admin</b> : admin / admin123</p>

    <p><b>User</b> : user / user123</p>
     </div>
     </div>
    </div>
  );
}
  return (
    <div className="App">
      <h1>🚌 Real-Time Public Transport Tracking for Small Cities</h1>
      <h3>Tracking Buses for Small Cities</h3>
      <h2>Track buses in real time</h2>
      <p className="live-status">
  🟢 Live Tracking Active (Auto Refresh every 5 seconds)
      </p>
      <div style={{ marginBottom: "20px" }}>
  <button onClick={logout}>
    Logout
  </button>

  <p>
    Logged in as: <b>{role}</b>
  </p>
</div>

      {role === "ADMIN" && (
<>
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
</>
)}

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

      <br /><br />

 <div className="dashboard">
  <div className="dashboard-card total-card">
    <h3>Total Buses</h3>
    <h2>{buses.length}</h2>
  </div>

  <div className="dashboard-card running-card">
    <h3>Running</h3>
    <h2>
      {buses.filter((bus) => bus.status === "Running").length}
    </h2>
  </div>

  <div className="dashboard-card delayed-card">
    <h3>Delayed</h3>
    <h2>
      {buses.filter((bus) => bus.status === "Delayed").length}
    </h2>
  </div>
</div>
<br />

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
           <p className="last-updated">
  🕒 Last Updated: {lastUpdated}
</p>

{role === "ADMIN" && (
  <>
    <input
      type="text"
      placeholder="New Location"
      onChange={(e) => setEditLocation(e.target.value)}
    />

    <div className="button-group">
      <button
        className="update-btn"
        onClick={() => updateBus(bus.id)}
      >
        ✏️ Update
      </button>

      <button
        className="delete-btn"
        onClick={() => deleteBus(bus.id)}
      >
        🗑️ Delete
      </button>
    </div>
  </>
)}

     </div>
             ))}
    </div>
  );
}

export default App;
