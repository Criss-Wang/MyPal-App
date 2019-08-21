import React, { Component } from 'react';
import {Badge, Card, CardBody, CardHeader, Table, Fade, Spinner} from 'reactstrap';
import Fill from './InfoSheet1';
import Fill2 from './social';
import Fill3 from './Delete';
import axios from 'axios';


class RecentAdd extends Component {
  constructor(props) {
    super(props);
    this.renderTableData= this.renderTableData.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      dropdownOpen: new Array(2).fill(false),
      contactUpdated: false,
      infos: [],
      flag: false
    };
  }
  // Initialize data
  componentDidMount(){
    axios.get(`contacts/getcontact/${localStorage.contactId}`)
    .then(res => {
        this.setState({
          infos: res.data,
          flag: true
        })
    });
  }

  // Info Addition updated
  componentDidUpdate(){
    if(this.state.contactUpdated !== this.props.contactUpdated){
      axios.get(`contacts/getcontact/${localStorage.contactId}`)
          .then(res => {
              this.setState({
                infos: res.data,
                flag: true
              })
          });
      this.props.updateInfo(false);

    }
  }
  
  //Handle the delete Button for child component delete.js
  async handleDelete(_State){
      if(_State.delete === true){
          await axios.delete(`contacts/${localStorage.contactId}/deletecontact/${_State.id}`)
            .then(response => {
              
                this.setState({
                  infos: response.data,
                })
            })
            .then(
              
            );
            this.props.updateEventInfo(true)    
      }
  } 
  
  // Display the tags as badges
  renderTags( Tags){
    return Tags.map((tag, i)=>{
      return <Badge className="mr-1" color="primary" key={i}>{tag}</Badge>
    })
  }

  // Display the groups 
  renderGroups(Group){
    if (Group.length > 4){
      let FiveGroups = Group.slice(0,4);
      let countmore = Group.length - 4;
      let output = '';
      FiveGroups.forEach(group => {
        output = output + " " + group + ' |'
      });
      output = output + ' '+ countmore.toString() + ' more...'
      return output
    }
    else {
      let output = '';
      let someGroups = Group.slice(0, Group.length -1);
      let lastOne = Group[Group.length-1]
      someGroups.forEach(group => {
        output = output + " " + group + ' |'
      });
      output = output + ' ' + lastOne
      return output
    }
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  //Change the infos into sliced infoDisplay
  renderTableData() {
    if (this.state.infos.length !== 0){
      let infoDisplay = [];
      if (this.state.infos.length >= 5){
        infoDisplay = this.state.infos.slice(this.state.infos.length-5, this.state.infos.length).reverse(); 
      } else {
        infoDisplay = this.state.infos.reverse()
      }
    
    
    return infoDisplay.map((info, index) => {
       const { _id, firstName, lastName, nickname, Department, YOS, Major, Group, Tags, sex,
        Recent_Event, Event_Date, Phone, Email, SocialAccount, img, Residence, birthday, note} = info //destructuring
       return (
        
        <tr key={index}>
        <td className="text-center">
          <div className="avatar">
            <img src={(img!== '')?img:'../../assets/img/defaultUser.png'} className="img-avatar" alt="admin@bootstrapmaster.com" />
          </div>
        </td>
        <td>
          <div>{(nickname === '')?`${firstName} ${lastName}`:`${firstName} ${lastName}, ${nickname}`}</div>
          <div className="small text-muted">
            <span>{Major}</span> 
          </div>
        </td>
        <td className="text-center">
          <span className='text-muted'>{(Group.length === 0 ) ? 'None': this.renderGroups(Group)}</span>
        </td>
        <td>
          <div className="text-center text-muted">
          {(Tags.length === 0 ) ? 'None': this.renderTags(Tags)}
          </div>
        </td>
        <td>
          <div className='text-center'>
          <div className="small text-muted">{(Event_Date.length === 0 ) ? ' ': Event_Date}</div>
          <strong> {(Recent_Event.length === 0 ) ? 'No Event': Recent_Event}</strong>
          </div>
        </td>
        <td className='mr-0 pr-0'>
          <div className="small text-muted"><i className="fa fa-phone mr-1"></i> {(Phone.length === 0 ) ? 'No Record': Phone}</div>
          <div className="small text-muted"><i className="fa fa-envelope mr-1"></i> {(Email.length === 0 ) ? 'No Record': Email}</div>
        </td>
        <td className='pl-0 ml-0 mr-0 pr-0 text-center'>
          <div className='mr-0'>
          <Fill id = {_id}
                firstName={firstName}
                lastName={lastName}
                nickName={nickname}
                sex={sex}
                birthday={birthday}
                Department={Department}
                Major={Major}
                YOS={YOS}
                Tags={Tags}
                Phone={Phone}
                Email={Email}
                Residence={Residence}
                Social_Contact_type= {SocialAccount[0].Channel}
                Social_Contact_account={SocialAccount[0].Account}
                BM_date={Event_Date}
                BM_name={Recent_Event}
                note={note}
                img={img}
                updateInfo = {this.props.updateInfo}
                updateEventInfo = {this.props.updateEventInfo}
                 />
          <Fill2 SocialAccount={SocialAccount}/>
          <Fill3 handleDelete={this.handleDelete} id={_id}
                />
        </div>  
        </td>
      </tr>
       )
    })} 
 }

  render() {
    return (
      <Card className="card-accent-info shadow-sm">
      {/*5 Most recent Addition display */}
        <CardHeader>
          Recently Added
        </CardHeader>
        <CardBody className=' pb-2 mb-4 text-center'>
          {/* Main Table for display */}
          {(this.state.flag)?
          <Fade timeout={200} in={true}>  
            {(this.state.infos.length !== 0)?
            
              <Table hover responsive id="dataTable" className="table-outline mb-0 d-none d-sm-table">                  
                <thead className="thead-light">
                <tr>
                  <th className="text-center"><i className="icon-people"></i></th>
                  <th>Name</th>
                  <th className="text-center">Group</th>
                  <th className="text-center">Tags</th>
                  <th className="text-center mr-2">Recent events</th>
                  <th>Contacts</th>
                  <th> </th>
                </tr>
                </thead>
                <tbody>
                  {this.renderTableData()}
                </tbody>
              </Table>
            :<div className="animated fadeIn text-center">Add your first contact via the "+ Add Contact" on nav bar</div>}
          </Fade>
          :
          <Spinner style={{width: '1.2rem',height: '1.2rem'}} color = "primary"/>}             
        </CardBody>
      </Card>
  );
  }
}

export default RecentAdd;
