import React, { Component } from 'react';
import CompanyService from '../services/CompanyService';
import EquipmentService from '../services/EquipmentService';
import TimeComponent from './TimeComponent';

//import { useParams } from 'react-router-dom';



class ViewCompanyComponent extends Component {
    
    constructor(props) {
        
        super(props);
        this.state = {
            companyId: props.match.params.id, // Accessing the id parameter from the URL
            companyData: null, 
            pickedAdmin: '',
            searchText: '', // Ensure initial value is not null
            filteredEquipment: null

        };
        this.updateCompany = this.updateCompany.bind(this);
        this.addEquipment = this.addEquipment.bind(this);
    }
    updateCompany(id){
        this.props.history.push(`/api/companies/update/${id}`)
    }
    addEquipment(companyId){
        this.props.history.push(`/api/equipment/create/${companyId}`)
    }
    editEquipment(equipmentId){
        this.props.history.push(`/api/equipment/update/${equipmentId}`)
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

    componentDidMount(){
        this.fetchCompany();
    }
    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.fetchCompany();
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
        const { companyData } = this.state; // Destructuring companyData from state
    
        return (
            <div>
                <h1>Company Details</h1>
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
                                <button onClick={this.handleSearch}>Search</button>
                            </div>
                            <ul>
                                {(this.state.filteredEquipment || companyData.equipment).map(equipment => (
                                    <li key={equipment.id}>
                                        <p>Name: {equipment.name}</p>
                                        <p>Description: {equipment.description}</p>
                                        <p>Type: {equipment.equipmentType}</p>
                                        <p>Price: {equipment.price}</p>
                                        <p>Quantity: {equipment.quantity}</p>
                                        <button onClick={() => this.editEquipment(equipment.id)} className='btn-btn-info'>Edit</button>  
                                        <button onClick={() => this.removeEquipment(equipment.id)} className='btn-btn-info'>Remove</button>                      
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => this.addEquipment(this.state.companyId)} className='btn-btn-info'>Add new equipment</button>

                        </div>
                        <div>
                        <h2>Admins</h2>
                            <ul>
                                {companyData.admins.map(admin => (
                                    <li key={admin.id}>
                                        <p>First name: {admin.firstName}</p>
                                        <p>Last name: {admin.lastName}</p>
                                        <p>E-mail: {admin.email}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button onClick={() => this.updateCompany(this.state.companyId)} className='btn-btn-info'>EDIT</button>

                        <div>
                            <h2>Predefined appointments</h2>
                            <ul>
                                {companyData.reservationDTOS.map(reservation => (
                                    <li key={reservation.id}>
                                        <TimeComponent date={reservation.startingTime} />
                                        <p>Duration(in minutes): {reservation.durationMinutes}</p>
                                    </li>
                                ))}
                            </ul>       

                        </div>
                    </div>
                ) : (
                    <p>Loading company details...</p>
                )}
            </div>
        );
    }
}

export default ViewCompanyComponent;