import React, { Component } from 'react';

import CompanyAdminService from '../services/CompanyAdminService';
import CompanyService from '../services/CompanyService';

class CreateCompanyAdminComponent extends Component {

    constructor(props){
        super(props)

        this.state = {
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            companyName: '',
            companiesToShow: ''
        }

        this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this);
        this.changeLastNameHandler = this.changeLastNameHandler.bind(this);
        this.changeEmailHandler = this.changeEmailHandler.bind(this);
        this.changePasswordHandler = this.changePasswordHandler.bind(this);
        this.changeCompanyNameHandler = this.changeCompanyNameHandler.bind(this);
    }

    changeFirstNameHandler=(event) =>{
        this.setState({firstName: event.target.value});
    }

    changeLastNameHandler=(event) =>{
        this.setState({lastName: event.target.value});
    }

    changeEmailHandler=(event) =>{
        this.setState({email: event.target.value});
    }

    changePasswordHandler=(event) =>{
        this.setState({password: event.target.value});
    }

    componentDidMount(){
        this.showCompanyNames();
    }

    showCompanyNames= async() =>{
        try {
            const response = await CompanyService.getCompanyNames();
            this.setState({ companiesToShow: response.data });
        } catch (error) {
            console.error('Error fetching company names: ', error);
        }
    }

    changeCompanyNameHandler=(event) =>{
        this.setState({companyName: event.target.value});
    }

    saveCompanyAdmin= async(e) =>{
        e.preventDefault();

        if(this.state.companyName === ""){
            console.log("Warning: Company name is empty");
            return;
        }

        const response = await CompanyService.findByName(this.state.companyName)
        if(response.data === false){
            console.log("Error: The company name you tipped is wrong");
            return;
        }


        let companyAdmin = {firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, 
                            password: this.state.password, companyName: this.state.companyName};
        console.log('company admin => ' + JSON.stringify(companyAdmin));

        try{
            await CompanyAdminService.createCompanyAdmin(companyAdmin);

        }catch(error){
            console.error('Error creating company admin: ', error);
        }
        
    }


    render() {
        const buttonStyle = {
            margin: '10px 0 0 0', // top right bottom left
        };

        const labelStyle = {
            margin: '20px 0 0 0 '
        }

        return (
            <div className='container'>
                <div className='row'>
                    <div className='card col-md-6 offset-md-3 offset-md-3'>
                        <h3 className='text-center'>Register Company Administrator</h3>
                        <div className='card-body'>
                            <form>
                                
                                <label>Admin first name: </label>
                                <input placeholder='Name' className='form-control' value={this.state.firstName} 
                                    onChange={this.changeFirstNameHandler} />
                            
                                <label>Admin last name: </label>
                                <input placeholder='Last name' className='form-control' value={this.state.lastName} 
                                    onChange={this.changeLastNameHandler} />
                                
                                <label>Admin email: </label>
                                <input placeholder='Email' className='form-control' value={this.state.email} 
                                    onChange={this.changeEmailHandler} />

                                <label>Admin password: </label>
                                <input placeholder='Password' className='form-control' value={this.state.password} 
                                    onChange={this.changePasswordHandler} />

                                <label style={labelStyle} >Available companies: </label>
                                <input value={this.state.companiesToShow} className='form-control' readOnly/>

                                <label style={labelStyle} >Company where admin is working: </label>
                                <input placeholder='Company name' name='companyName' className='form-control' value={this.state.companyName}
                                    onChange={this.changeCompanyNameHandler}/>
                                
                                <button className='btn btn-success' onClick={this.saveCompanyAdmin} style={buttonStyle}>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateCompanyAdminComponent;