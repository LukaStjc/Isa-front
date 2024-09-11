import React, { Component } from 'react';
import ContractService from '../services/ContractService'; 
import CompanyAdminService from '../services/CompanyAdminService'; // Import the service to get company by admin ID

class CompanyContractsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contracts: [], // Initialize contracts state
            companyId: null, // Initialize companyId
            loading: true, // Loading state to show a loading spinner or message
        };
    }

    // Fetch the companyId and contracts when the component is mounted
    componentDidMount() {
        this.loadCompanyAndContracts();
    }

    // Function to cancel delivery and reload contracts
    cancelDelivery = (contractId) => {
        ContractService.cancelDelivery(contractId)
            .then(() => {
                // After successful cancellation, reload active contracts
                this.loadActiveContracts();
            })
            .catch((error) => {
                console.error('Error canceling delivery:', error);
            });
    }

    // Function to get the adminId from local storage and fetch the companyId
    loadCompanyAndContracts = () => {
        // Get the adminId from local storage (assuming it's stored with key 'user')
        const adminId = JSON.parse(localStorage.getItem('user')).id;

        // Fetch the companyId by adminId
        CompanyAdminService.getCompanyIdBy(adminId)
            .then((response) => {
                const companyId = response.data; // Assume response contains the company ID
                this.setState({ companyId }, this.loadActiveContracts); // Set companyId and then fetch contracts
            })
            .catch((error) => {
                console.error('Error fetching company ID:', error);
                this.setState({ loading: false });
            });
    };

    // Function to fetch active contracts based on the companyId
    loadActiveContracts = () => {
        const { companyId } = this.state;

        // Fetch contracts only if companyId is set
        if (companyId) {
            ContractService.findAllActive(companyId)
                .then((response) => {
                    this.setState({
                        contracts: response.data,
                        loading: false,
                    });
                })
                .catch((error) => {
                    console.error('Error fetching contracts:', error);
                    this.setState({ loading: false });
                });
        }
    };

    render() {
        const { contracts, loading } = this.state;

        return (
            <div className="container">
                <h1>Active Contracts</h1>
                {loading ? (
                    <p>Loading active contracts...</p>
                ) : contracts.length === 0 ? (
                    <p>No active contracts found.</p>
                ) : (
                    <div className="row">
                        {contracts.map((contract) => (
                            <div key={contract.id} className="col-md-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Contract #{contract.id}</h5>
                                        <p className="card-text"><strong>Hospital:</strong> {contract.hospitalName}</p>
                                        <p className="card-text"><strong>Equipment:</strong> {contract.equipment.name}</p>
                                        <p className="card-text"><strong>Quantity:</strong> {contract.quantity}</p>
                                        <p className="card-text"><strong>Equipment Type:</strong> {contract.equipment.equipmentType}</p>
                                        <p className="card-text"><strong>Price:</strong> ${contract.equipment.price}</p>
                                        <button
                                            onClick={() => this.cancelDelivery(contract.id)} // Pass the contract ID
                                            className='btn btn-primary mr-1'
                                            disabled={contract.status !== 'PENDING'} // Disable button if status is not 'PENDING'
                                        >
                                            Cancel next delivery
                                        </button>    
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default CompanyContractsComponent;
