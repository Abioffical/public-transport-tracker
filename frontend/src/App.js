import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  // Login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Bus Data
  const [buses, setBuses] = useState([]);

  // Add Bus
  const [busNumber, setBusNumber] = useState("");
  const [route, setRoute] = useState("");
  const [location, setLocation] = useState("");

  // Update Location
  const [editLocation, setEditLocation] = useState("");

  // Search
  const [search, setSearch] = useState("");



  // ---------------- LOAD ----------------

  const loadBuses = () => {
    axios
      .get("http://localhost:8080/api/buses")
      .then((response) => {
        setBuses(response.data);
      })
      .catch((err) => console.log(err));
  };



  // ---------------- ADD ----------------

  const addBus = () => {

    console.log({
    busNumber,
    route,
    location
  });
    axios
      .post("http://localhost:8080/api/buses", {

        busNumber,

        route,

        currentLocation: location,

        status: "Running"

      })

      .then(() => {

        alert("Bus Added Successfully!");

        loadBuses();

        setBusNumber("");

        setRoute("");

        setLocation("");

      })

      .catch((err) => {
  console.log(err);

  if (err.response) {
    console.log(err.response.data);
    console.log(err.response.status);
    alert("Backend Error: " + err.response.status);
  } else {
    alert("Cannot connect to backend");
  }
});

  };



  // ---------------- UPDATE ----------------
   const updateBus = (id) => {

  const bus = buses.find((b) => b.id === id);

  axios
    .put(`http://localhost:8080/api/buses/${id}`, {
      busNumber: bus.busNumber,
      route: bus.route,
      currentLocation: editLocation,
      status: "Running"
    })
    .then(() => {
      alert("Bus Updated Successfully!");
      setEditLocation("");
      loadBuses();
    })
    .catch((err) => {
      console.log(err);
      alert("Error Updating Bus");
    });

};



  // ---------------- DELETE ----------------

  const deleteBus = (id) => {

    axios

      .delete(`http://localhost:8080/api/buses/${id}`)

      .then(() => {

        alert("Bus Deleted!");

        loadBuses();

      })

      .catch((err) => console.log(err));

  };



  // ---------------- LOGIN ----------------

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

    setUsername("");

    setPassword("");

    setRole("");

    setIsLoggedIn(false);

  };



  // ---------------- AUTO REFRESH ----------------

  useEffect(() => {

    loadBuses();

    const interval = setInterval(loadBuses, 5000);

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

        <button onClick={login}>Login</button>

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

    <p className="live-status">
      🟢 Live Tracking Active (Auto Refresh every 5 seconds)
    </p>

    <button onClick={logout}>Logout</button>

    <p>Logged in as <b>{role}</b></p>

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
        <h2>{buses.filter(bus => bus.status === "Running").length}</h2>
      </div>

      <div className="dashboard-card delayed-card">
        <h3>Delayed</h3>
        <h2>{buses.filter(bus => bus.status === "Delayed").length}</h2>
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

          <p>🛣 Route: {bus.route}</p>

          <p>📍 Current Location: {bus.currentLocation}</p>

          <p className={bus.status === "Running" ? "running" : "delayed"}>
            {bus.status === "Running"
              ? "🟢 Running"
              : "🔴 Delayed"}
          </p>

          {role === "ADMIN" && (
            <>
              <input
                type="text"
                placeholder="New Location"
                onChange={(e) => setEditLocation(e.target.value)}
              />

              <br /><br />

              <button onClick={() => updateBus(bus.id)}>
                Update
              </button>

              <button onClick={() => deleteBus(bus.id)}>
                Delete
              </button>
            </>
          )}

          <hr />

        </div>
      ))}

  </div>
);

}



export default App;