import React, { Component } from 'react';
import EquipmentService from '../services/EquipmentService';
import { Redirect } from 'react-router-dom';

class CreateEquipmentComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            companyId: props.match.params.id,
            equipmentType: '',
            equipmentTypes: [],
            price: '',
            quantity: '',
            user: JSON.parse(localStorage.getItem('user')) || {},
            errors: {},
        }
        this.changeNameHandler = this.changeNameHandler.bind(this);
        this.changeDescriptionHandler = this.changeDescriptionHandler.bind(this);
        this.changeEquipmentTypeHandler = this.changeEquipmentTypeHandler.bind(this);
        this.changePriceHandler = this.changePriceHandler.bind(this);
        this.changeQuantityHandler = this.changeQuantityHandler.bind(this); 
        
        this.saveEquipment = this.saveEquipment.bind(this);
    }

        componentDidMount= async (e) => {
            try {
                const response = await EquipmentService.getEquipmentTypes(); // Fetch equipment types from service
                this.setState({ equipmentTypes: response.data });
            } catch (error) {
                console.error('Error fetching equipment types:', error);
            }
        }


    validateForm() {
        let errors = {};
        let formIsValid = true;

        // Validate name
        if (!this.state.name) {
            formIsValid = false;
            errors["name"] = "Name is required";
        }

        // Validate description
        if (!this.state.description) {
            formIsValid = false;
            errors["description"] = "Description is required";
        }

        // Validate equipment type
        if (!this.state.equipmentType) {
            formIsValid = false;
            errors["equipmentType"] = "Equipment type is required";
        }

        // Validate price
        if (!this.state.price) {
            formIsValid = false;
            errors["price"] = "Price is required";
        } else if (isNaN(this.state.price) || parseFloat(this.state.price) <= 0) {
            formIsValid = false;
            errors["price"] = "Price must be a positive number";
        }

        // Validate quantity
        if (!this.state.quantity) {
            formIsValid = false;
            errors["quantity"] = "Quantity is required";
        } else if (isNaN(this.state.quantity) || parseInt(this.state.quantity) <= 0) {
            formIsValid = false;
            errors["quantity"] = "Quantity must be a positive integer";
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    saveEquipment = async (e) => {
        e.preventDefault();

        if (this.validateForm()) {
            let equipment = {
                name: this.state.name,
                description: this.state.description,
                companyId: this.state.companyId,
                equipmentType: this.state.equipmentType,
                price: parseFloat(this.state.price),
                quantity: parseInt(this.state.quantity),
            };

            try {
                await EquipmentService.createEquipment(equipment);
                this.props.history.push('/api/company-admin/company/' + this.state.companyId);
            } catch (error) {
                console.error('Error creating equipment:', error);
            }
        }
    }

    changeNameHandler = (event) => {
        const value = event.target.value;
    
        // Allow letters, numbers, spaces, hyphens, and apostrophes
        // Ensure the value is not just numbers or special characters
        if (/^[a-zA-Z0-9\s'-]*$/.test(value) && /[a-zA-Z]/.test(value)) {
            this.setState({ name: value });
        }
    }
    changeDescriptionHandler = (event) => {
        const value = event.target.value;
    
        // Allow letters, numbers, spaces, hyphens, apostrophes, periods, commas, and exclamation marks
        // Ensure the value is not just numbers or special characters
        if (/^[a-zA-Z0-9\s'.,-]*$/.test(value) && /[a-zA-Z]/.test(value)) {
            this.setState({ description: value });
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

    render() {
        const { user, errors, equipmentTypes  } = this.state;

        if (user && user.roles && user.roles.includes('ROLE_COMPANY_ADMIN')) {

            return (
                <div className='container'>
                    <div className='row'>
                        <div className='card col-md-6 offset-md-3 offset-md-3'>
                            <h3 className='text-center'>Add Equipment</h3>
                            <div className='card-body'>
                                <form>
                                    <div className='form-group'>
                                        <label>Equipment Name: </label>
                                        <input
                                            placeholder='Name'
                                            name='name'
                                            className='form-control'
                                            value={this.state.name}
                                            onChange={this.changeNameHandler}
                                        />
                                        <div className='text-danger'>{errors.name}</div>
                                    </div>

                                    <div>
                                        <label>Equipment Description: </label>
                                        <input
                                            placeholder='Description'
                                            name='description'
                                            className='form-control'
                                            value={this.state.description}
                                            onChange={this.changeDescriptionHandler}
                                        />
                                        <div className='text-danger'>{errors.description}</div>
                                    </div>

                                    <div>
                                        <label>Equipment Type: </label>
                                        <select
                                            name='equipmentType'
                                            className='form-control'
                                            value={this.state.equipmentType}
                                            onChange={this.changeEquipmentTypeHandler}
                                        >
                                            <option value=''>Select Type</option>
                                            {equipmentTypes.map((type, index) => (
                                                <option key={index} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        <div className='text-danger'>{errors.equipmentType}</div>
                                    </div>

                                    <div>
                                        <label>Price:</label>
                                        <input
                                            type='number'
                                            step='0.01'
                                            placeholder='Price'
                                            name='price'
                                            className='form-control'
                                            value={this.state.price}
                                            onChange={this.changePriceHandler}
                                        />
                                        <div className='text-danger'>{errors.price}</div>
                                    </div>

                                    <div>
                                        <label>Quantity:</label>
                                        <input
                                            type='number'
                                            placeholder='Quantity'
                                            name='quantity'
                                            className='form-control'
                                            value={this.state.quantity}
                                            onChange={this.changeQuantityHandler}
                                        />
                                        <div className='text-danger'>{errors.quantity}</div>
                                    </div>

                                    <button
                                        className='btn btn-success'
                                        onClick={this.saveEquipment}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Add
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Redirect to="/api/companies" />;
        }
    }
}

export default CreateEquipmentComponent;
