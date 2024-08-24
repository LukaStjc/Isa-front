import React, { Component } from 'react';
import CompanyService from '../services/CompanyService';
import EquipmentService from '../services/EquipmentService';
import TimeComponent from './TimeComponent';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
//import { useParams } from 'react-router-dom';
import MarkerIcon from '../img/marker-icon.png'
import ReservationService from '../services/ReservationService';
import { Redirect } from 'react-router-dom';


class CompanyPublicProfileComponent extends Component {
    constructor(props) {
        
        super(props);
        this.state = {
            companyId:  props.match.params.id,
            companyData: null, 
            searchText: '', // Ensure initial value is not null
            filteredEquipment: null,

            // Vasilije
            selectedReservationId: null, // zapravo selected predefined appointment  
            selectedEquipment: {},
            user: JSON.parse(localStorage.getItem('user')) || {},
        };
    }
       // Vasilije
    resetQuantity = (equipmentId) => {
        this.setState(prevState => {
            const updatedSelectedEquipment = { ...prevState.selectedEquipment };

            delete updatedSelectedEquipment[equipmentId];

            return {
                selectedEquipment: updatedSelectedEquipment
            }
        });
    }
    selectEquipment = (equipmentId) => {
        this.setState(prevState => ({
            selectedEquipment: {
                ...prevState.selectedEquipment,
                [equipmentId]: (prevState.selectedEquipment[equipmentId] || 0) + 1
            }
        }));
    }
    updateQuantity = (equipmentId, quantity) => {
        this.setState(prevState => ({
            selectedEquipment: {
                ...prevState.selectedEquipment,
                [equipmentId]: quantity
            }
        }));
    }
    createReservation = async(e) => {

        e.preventDefault()

        const { selectedReservationId, selectedEquipment } = this.state; 

        if (!selectedReservationId) {
            alert('Predefined appointment is missing.');
            return;
        }

        if (Object.keys(selectedEquipment).length === 0 )
        {
            alert('Equipment data is missing.');
            return;
        }

        // prilagodjavanje podataka
        console.log('object keys', Object.keys(selectedEquipment));

        const reservationItems = Object.keys(selectedEquipment).map(equipmentId => ({
            equipmentId: parseInt(equipmentId),
            quantity: selectedEquipment[equipmentId]
        }));

        const requestData = {
            reservationId: selectedReservationId,
            reservationItems: reservationItems
        }

        try {
            console.log(requestData)
            await ReservationService.createReservation(requestData);
            alert("You've successfully created reservation!")

            this.setState({
                selectedReservationId: null,
                selectedEquipment: {}
            });
            localStorage.setItem('selectedReservationId', null);
            localStorage.setItem('selectedEquipment', JSON.stringify({}));
            const storageData = {
                url: "",
                selectedReservationId: null, 
                selectedEquipment: {},
            };
            localStorage.setItem('lastInteraction', JSON.stringify(storageData));
            
            window.location.reload()
        } catch (error) {
            this.setState({
                selectedReservationId: null,
                selectedEquipment: {}
            });
            localStorage.setItem('selectedReservationId', null);
            localStorage.setItem('selectedEquipment', JSON.stringify({}));
            const storageData = {
                url: "",
                selectedReservationId: null, 
                selectedEquipment: {},
            };
            localStorage.setItem('lastInteraction', JSON.stringify(storageData));

            if (error.response) {
                alert('Error creating reservation: ' + error.response.data);
            } else {
                alert('Error creating reservation: ' + error.message);
            }

            window.location.reload()
        }
    }
    selectReservation = (reservationId) => { 
        this.setState({ selectedReservationId: reservationId });
    }
    makeAppointment(companyId){
        // this.props.history.push(`/api/equipment/create/${companyId}`)
    }


    componentDidMount(){
        // Postavljanje user-a iz lokalnog skladišta u stanje komponente
        // const user = JSON.parse(localStorage.getItem('user'));

        // this.setState({ user }, () => {
        //     // Prihvatanje podataka o kompaniji nakon što se user postavi u stanje
        //     this.fetchCompany();
        // })

        this.fetchCompany();
       
        this.loadDataFromLocalStorage(); //

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.fetchCompany();
        }

