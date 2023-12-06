import React, { Component } from 'react';

import ComplaintService from '../services/ComplaintService';


class ListComplaintComponent extends Component {
    constructor(props) {
        super(props);

        this.state={
            complaints: []
        }

    }

    componentDidMount(){
        ComplaintService.getAll().then((res) => {
            this.setState({complaints: res.data});
        });
    }

    replyToComplaint(id){
        this.props.history.push(`/api/complaints/reply/${id}`);
    }

    render() {
        return (
            <>
                <h2 className='text-center'>List of all complaints</h2>
                <div className='row'>
                    <table className='table table-striped table bordered'>
                        <thead>
                            <tr>
                                <th>Comment</th>
                                <th>Written by</th>
                                <th>For company</th>
                                <th>For company administrator</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.complaints.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.comment}</td>
                                    <td>{c.writerName}</td>
                                    <td>{c.companyName}</td>
                                    <td>{c.companyAdminName}</td>
                                    <td>
                                        <button onClick={() => this.replyToComplaint(c.id)} className='bnt btn-info'>Reply</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}

ListComplaintComponent.propTypes = {

};

export default ListComplaintComponent;