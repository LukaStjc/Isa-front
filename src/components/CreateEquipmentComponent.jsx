import React, { Component } from 'react';
import EquipmentService from '../services/EquipmentService';

class CreateEquipmentComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            companyId: props.match.params.id,
            equipmentType: '',
            price: 0,
            quantity: 0,
        }
        this.changeNameHandler = this.changeNameHandler.bind(this);
        this.changeDescriptionHandler = this.changeDescriptionHandler.bind(this);
        this.changeEquipmentTypeHandler = this.changeEquipmentTypeHandler.bind(this);
        this.changePriceHandler =this.changePriceHandler.bind(this);
        this.changeQuantityHandler = this.changeQuantityHandler.bind(this); 
        
        this.saveEquipment = this.saveEquipment.bind(this);
    }
    changeNameHandler=(event) =>{
        this.setState({name: event.target.value});
    }
    changeDescriptionHandler=(event) =>{
        this.setState({description: event.target.value});
    }
    changeEquipmentTypeHandler=(event) =>{
        this.setState({equipmentType: event.target.value});
    }
    changePriceHandler=(event) =>{
        this.setState({price: event.target.value});
    }
    changeQuantityHandler=(event) =>{
        this.setState({quantity: event.target.value});
    }
    
    
    saveEquipment= async(e) =>{
        e.preventDefault();

        
        let equipment = {name: this.state.name, description: this.state.description, companyId: this.state.companyId, equipmentType: this.state.equipmentType, 
            price: this.state.price, quantity: this.state.quantity};
        console.log('equipment =>' + JSON.stringify(equipment));

        try{
            await EquipmentService.createEquipment(equipment);

            this.props.history.push('/api/companies/' + this.state.companyId);
        }catch(error){
            console.error('Error creating equipment:', error);
        }
        
        //window.location.reload(); // jer nece da mi ucita komponent koji je na /api/companies putanji
    }


    componentDidMount() {

    }


    render() {
        const buttonStyle = {
            margin: '10px 0 0 0', // top right bottom left
          };
          const equipmentTypes = ['type 1', 'type 2', 'type 3']
        return (
            <div className='container'>
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    <h3 className='text-center'>Add equipment</h3>
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
                                <input placeholder='Name' name='quantity' className='form-control'
                                        value={this.state.quantity} onChange={this.changeQuantityHandler}/>
                            </div>
                            
                            <button className='btn btn-success' onClick={this.saveEquipment} style={buttonStyle}>Add</button>
                        
                        </form>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default CreateEquipmentComponent;