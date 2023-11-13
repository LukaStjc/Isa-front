import React, { Component } from 'react';
import CompanyService from '../services/CompanyService';

class ListCompaniesComponent extends Component {

    constructor(props){
        super(props)

        this.state = {
            companies: []
        }
    }

    componentDidMount(){
        CompanyService.getCompanies().then((res) => {
            this.setState({companies: res.data});
        });
    }
    render() {
        return (
            <div>
                <h2 className='text-center'>Companies List</h2>
                <div className='row'>
                    <table className='table table-striped table-bordered'>
                        <thead>
                            <tr>
                                <th>Company name</th>
                                <th>Company description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.companies.map(
                                    company => 
                                    <tr key = {company.id}>
                                        <td>{company.name}</td>
                                        <td>{company.description}</td>
                                        <td>{company.averageScore}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                        
                    </table>

                </div>
            </div>
        );
    }
}

export default ListCompaniesComponent