import React, { Component } from 'react';
import CompanyService from '../services/CompanyService';
//import { useParams } from 'react-router-dom';

class ViewCompanyComponent extends Component {
    
    constructor(props) {
        
        super(props);
        this.state = {
            companyId: props.match.params.id, // Accessing the id parameter from the URL
            companyData: null, 
            
        };
    }

    componentDidMount(){
        this.fetchCompany();
    }
    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.fetchCompany();
        }
    }



    fetchCompany = () =>{
        CompanyService.getCompanyById(this.state.companyId)
        .then((res) => {
            // Handle the response and update the state with company data
            this.setState({ companyData: res.data });
        })
        .catch(error => {
            // Handle error if necessary
            console.error('Error fetching company:', error);
            console.log(this.companyData.description);
        });
    }

    render() {
        const { companyData } = this.state; // Destructuring companyData from state
    
        return (
            <div>
                <h1>Company Details</h1>
                {companyData ? ( // Checking if companyData exists before rendering
                    <div>
                        <p>Name: {companyData.name}</p>
                        <p>Average Score: {companyData.averageScore}</p>
                        <p>Location:</p>
                        <p>Country: {companyData.location.country}</p>
                        <p>City: {companyData.location.city}</p>
                        {/* Render other properties */}
                        <div>
                            <h2>Equipment</h2>
                            <ul>
                                {companyData.equipment.map(equipment => (
                                    <li key={equipment.id}>
                                        <p>Name: {equipment.name}</p>
                                        <p>Description: {equipment.description}</p>
                                        <p>Type: {equipment.equipmentType}</p>
                                        <p>Price: {equipment.price}</p>
                                        <p>Quantity: {equipment.quantity}</p>
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