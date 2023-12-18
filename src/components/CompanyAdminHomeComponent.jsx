import React, { Component } from 'react';
import CompanyAdminService from '../services/CompanyAdminService';

class CompanyAdminHomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminId: 6,
            admin: null
        
        }

    }
    updateCompanyAdmin(){
        const adminId = 6
        this.props.history.push(`/api/company-admins/update/` + adminId)
    }
    showCompany(id){
        this.props.history.push(`/api/companies/${id}`);
    }
    showCalendar(){
        this.props.history.push(`/api/company-admins/company-working-days`);
    }
    componentDidMount() {
        CompanyAdminService.findBy(this.state.adminId)
        .then((res) => {
            // Handle the response and update the state with company data
            this.setState({ admin: res.data });
        })
        .catch(error => {
            // Handle error if necessary
            console.error('Error fetching admin:', error);
        });
    }

  
    render() {
        return (
            <div>
                <div>
                    <button onClick={() => this.showCompany(this.state.admin.companyId)} className='btn-btn-info'>Show company</button>
                </div>
                <div>
                    <button onClick={() => this.updateCompanyAdmin()} className='btn-btn-info'>Update company admin</button>
                </div>
                <div>
                    <button onClick={() => this.showCalendar()} className='btn-btn-info'>Show calendar</button>
                </div>
            </div>
        );
    }
}

export default CompanyAdminHomeComponent;