import React, { Component } from 'react';

import ComplaintService from '../services/ComplaintService';

import UserService from "../services/user.service";

class ReplyToComplaint extends Component {
    constructor(props) {
        super(props);

        this.state={
            reply: '',
            complaintId: props.match.params.id,
            content: ''
        }

        this.changeReplyHandler = this.changeReplyHandler.bind(this);
        this.finishReply = this.finishReply.bind(this);
    }

    changeReplyHandler=(e) =>{
        this.setState({reply: e.target.value});
    }

    finishReply=(e) =>{
        e.preventDefault();

        if(this.state.reply === ""){
            console.log("You can't enter an empty reply");
            return;
        }
        if(this.state.reply.length > 255){
            console.log("Your reply is too long :(");
            return;
        }

        console.log("reply => ", this.state.reply);
        
        ComplaintService.saveReply(this.state.reply, this.state.complaintId);
    }

    componentDidMount() {
        UserService.getSystemAdminBoard().then(
          response => {
            this.setState({
              content: response.data
            });
          },
          error => {
            this.setState({
              content:
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString()
            });
    
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            //   EventBus.dispatch("logout");
              this.props.history.push('/profile');
              console.log("Error: Nemate potrebne privilegije za pristup stranici");
            }
          }
        );
      }

    render() {
        return (
            <div className='text-center'>
                <h2>Write your reply</h2>
                <form>
                    <textarea placeholder='Write your reply' className='form-control' value={this.state.reply} 
                        onChange={this.changeReplyHandler} style={{marginTop: '90px', fontSize: 22, overflowY: "auto"}}/>

                    <button className='btn btn-success' onClick={this.finishReply} style={{marginTop: '20px'}}>Finish</button>
                </form>
            </div>
        );
    }
}
export default ReplyToComplaint;