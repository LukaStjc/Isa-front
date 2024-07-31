import React, { Component } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { Client } from '@stomp/stompjs';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import authHeader from "../services/auth-header";

const customIcon = new Icon({
  iconUrl: require("../location-pin.png"),
  iconSize: [38, 38]
});

export default class BoardSystemAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      vehicleLocations: [],
      companies: [],
      hospitals: [],
      selectedCompanyName: null,
      selectedHospitalName: null,
      user: JSON.parse(localStorage.getItem('user')) || {},
    };

    this.client = new Client({
      brokerURL: "ws://localhost:8082/ws/websocket",  // Update your WebSocket URL here
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: this.onConnected,
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });
  }

  componentDidMount() {
    UserService.getSystemAdminBoard().then(
      response => {
        this.setState({ content: response.data });
      },
      error => {
        this.setState({ content: error.response?.data?.message || error.message || error.toString() });
        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );

    this.fetchCompanies();
    this.fetchHospitals();
    this.client.activate();  // Activating the STOMP Client
  }

  fetchCompanies = () => {
    fetch("http://localhost:8082/delivery/companies", {headers: authHeader()})
      .then(response => response.json())
      .then(data => this.setState({ companies: data }))
      .catch(error => console.error('Error fetching companies:', error));
  };

  fetchHospitals = () => {
    fetch("http://localhost:8082/delivery/hospitals", {headers: authHeader()})
      .then(response => response.json())
      .then(data => this.setState({ hospitals: data }))
      .catch(error => console.error('Error fetching hospitals:', error));
  };

  componentWillUnmount() {
    this.client.deactivate();  // Deactivating the STOMP Client
  }

  onConnected = () => {
    this.client.subscribe('/topic/vehicleLocation', (message) => {
      if (message.body) {
        const newLocation = JSON.parse(message.body);
        const locationWithTimestamp = {
          ...newLocation,
          timeStamp: new Date().toLocaleTimeString()
        };
        this.setState(prevState => ({
          vehicleLocations: [...prevState.vehicleLocations, locationWithTimestamp]
        }));
      }
    });
  };

  selectCompany = (event) => {
    this.setState({ selectedCompanyName: event.target.value });
  };

  selectHospital = (event) => {
    this.setState({ selectedHospitalName: event.target.value });
  };

  sendRouteRequest = () => {
    const { companies, hospitals, selectedCompanyName, selectedHospitalName } = this.state;
    const selectedCompany = companies.find(c => c.name === selectedCompanyName);
    const selectedHospital = hospitals.find(h => h.name === selectedHospitalName);

    const routeRequest = {
      startLatitude: selectedCompany.latitude,
      startLongitude: selectedCompany.longitude,
      endLatitude: selectedHospital.latitude,
      endLongitude: selectedHospital.longitude
    };

    fetch("http://localhost:8082/delivery/request-route", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        ...authHeader()
      },
      body: JSON.stringify(routeRequest)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Route requested:', data);
        this.setState({ vehicleLocations: [] });  // Optionally clear existing points on map
      })
      .catch(error => console.error('Error requesting route:', error));
  };

  resetMap = () => {
    this.setState({ vehicleLocations: [] });
  };

  render() {
    const { content, vehicleLocations, companies, hospitals, selectedCompanyName, selectedHospitalName, user } = this.state;
    
    
    if (user && user.roles && (user.roles.includes('ROLE_SYSTEM_ADMIN')))
    {
      return (
        <div class="mx-auto" className="container">
          <header className="jumbotron">
            <h3>{content}</h3>
            <div className="control-group">
            <select class="btn btn-secondary dropdown-toggle" onChange={this.selectCompany} value={selectedCompanyName}>
              <option value="">Select a Company</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
  
            <select class="btn btn-secondary dropdown-toggle" onChange={this.selectHospital} value={selectedHospitalName}>
              <option value="">Select a Hospital</option>
              {hospitals.map(hospital => (
                <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
              ))} 
            </select>
  
            <button className='btn btn-success' onClick={this.sendRouteRequest} disabled={!selectedCompanyName || !selectedHospitalName}>
              Start Route
            </button>
            <button onClick={this.resetMap} className='btn btn-danger'>Reset Map</button>
  
            
            </div>
            <div>
              {vehicleLocations.length > 0 && (
                <MapContainer center={[vehicleLocations[vehicleLocations.length - 1].latitude, vehicleLocations[vehicleLocations.length - 1].longitude]} zoom={13} style={{ height: 400, width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {vehicleLocations.map((location, index) => (
                    <Marker key={index} position={[location.latitude, location.longitude]} icon={customIcon}>
                      <Popup>Vehicle was here at {location.timeStamp}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
          </header>
        </div>
      );
    }
    
  }
}
