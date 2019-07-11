import React, { Component } from 'react';
import {
  Badge,Button,ButtonDropdown, Card,CardBody,
  CardHeader, Col, DropdownItem, DropdownMenu,
  DropdownToggle, Row,Table, Fade,
} from 'reactstrap';
import Pagecomponent from './Pagecomponent/Paginate';
import Fill from './Pagecomponent/InfoSheet1';
import Fill2 from './Pagecomponent/social';
import Fill3 from './Pagecomponent/Delete';
import axios from 'axios';
import { CSVLink } from "react-csv";

const exportlist = [
  { label: "first name", key: "firstName" },
  { label: "last name", key: "lastName" },
  { label: "nickname", key: "nickname" },
  { label: "Major", key: "Major" },
  { label: "gender", key: "sex" },
  { label: "birthday", key: "birthday" },
  { label: "Department", key: "Department" },
  { label: "Residence", key: "Residence" },
  { label: "Year of Study", key: "YOS" },
  { label: "Group", key: "Group" },
  { label: "Tags", key: "Tags" },
  { label: "Recent Event", key: "Recent_Event" },
  { label: "Event Date", key: "Event_Date" },
  { label: "Phone", key: "Phone" },
  { label: "Email", key: "Email" },
  { label: "Social_Account: Facebook", key: "SocialAccount[0].Channel" },
  { label: "Social_Account: Twitter", key: "SocialAccount[0].Account" }, 
  { label: "Note", key: "note" },
]

class Contact extends Component {
  constructor(props) {
    super(props);
    this.toggleExport= this.toggleExport.bind(this);
    this.toggledrop = this.toggledrop.bind(this);
    this.renderTableData= this.renderTableData.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.paginate= this.paginate.bind(this);

    this.state = {
      dropdownOpen: new Array(2).fill(false),
      contactUpdated: false,
      export: false,
      infos: [],
      headers: exportlist, // for export functionality
      currentPage: 1,
      itemsPerpage: 10,
      totalPage: 1,
      totalItem: 0,
    };
  }
  // Initialize data
  componentDidMount(){
    axios.get('http://localhost:5000/contacts/getcontact')
    .then(res => {
        this.setState({
          infos: res.data,
          totalPage: Math.ceil(res.data.length / 10),
          totalItem: res.data.length,
        })
    });
  }

  // Info Addition updated
  componentDidUpdate(){
    if(this.state.contactUpdated !== this.props.contactUpdated){
      axios.get('http://localhost:5000/contacts/getcontact')
          .then(res => {
              this.setState({
                infos: res.data,
                totalPage: Math.ceil(res.data.length / 10),
                totalItem: res.data.length,
              })
          });
      this.props.updateInfo(false);
    }
  }
  
  //Handle the delete Button for child component delete.js
  handleDelete(_State){
      if(_State.delete === true){
          axios.delete(`http://localhost:5000/contacts/deletecontact/${_State.id}`)
            .then(response => {
              console.log(response)
                this.setState({
                  infos: response.data,
                  totalPage: Math.ceil(response.data.length / 10),
                  totalItem: response.data.length,
                })
            });
      }
  } 
  
  // Display the tags as badges
  renderTags(Tags){
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

  // Handle the paginate for child component paginate.js
  paginate(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    })
  }

  //for the sort dropdown
  toggledrop(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => { return (index === i ? !element : false); });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  // Enable Export modal (not used yet)
  toggleExport() {
    this.setState({
      export: !this.state.export,
    });
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  //Change the infos into sliced infoDisplay
  renderTableData() {
    if (this.state.infos !== []){
    const indexOfLastItem = this.state.currentPage * this.state.itemsPerpage;
    const indexOfFirstItem = indexOfLastItem - this.state.itemsPerpage;
    let infoDisplay = this.state.infos.slice(indexOfFirstItem, indexOfLastItem); 

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
                 />
          <Fill2 SocialAccount={SocialAccount}/>
          <Fill3 handleDelete={this.handleDelete} id={_id}/>
        </div>  
        </td>
      </tr>
       )
    })}
 }

  render() {
    const indexOfLastItem = (this.state.currentPage!==this.state.totalPage)?(this.state.currentPage * this.state.itemsPerpage):this.state.totalItem;
    const indexOfFirstItem = (this.state.currentPage!==this.state.totalPage)?(indexOfLastItem -this.state.itemsPerpage):(this.state.itemsPerpage * (this.state.currentPage-1));
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <h1 className="h3 mb-3 text-gray-800">Contacts</h1>
            <Fade timeout={200} in={true}>
            <Card className="card-accent-info shadow-sm">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Contact Book
                <Badge className="mr-1 ml-3" color="primary">Anime</Badge>
                <div className="card-header-actions">
                <ButtonDropdown className="mr-3 " isOpen={this.state.dropdownOpen[0]} toggle={() => { this.toggledrop(0); }}>
                  <DropdownToggle caret color="primary" className='float-right' size ='sm'>
                    Sort By 
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Types</DropdownItem>
                    <DropdownItem disabled>Name (A-Z)</DropdownItem>
                    <DropdownItem>Name (Z-A)</DropdownItem>
                    <DropdownItem>Tags</DropdownItem>
                    <DropdownItem>Groups</DropdownItem>
                    <DropdownItem>Most Recent Event</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
                <Button color="primary"  className="mr-3 " size='sm' onClick={this.toggleExport}>
                  <CSVLink className='export' data={this.state.infos} headers={this.state.headers} filename={"Contact_Book.csv"}><i className="fa fa-cloud-download"></i>&nbsp; Export </CSVLink>
                </Button>

                </div>
              </CardHeader>
             <CardBody className=' pb-2 mb-0'>
               {/* Main Table for display */}
             <Fade timeout={200} in={true}>
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
              </Fade>
              <Row className='mt-3'>
                <Col md='3' className='pagi-header pl-5'>
                  <strong>{`${indexOfFirstItem +1}- ${indexOfLastItem} of ${this.state.totalItem} Contacts`}</strong>
                </Col>
                <Col md='9'>
                <Pagecomponent totalItem ={this.state.totalItem}
                              currentPage={this.state.currentPage}
                              itemsPerpage={this.state.itemsPerpage}
                              totalPage={this.state.totalPage}
                              paginate={this.paginate}/>
                </Col>
              </Row>                
              </CardBody>
            </Card>
            </Fade>
          </Col>
        </Row>
      </div>
  );
  }
}

export default Contact;
