import React, { Component } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { Client } from '@stomp/stompjs';
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

const customIcon = new Icon({
  iconUrl: require("../location-pin.png"),
  iconSize: [38, 38]
})

export default class BoardSystemAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      vehicleLocations: []
    };

    // Configure WebSocket connection
    this.client = new Client({
      brokerURL: "ws://localhost:8082/ws/websocket",  // Update your WebSocket URL here
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.onConnected();
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });
  }

  componentDidMount() {
    UserService.getSystemAdminBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content: (error.response && error.response.data && error.response.data.message) ||
            error.message || error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );

    this.client.activate();  // Activating the STOMP Client
  }

  componentWillUnmount() {
    this.client.deactivate();  // Deactivating the STOMP Client
  }

  onConnected = () => {
    // Subscribe to the topic and handle incoming messages
    this.client.subscribe('/topic/vehicleLocation', (message) => {
      if (message.body) {
        const newLocation = JSON.parse(message.body)
        const locationWithTimestamp = {
          ...newLocation, 
          timeStamp: new Date().toLocaleTimeString()
        };
        this.setState(prevState => ({
          vehicleLocations: [...prevState.vehicleLocations, locationWithTimestamp]
        }))
      }
    });
  };

  render() {
    const { content, vehicleLocations } = this.state;
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{content}</h3>
          {vehicleLocations.length > 0 && (
            <MapContainer center={[vehicleLocations[vehicleLocations.length - 1].latitude, vehicleLocations[vehicleLocations.length - 1].longitude]} zoom={13} style={{ height: 400, width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {vehicleLocations.map((location, index) => (
                <Marker key={index} position={[location.latitude, location.longitude]} icon={customIcon}>
                  <Popup>Vehicle was here at {location.timeStamp}</Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </header>
      </div>
    );
  }
}
