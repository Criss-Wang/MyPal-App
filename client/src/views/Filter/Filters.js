import React, { Component } from 'react';
import {
  Badge,Button,Card,CardBody, CardHeader,Col,Row,Table, InputGroupAddon} from 'reactstrap';
import axios from 'axios'
import Fill2 from '../Dashboard/Pagecomponent/InfoSheet1';
import Fill3 from '../Dashboard/Pagecomponent/social';
import Select from 'react-select';

const options = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' },
  ];

class Filters extends Component {
  constructor(props) {
    super(props);
    this.onapply = this.onapply.bind(this);
    this.handleAddMem = this.handleAddMem.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.state = {
        sorttag:'',
        filteredlist:[],
        filtertaglist:[],
        after:[],
    };
  }
  state = {
    selectedOption: null,
  };


  handleAddMem = selectedOption => {
      this.setState({ 
        selectedOption,
        filtertaglist: selectedOption,
      })
    };

  onapply(){ 
      axios.get('http://localhost:5000/contacts/getcontact')
      .then(res=>{
        var newlist = []
        this.state.filtertaglist.map((searchtag)=> {
          res.data.map((item) => {
              const { Department, YOS, Major, sex} = item
              console.log(sex, searchtag.value )
              if(sex === searchtag.value || Department === searchtag.value || YOS === searchtag.value || Major === searchtag.value){
                  if(newlist.indexOf(item) === -1){
                    newlist.push(item)
                  }
              }
          })
        });
      this.setState({
        after:newlist,
    })
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

  renderTags(Tags){
      return Tags.map((tag, i)=>{
        return <Badge className="mr-1" color="primary" key={i}>{tag}</Badge>
      })
    }
  renderTableData() {
      console.log(this.state.after)
      return this.state.after.map((info, index) => {
          const { firstName, lastName, nickname, Department, YOS, Major, Group, Tags, sex,
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
                    <div className="text-center">
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
                    <Fill2 firstName={firstName}
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
                          Social_Contact_type= {"Facebook"}
                          Social_Contact_account={SocialAccount.Facebook}
                          BM_date={Event_Date}
                          BM_name={Recent_Event}
                          note={note}
                          img={img}
                          getContactInfo = {this.getContactInfo}
                            />
                    <Fill3 facebook={SocialAccount.Facebook} twitter={SocialAccount.Twitter}/>
                  </div>  
                  </td>
                </tr>
      )
    })
  }
  render() {

    const { selectedOption } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col sm='7'>
            <h1 className="h3 mb-3 text-gray-800">Filters</h1>
          </Col>
          <Col sm='4'>
            <Select value={selectedOption} onChange={this.handleAddMem} options={options} isMulti/>
          </Col>
          <Col sm='1'>
            <InputGroupAddon addonType="append">
              <Button className='mt-1' color="primary" size='sm' onClick ={this.onapply}>Apply</Button>
            </InputGroupAddon>
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col>
            <Card className="card-accent-info shadow-sm">
              {/*5 Most recent Addition display */}
              <CardHeader>
                Filter Result
              </CardHeader>
             <CardBody>
                <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Filters;