        if (this.state.selectedEquipment !== prevState.selectedEquipment ||
            this.state.selectedReservationId !== prevState.selectedReservationId) {
            const hasValidEquipment = Object.keys(this.state.selectedEquipment).some(
                id => this.state.selectedEquipment[id] >= 1
            );

            if (hasValidEquipment || this.state.selectedReservationId) {
                const url = window.location.href; // sa ovim cuva stanje
                // const url = window.location.pathname; 
                const storageData = {
                    url: url,
                    selectedEquipment: this.state.selectedEquipment,
                    selectedReservationId: this.state.selectedReservationId
                };
                localStorage.setItem('lastInteraction', JSON.stringify(storageData));
            }
        }
    }

    loadDataFromLocalStorage = () => {
        const lastInteraction = JSON.parse(localStorage.getItem('lastInteraction'));
        if (lastInteraction && lastInteraction.url === window.location.href) {
            this.setState({
                selectedEquipment: lastInteraction.selectedEquipment || {},
                selectedReservationId: lastInteraction.selectedReservationId
            });
        }
    }

    changePickedAdminHandler=(event) =>{
        this.setState({pickedAdmin: event.target.value});
    }


    fetchCompany = () => {
        CompanyService.getCompanyProfile(this.state.companyId)
            .then((res) => {
                // Handle the response and update the state with company data
                this.setState({ companyData: res.data });
            })
            .catch(error => {
                // Handle error if necessary
                console.error('Error fetching company:', error);
            });
    }

    handleSearch = () => {
        const { searchText, companyData } = this.state;
    
        if (companyData) {
            const filteredEquipment = companyData.equipment.filter(equipment =>
                equipment.name.toLowerCase().includes(searchText.toLowerCase())
            );
    
            this.setState({ filteredEquipment });
        }
    };
    render() {
        const { companyData, user } = this.state; // Destructuring companyData from state

        const customIcon = new L.Icon({
            iconUrl: MarkerIcon,
            iconSize: [38, 38]
        });

        if (user && user.roles && (user.roles.includes('ROLE_REGISTERED_USER') || user.roles.includes('ROLE_COMPANY_ADMIN')))
        {
            return (
                <div>
                    <h1>PUBLIC Company Details</h1>
                    {companyData ? ( // Checking if companyData exists before rendering
                        <div>
                            <p>Name: {companyData.name}</p>
                            <p>Average Score: {companyData.averageScore}</p>
                            <div>
                                <h2>Location</h2>
                                <p>Country: {companyData.location.country}</p>
                                <p>City: {companyData.location.city}</p>
                                <p>Street name: {companyData.location.street}</p>
                                <p>Street number: {companyData.location.streetNumber}</p>
                            </div>
                            <div>
                                <h2>Equipment</h2>
                                <div className='search-container'>
                                    <input
                                        type='text'
                                        placeholder='Search equipment'
                                        value={this.state.searchText}
                                        onChange={(e) => this.setState({ searchText: e.target.value })}
                                    />
                                    <button onClick={this.handleSearch} className='btn btn-primary mr-1'>Search</button>
                                </div>
                                <ul>
                                    {(this.state.filteredEquipment || companyData.equipment).map(equipment => (
                                        <li key={equipment.id}>
                                            <p>Name: {equipment.name}</p>
                                            <p>Description: {equipment.description}</p>
                                            <p>Type: {equipment.equipmentType}</p>
                                            <p>Price: {equipment.price}</p>
                                            <p>Quantity: {equipment.quantity}</p>
                                            
                                {  user && user.roles && user.roles.includes('ROLE_REGISTERED_USER') &&
                                                <React.Fragment>
                                                    <button onClick={() => this.selectEquipment(equipment.id)} className={`btn btn-primary ${this.state.selectedEquipment[equipment.id] >= 0 ? 'selectedButton' : ''} mr-1`}>Select</button>
                                                    <button onClick={() => this.resetQuantity(equipment.id)} type='button' className='btn btn-danger'>Reset</button>
                                                    {this.state.selectedEquipment[equipment.id] != null && (
                                                        <div style={{ marginTop: '8px' }}>
                                                            <input 
                                                                type="number" 
                                                                value={this.state.selectedEquipment[equipment.id]}
                                                                onChange={(e) => {
                                                                    const newValue = parseInt(e.target.value);
            
                                                                    const updatedValue = newValue < 1 ? 1 : newValue;
                                                                    
                                                                    this.updateQuantity(equipment.id, updatedValue);
                                                                }}    
                                                            />
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            }
                                        </li>
                                        ))}
                                    </ul>

                            </div>

    
                            <div>
                                <h2>Predefined appointments</h2>
                                <ul>
                                    {companyData.reservationDTOS.map(reservation => (
                                        <li key={reservation.id}>
                                            <TimeComponent date={reservation.startingTime} />
                                            <p>Duration(in minutes): {reservation.durationMinutes}</p>
                                            {/* Vasilije */}
                                            { user && user.roles && user.roles.includes('ROLE_REGISTERED_USER') &&
                                                <button 
                                                    onClick={() => this.selectReservation(reservation.id)} 
                                                    className={`btn btn-primary ${this.state.selectedReservationId === reservation.id ? 'selectedButton' : ''}`}> Select
                                                </button> 
                                            }
                                        </li>
                                    ))}
                                </ul>       
                                { user && user.roles && user.roles.includes('ROLE_REGISTERED_USER') &&
                                    <button onClick={this.createReservation} className='btn btn-primary mr-1'>Create reservation</button>
                                }    
                            </div>

                        <div>
    
                        </div>
                                <MapContainer center={[companyData.location.latitude, companyData.location.longitude]} zoom={13}>
                                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[companyData.location.latitude, companyData.location.longitude]} icon={customIcon} />
                                </MapContainer>
                        </div>
                    ) : (
                        <p>Loading company details...</p>
                    )}
                    
                </div>
            );
        } 
        else
        {
            return <Redirect to="/" />;
        }

        
    }
}

export default CompanyPublicProfileComponent;