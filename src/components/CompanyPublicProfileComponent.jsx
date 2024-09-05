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
            step: 1,
        };
    }

    nextStep = () => {
        this.setState(prevState => ({
            step: prevState.step + 1
        }));
    }

    
    prevStep = () => {
        this.setState(prevState => ({
            step: prevState.step - 1
        }));
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
      
        this.fetchCompany();
       
        this.loadDataFromLocalStorage(); //

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.fetchCompany();
            this.loadDataFromLocalStorage();
        }
        this.updateLocalStorage();
    }

    updateLocalStorage = () => {
        const { selectedEquipment, selectedReservationId } = this.state;
        const storageData = {
            selectedEquipment,
            selectedReservationId
        };
        localStorage.setItem(`company_${this.state.companyId}`, JSON.stringify(storageData));
    };

    loadDataFromLocalStorage = () => {
        const data = localStorage.getItem(`company_${this.props.match.params.id}`);
        if (data) {
            const { selectedEquipment, selectedReservationId } = JSON.parse(data);
            this.setState({ selectedEquipment, selectedReservationId });
        }
    };

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

    calculateTotal = () => {
        const { selectedEquipment, companyData, user } = this.state;
        let total = 0;
        if (companyData && companyData.equipment) {
            companyData.equipment.forEach(item => {
                if (selectedEquipment[item.id]) {
                    total += item.price * selectedEquipment[item.id];
                }
            });
        }
        // Check if a discount rate is available and apply it
        const discountRate = user.discount_rate || 0;
        const discountedTotal = total - (total * discountRate / 100);
    
        return discountedTotal.toFixed(2); // Format to 2 decimal places
    }
    

    calculateTotalBeforeDiscount = () => {
        const { selectedEquipment, companyData } = this.state;
        let total = 0;
        if (companyData && companyData.equipment) {
            companyData.equipment.forEach(item => {
                if (selectedEquipment[item.id]) {
                    total += item.price * selectedEquipment[item.id];
                }
            });
        }
        return total.toFixed(2); // Format to 2 decimal places
    }

    createCustomAppoinment = () => {
        this.props.history.push(`/customAppointment/${this.state.companyId}`);
    }
    


    render() {
        const { companyData, user, step } = this.state; // Destructuring companyData from state

        const customIcon = new L.Icon({
            iconUrl: MarkerIcon,
            iconSize: [38, 38]
        });

            return (
                <div className='mainContainer'>
                    {companyData ? ( // Checking if companyData exists before rendering
                        <div>

                            
                            <div className="headerContainer"> 
                                <div className="leftColumn">
                                <h1>{companyData.name}</h1>
                                <p>Average Score: {companyData.averageScore}</p>
                                <h4>Location</h4>
                                <p>Country: {companyData.location.country}</p>
                                <p>City: {companyData.location.city}</p>
                                <p>Street name: {companyData.location.street}</p>
                                <p>Street number: {companyData.location.streetNumber}</p>
                                </div>
                                
                                <div className="rightColumn">
                                    <MapContainer center={[companyData.location.latitude, companyData.location.longitude]} zoom={13}>
                                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[companyData.location.latitude, companyData.location.longitude]} icon={customIcon} />
                                    </MapContainer>
                                </div>
                            </div>
                            
                            { step === 1 && (
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

                                {/* <div className="equipmentContainer">
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
                                </div> */}
                                
                                <div className="equipmentContainer">
                                    {(this.state.filteredEquipment || companyData.equipment).map(equipment => (
                                        <div key={equipment.id} className="equipmentCard">
                                            <h3>{equipment.name}</h3>
                                            <p>Type: {equipment.equipmentType}</p>
                                            <p>Price: ${equipment.price}</p>
                                            <p>Quantity: {equipment.quantity}</p>
                                            <div className="inputContainer">
                                                {this.state.selectedEquipment[equipment.id] != null && (
                                                <input  
                                                    min="1" // Ensures the minimum value the user can enter is 1
                                                    max={equipment.quantity} // Ensures the maximum value cannot exceed available stock
                                                    type="number"
                                                    value={this.state.selectedEquipment[equipment.id]}
                                                    onChange={(e) => this.updateQuantity(equipment.id, parseInt(e.target.value))}
                                                    style={{width: 50}}
                                                />
                                                )}
                                            </div>
                                            {user && user.roles && user.roles.includes('ROLE_REGISTERED_USER') && (
                                                <>
                                                    <button style={{marginRight: 10, marginTop: 10}} onClick={() => this.selectEquipment(equipment.id)} 
                                                            className={`btn btn-primary btn-sm ${this.state.selectedEquipment[equipment.id] >= 0 ? 'selectedButton' : ''}`}>
                                                        Select
                                                    </button>
                                                    <button style={{marginRight: 10, marginTop: 10}} onClick={() => this.resetQuantity(equipment.id)} 
                                                            className="btn btn-danger btn-sm">
                                                        Reset
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                
                                {  user && user.roles && user.roles.includes('ROLE_REGISTERED_USER') &&
                                    <button style={{marginTop: 30}} onClick={this.nextStep} className="btn btn-primary btn-lg">Next</button>
                                }
                            </div>
                            )}


                            { step === 2 && (
                                <div>
                                    { user && user.roles && user.roles.includes('ROLE_REGISTERED_USER') &&
            
                                        <div>
                                            <h2 style={{marginBottom: 30}}>Predefined appointments</h2>
                                            <div className="appointmentsContainer">  
                                                {companyData.reservationDTOS.map(reservation => (
                                                    <div key={reservation.id} className="appointmentsCard">
                                                        <ul>
                                                                <div >
                                                                    <TimeComponent date={reservation.startingTime} />
                                                                    <p>Duration(in minutes): {reservation.durationMinutes}</p>
                                                                    {/* Vasilije */}
                                                                    { user && user.roles && user.roles.includes('ROLE_REGISTERED_USER') &&
                                                                        <button style={{marginTop: 10}} 
                                                                            onClick={() => this.selectReservation(reservation.id)} 
                                                                            className={`btn btn-primary btn-sm ${this.state.selectedReservationId === reservation.id ? 'selectedButton' : ''}`}> Select
                                                                        </button> 
                                                                    }
                                                                </div>
                                                        </ul>                               
                                                    </div>
                                                ))}

                                            </div>
                                            <h5 style={{marginTop: 30}}>Before discount: ${this.calculateTotalBeforeDiscount()}</h5>
                                            <h5>After discount: ${this.calculateTotal()}</h5>
                                            <button style={{marginRight: 10, marginTop: 20}} onClick={this.prevStep} className="btn btn-secondary btn-lg">Back</button>
                                            <button style={{marginRight: 10, marginTop: 20}} onClick={this.createReservation} className="btn btn-primary btn-lg">Create Reservation</button>
                                            <button style={{marginRight: 10, marginTop: 20}} onClick={this.createCustomAppoinment} className="btn btn-primary btn-lg">Custom Appointment</button>
                                            
                                        </div>
                                    }  
                                </div>
                            )}
                            

                              

                        </div>
    
                        
                    ) : (
                        <p>Loading company details...</p>
                    )}
                    
                </div>
            );


        
    }
}

export default CompanyPublicProfileComponent;