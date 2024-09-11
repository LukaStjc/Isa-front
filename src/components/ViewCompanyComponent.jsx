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

class ViewCompanyComponent extends Component {
    
    constructor(props) {
        
        super(props);
        this.state = {
            companyId: props.match.params.id, // Accessing the id parameter from the URL
            companyData: null, 
            pickedAdmin: '',
            searchText: '', // Ensure initial value is not null
            filteredEquipment: null,

            // Vasilije
            selectedReservationId: null, // zapravo selected predefined appointment  
            selectedEquipment: {},
            user: JSON.parse(localStorage.getItem('user')) || {},
        };
        this.updateCompany = this.updateCompany.bind(this);
        this.addEquipment = this.addEquipment.bind(this);
    }

    // componentDidUpdate(prevProps, prevState) {
    //     // If the route changes, fetch the company data
    //     if (this.props.match.params.id !== prevProps.match.params.id) {
    //         this.fetchCompany();
    //     }

    //     // If the equipment data is updated, refetch the company data to get the latest state
    //     if (this.state.companyData !== prevState.companyData) {
    //         this.fetchCompany();
     //   }
   // }
    

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
    updateCompany(id){
        this.props.history.push(`/api/companies/update/${id}`)
    }
    addEquipment(companyId){
        this.props.history.push(`/api/equipment/create/${companyId}`)
    }
    editEquipment(equipmentId) {
        EquipmentService.getEquipmentById(equipmentId)
            .then(res => {
                const equipment = res.data;
                const currentVersion = equipment.version;
    
                const newVersion = this.state.companyData.equipment.find(e => e.id === equipmentId).version;
    
                if (currentVersion !== newVersion) {
                    alert('The equipment data has changed. Please reload and try again.');
                    window.location.reload();
                } else {
                    this.props.history.push(`/api/equipment/update/${equipmentId}`);
                }
            })
            .catch(error => {
                console.error('Error fetching equipment:', error);
                alert('There was an error fetching equipment details.');
            });
    }
    
