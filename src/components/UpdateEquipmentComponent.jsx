import React, { Component, version } from 'react';
import { withRouter } from 'react-router-dom';
import EquipmentService from '../services/EquipmentService';
import { Redirect } from 'react-router-dom';

class UpdateEquipmentComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            equipmentId: props.match.params.id,
            companyId : '',
            equipmentType: '',
            equipmentTypes: [],
            price: 0,
            quantity: 0,
            version: 0,
            user: JSON.parse(localStorage.getItem('user')) || {},
        }
        this.changeNameHandler = this.changeNameHandler.bind(this);
        this.changeDescriptionHandler = this.changeDescriptionHandler.bind(this);
        this.changeEquipmentTypeHandler = this.changeEquipmentTypeHandler.bind(this);
        this.changePriceHandler =this.changePriceHandler.bind(this);
        this.changeQuantityHandler = this.changeQuantityHandler.bind(this); 
        
        this.updateEquipment = this.updateEquipment.bind(this);

    
    }
    componentDidMount= async (e) => {
        try {
            const response = await EquipmentService.getEquipmentTypes(); // Fetch equipment types from service
            this.setState({ equipmentTypes: response.data });
        } catch (error) {
            console.error('Error fetching equipment types:', error);
        }
        EquipmentService.getEquipmentById(this.state.equipmentId).then((res) =>{
            let equipment= res.data;
            this.setState({name: equipment.name,
                description: equipment.description,
                equipmentType: equipment.equipmentType,
                price: equipment.price,
                companyId: equipment.companyId,
                quantity: equipment.quantity,  
                version: equipment.version            
    }) 
        })
    }

    changeNameHandler = (event) => {
        const value = event.target.value;
        
        // Allow any value if it's empty
        // Otherwise, ensure the value contains only letters, numbers, spaces, hyphens, and apostrophes
        // and contains at least one letter if it's not empty
        if (value === '' || (/^[a-zA-Z0-9\s'-]*$/.test(value) && /[a-zA-Z]/.test(value))) {
            this.setState({ name: value });
        }
    }
    
    changeDescriptionHandler = (event) => {
        const value = event.target.value;
    
        // Allow letters, numbers, spaces, hyphens, apostrophes, periods, commas, and exclamation marks
        // Ensure the value is not just numbers or special characters
        if (value === '' || (/^[a-zA-Z0-9\s'-]*$/.test(value) && /[a-zA-Z]/.test(value))) {
            this.setState({ name: value });
        }
    }

    changeEquipmentTypeHandler = (event) => {
        this.setState({ equipmentType: event.target.value });
    }

    changePriceHandler = (event) => {
        const value = event.target.value;

        // Allow only decimal numbers
        if (/^\d*\.?\d*$/.test(value)) {
            this.setState({ price: value });
        }
    }

    changeQuantityHandler = (event) => {
        const value = event.target.value;

        // Allow only numeric characters
        if (/^\d*$/.test(value)) {
            this.setState({ quantity: event.target.value });
        }
    }
    
    
    // updateEquipment= async(e) =>{
    //     e.preventDefault();

    //     let equipment = {name: this.state.name, description: this.state.description, id: this.state.equipmentId, equipmentType: this.state.equipmentType, 
    //         price: this.state.price, quantity: this.state.quantity};
    //     console.log('equipment =>' + JSON.stringify(equipment));

    //     try{
    //         await EquipmentService.updateEquipment(equipment.id, equipment);

    //         //this.props.history.push('/api/companies/' + this.state.equipment.companyId);
    //         this.props.history.goBack();
            
    //     }catch(error){
    //         console.error('Error creating equipment:', error);
    //     }
        
    //     //window.location.reload(); // jer nece da mi ucita komponent koji je na /api/companies putanji
    // }

    updateEquipment = async (e) => {
        e.preventDefault();
    
        let equipment = {
            name: this.state.name,
            description: this.state.description,
            id: this.state.equipmentId,
            equipmentType: this.state.equipmentType,
            price: this.state.price,
            quantity: this.state.quantity,
            version: this.state.version
        };
    
        try {
            await EquipmentService.updateEquipment(equipment.id, equipment);
            this.props.history.push(`/api/company-admin/company/${this.state.companyId}`);
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 400) {
                    // Show the error message from the backend
                    alert(data.message || 'Please ensure all fields are filled out correctly.');
                } else if (status === 409) {
                    alert('The equipment has been modified by another user. Please reload and try again.');
                    this.componentDidMount(); // Reload the equipment data
                } else if (status === 404) {
                    alert('The equipment has been deleted by another user.');
                    this.props.history.push(`/api/company-admin/company/${this.state.companyId}`);
                } else {
                    console.error('Error updating equipment:', error);
                }
            } else {
                console.error('Error updating equipment:', error);
            }
        }
    }
    
    
    

    fetchLatestEquipmentData = async () => {
        try {
            const res = await EquipmentService.getEquipmentById(this.state.equipmentId);
            let equipment = res.data;
            this.setState({
                name: equipment.name,
                description: equipment.description,
                equipmentType: equipment.equipmentType,
                price: equipment.price,
                companyId: equipment.companyId,
                quantity: equipment.quantity,
                version: equipment.version
            });
        } catch (error) {
            console.error('Error fetching updated equipment data:', error);
        }
    }
    


    render() {
        const { user, equipmentTypes} = this.state; 

        const buttonStyle = {
            margin: '10px 0 0 0', // top right bottom left
          };
           

          if ((user && user.roles && (user.roles.includes('ROLE_COMPANY_ADMIN'))))
          {
            return (
                <div className='container'>
                <div className='row'>
                    <div className='card col-md-6 offset-md-3 offset-md-3'>
                        <h3 className='text-center'>Update equipment</h3>
                        <div className='card-body'>
                            <form>
                                <div className='form-group'>
                                    <label>Equipment name: </label>
                                    <input placeholder='Name' name='name' className='form-control'
                                            value={this.state.name} onChange={this.changeNameHandler}/>                                      
                                </div>
    
                                <div>
                                    <label>Equipment description: </label>
                                    <input placeholder='Description' name='description' className='form-control'
                                            value={this.state.description} onChange={this.changeDescriptionHandler}/>
                                </div>
    
                                <div>
                                    <label>Equipment type: </label>
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-secondary dropdown-toggle"
                                            type="button"
                                            id="dropdownMenuButton"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            {this.state.equipmentType || 'Select Type'} {/* Display selected type or 'Select Type' */}
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            {equipmentTypes.map((type, index) => (
                                            <a
                                                key={index}
                                                className="dropdown-item"
                                                href="#"
                                                onClick={() => this.setState({ equipmentType: type })}
                                            >
                                                {type}
                                            </a>
                                            ))}
                                        </div>
                                    </div>
                                 </div>                   
                                <div>
                                    <label>Price:</label>
                                    <input placeholder='' name='price' className='form-control'
                                            value={this.state.price} onChange={this.changePriceHandler}/>
                                </div>
    
                                <div>
                                    <label>Quantity: </label>
                                    <input  name='quantity' className='form-control'
                                            value={this.state.quantity} onChange={this.changeQuantityHandler}/>
                                </div>
                                
                                <button className='btn btn-success' onClick={this.updateEquipment} style={buttonStyle}>Save changes</button>
                                <p>Disclamer: The change might need a few seconds to load on the company's profile page</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            );
          }
          else
          {
              return <Redirect to="/api/companies" />;
          }

          
    }
}

export default withRouter(UpdateEquipmentComponent);