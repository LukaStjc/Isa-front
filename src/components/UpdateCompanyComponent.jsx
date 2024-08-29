import React, { Component, useState } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import CompanyService from '../services/CompanyService';


class UpdateCompanyComponent extends Component {
    

    constructor(props){
        super(props)

        this.state = {
            companyId: props.match.params.id, // Accessing the id parameter from the URL
            name: '',
            description: '',
            country: '',
            city: '',
            streetName: '',
            streetNumber: '',
          
            user: JSON.parse(localStorage.getItem('user')) || {},
        }

        this.changeNameHandler = this.changeNameHandler.bind(this);
        this.changeDescriptionHandler = this.changeDescriptionHandler.bind(this);
        this.changeCountryHandler = this.changeCountryHandler.bind(this);
        this.changeCitynHandler = this.changeCitynHandler.bind(this);
        this.changeStreetNameHandler = this.changeStreetNameHandler.bind(this);
        this.changeStreetNumberHandler = this.changeStreetNumberHandler.bind(this);
      
        this.updateCompany  = this.updateCompany.bind(this);
    }
    componentDidMount(){
        CompanyService.getCompanyById(this.state.companyId).then((res) =>{
            let company= res.data;
            this.setState({name: company.name,
                description: company.description,
                country: company.location.country,
                city: company.location.city,
                streetName: company.location.street,
                streetNumber: company.location.streetNumber,
              
    }) 
        })
    }

    changeNameHandler=(event) =>{
        this.setState({name: event.target.value});
    }

    changeDescriptionHandler=(event) =>{
        this.setState({description: event.target.value});
    }

    changeCountryHandler=(event) =>{
        this.setState({country: event.target.value});
    }

    changeCitynHandler=(event) =>{
        this.setState({city: event.target.value});
    }

    changeStreetNameHandler=(event) =>{
        this.setState({streetName: event.target.value});
    }

    changeStreetNumberHandler=(event) =>{
        this.setState({streetNumber: event.target.value});
    }


    updateCompany= async(e) =>{
        e.preventDefault();

        let company = {name: this.state.name, description: this.state.description, country: this.state.country, 
                       city: this.state.city, streetName: this.state.streetName, streetNumber: this.state.streetNumber};
        console.log('company =>' + JSON.stringify(company));
        CompanyService.updateCompany(this.state.companyId, company).then((res) =>{
            this.props.history.push('/companies');
        });
       
        
        
        //window.location.reload(); // jer nece da mi ucita komponent koji je na /api/companies putanji
    }

    render() {
        const { user } = this.state; // Destructuring companyData from state

        const buttonStyle = {
            margin: '10px 0 0 0', // top right bottom left
          };

        if ( user && user.roles && user.roles.includes('ROLE_COMPANY_ADMIN'))
        {
            return (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <div className='container'>
                        <div className='row'>
                            <div className='card col-md-6 offset-md-3 offset-md-3'>
                                <h3 className='text-center'>Update Company</h3>
                                <div className='card-body'>
                                    <form>
                                        <div className='form-group'>
                                            <label>Company name: </label>
                                            <input placeholder='Name' name='name' className='form-control'
                                                    value={this.state.name} onChange={this.changeNameHandler}/>                                      
                                        </div>

                                        <div>
                                            <label>Company description: </label>
                                            <input placeholder='Description' name='description' className='form-control'
                                                    value={this.state.description} onChange={this.changeDescriptionHandler}/>
                                        </div>

                                        <div>
                                            <label>Country the company is in: </label>
                                            <input placeholder='Country' name='country' className='form-control'
                                                    value={this.state.country} onChange={this.changeCountryHandler}/>
                                        </div>

                                        <div>
                                            <label>City the company is in: </label>
                                            <input placeholder='City' name='city' className='form-control'
                                                    value={this.state.city} onChange={this.changeCitynHandler}/>
                                        </div>

                                        <div>
                                            <label>Name of the street the company located on: </label>
                                            <input placeholder='Name' name='description' className='form-control'
                                                    value={this.state.streetName} onChange={this.changeStreetNameHandler}/>
                                        </div>

                                        <div>
                                            <label>Street number : </label>
                                            <input placeholder='Number' name='description' className='form-control'
                                                    value={this.state.streetNumber} onChange={this.changeStreetNumberHandler}/>
                                        </div>

                                    
                                            
                                        
                                    
                                    {/*<button className='btn btn-success' onClick={this.changeCitynHandler.bind(this)} style={{marginLeft: "10px"}}>
                                            Cancel
                                        </button>*/}

                                        <button className='btn btn-success' onClick={this.updateCompany} style={buttonStyle}>Update</button>
                
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </LocalizationProvider>
            );
        } 
        else
        {
            return (

                <div className='container'>
                <h3 className='text-center'>You are not eligible to view this page.</h3>
            </div>
            );
        }
    }
}

export default UpdateCompanyComponent;