    showCalendar(){
        this.props.history.push(`/api/company-admins/company-working-days`)
        
    }
    removeEquipment(equipmentId){
        EquipmentService.deleteEquipment(equipmentId).then(() => {
            // Filter out the deleted equipment from the state
            const updatedEquipment = this.state.companyData.equipment.filter(
                (equipment) => equipment.id !== equipmentId
            );

            // Update the state with the updated equipment list
            this.setState((prevState) => ({
                companyData: {
                    ...prevState.companyData,
                    equipment: updatedEquipment,
                },
            }));
        })
        .catch((error) => {
            console.error('Error deleting equipment:', error);
        });

    }
    createPredefinedReservation(companyId){
        this.props.history.push(`/api/companies/${companyId}/create-reservation`)
    }
    showActiveContracts(){
        this.props.history.push(`/api/contracts/active`)
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
        CompanyService.getCompanyById(this.state.companyId)
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
    
        return (
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <h4>Actions</h4>
                                <button onClick={() => this.showActiveContracts(this.state.companyId)} className='btn btn-primary btn-block'>Active Contracts</button>
                                {user && user.roles && user.roles.includes('ROLE_COMPANY_ADMIN') && (
                                    <div>
                                        <button onClick={() => this.addEquipment(this.state.companyId)} className='btn btn-secondary btn-block'>Add Equipment</button>
                                        <button onClick={() => this.updateCompany(this.state.companyId)} className='btn btn-secondary btn-block'>Edit Company</button>
                                        <button onClick={() => this.createPredefinedReservation(this.state.companyId)} className='btn btn-secondary btn-block'>Add Appointment</button>
                                        <button onClick={() => this.showCalendar(this.state.companyId)} className='btn btn-secondary btn-block mt-2'>Show Calendar</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
    
                    {/* Main Content */}
                    <div className="col-md-9">
                        <h1>Company Details</h1>
                        {companyData ? (
                            <div>
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <h2>General Info</h2>
                                        <p><strong>Name:</strong> {companyData.name}</p>
                                        <p><strong>Average Score:</strong> {companyData.averageScore}</p>
                                        <h4>Location</h4>
                                        <p><strong>Country:</strong> {companyData.location.country}</p>
                                        <p><strong>City:</strong> {companyData.location.city}</p>
                                        <p><strong>Street:</strong> {companyData.location.street} {companyData.location.streetNumber}</p>
                                    </div>
                                </div>
    
                                {/* Equipment Section */}
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <h2>Equipment</h2>
                                        <div className="search-container mb-3">
                                            <input
                                                type='text'
                                                placeholder='Search equipment'
                                                value={this.state.searchText}
                                                onChange={(e) => this.setState({ searchText: e.target.value })}
                                                className="form-control"
                                            />
                                            <button onClick={this.handleSearch} className='btn btn-primary mt-2'>Search</button>
                                        </div>
                                        <div className="row">
                                            {(this.state.filteredEquipment || companyData.equipment).map(equipment => (
                                                <div key={equipment.id} className="col-md-4">
                                                    <div className="card mb-3">
                                                        <div className="card-body">
                                                            <p><strong>Name:</strong> {equipment.name}</p>
                                                            <p><strong>Description:</strong> {equipment.description}</p>
                                                            <p><strong>Type:</strong> {equipment.equipmentType}</p>
                                                            <p><strong>Price:</strong> {equipment.price}</p>
                                                            <p><strong>Quantity:</strong> {equipment.quantity}</p>
                                                            {user && user.roles.includes('ROLE_COMPANY_ADMIN') && (
                                                                <>
                                                                    <button onClick={() => this.editEquipment(equipment.id)} className='btn btn-secondary'>Edit</button>
                                                                    <button onClick={() => this.removeEquipment(equipment.id)} className='btn btn-danger ml-2'>Remove</button>
                                                                </>
                                                            )}
                                                            {user && user.roles.includes('ROLE_REGISTERED_USER') && (
                                                                <>
                                                                    <button onClick={() => this.selectEquipment(equipment.id)} className={`btn btn-primary ${this.state.selectedEquipment[equipment.id] >= 0 ? 'selectedButton' : ''}`}>Select</button>
                                                                    <button onClick={() => this.resetQuantity(equipment.id)} className='btn btn-danger ml-2'>Reset</button>
                                                                    {this.state.selectedEquipment[equipment.id] != null && (
                                                                        <input type="number" className="form-control mt-2" value={this.state.selectedEquipment[equipment.id]} onChange={(e) => {
                                                                            const newValue = parseInt(e.target.value);
                                                                            const updatedValue = newValue < 1 ? 1 : newValue;
                                                                            this.updateQuantity(equipment.id, updatedValue);
                                                                        }} />
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
    
                                {/* Admins Section - Display as cards */}
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <h2>Admins</h2>
                                        <div className="row">
                                            {companyData.admins.map(admin => (
                                                <div key={admin.id} className="col-md-4">
                                                    <div className="card mb-3">
                                                        <div className="card-body">
                                                            <p><strong>First Name:</strong> {admin.firstName}</p>
                                                            <p><strong>Last Name:</strong> {admin.lastName}</p>
                                                            <p><strong>Email:</strong> {admin.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
    
                                {/* Predefined Appointments - Display as cards */}
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <h2>Predefined Appointments</h2>
                                        <div className="row">
                                            {companyData.reservationDTOS.map(reservation => (
                                                <div key={reservation.id} className="col-md-4">
                                                    <div className="card mb-3">
                                                        <div className="card-body">
                                                            <TimeComponent date={reservation.startingTime} />
                                                            <p><strong>Duration:</strong> {reservation.durationMinutes} minutes</p>
                                                            {user && user.roles.includes('ROLE_REGISTERED_USER') && (
                                                                <button 
                                                                    onClick={() => this.selectReservation(reservation.id)} 
                                                                    className={`btn btn-primary ${this.state.selectedReservationId === reservation.id ? 'selectedButton' : ''}`}>
                                                                    Select
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {user && user.roles.includes('ROLE_REGISTERED_USER') && (
                                            <button onClick={this.createReservation} className='btn btn-primary'>Create Reservation</button>
                                        )}
                                    </div>
                                </div>
    
                                {/* Map */}
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <h2>Location Map</h2>
                                        <MapContainer center={[companyData.location.latitude, companyData.location.longitude]} zoom={13}>
                                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker position={[companyData.location.latitude, companyData.location.longitude]} icon={customIcon} />
                                        </MapContainer>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>Loading company details...</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    
}    

export default ViewCompanyComponent;