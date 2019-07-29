import React, { Component } from 'react';
import {
  Badge,Button, Card,CardBody,CardHeader, Col, Spinner, Row,Table, Fade,ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import Pagecomponent from './Pagecomponent/Paginate';
import Fill from './Pagecomponent/InfoSheet1';
import Fill2 from './Pagecomponent/social';
import Fill3 from './Pagecomponent/Delete';
import axios from 'axios';
import { CSVLink } from "react-csv";
import { Link } from 'react-router-dom';
import PubSub from 'pubsub-js';

function compare(property){
  return function(a,b){
      var sortby = property
      var value1 = a[property];
      var value2 = b[property];
      if(sortby === 'firstName'|| sortby === 'Department'|| sortby ==='Major' ){
        return value1.localeCompare(value2)
      } else if (sortby === 'firstName back' || sortby === 'Event_Date'){
        return value2.localeCompare(value1)
      } else {
        return  value1 - value2;
      }
  }
}

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
    this.renderSearchData = this.renderSearchData.bind(this);
    this.dropclick = this.dropclick.bind(this);
    this.paginate= this.paginate.bind(this);

    this.state = {
      dropdownOpen: false,
      contactUpdated: false,
      export: false,
      infos: [],
      headers: exportlist, // for export functionality
      currentPage: 1,
      itemsPerpage: 10,
      totalPage: 1,
      totalItem: 0,
      searchlist:[],
      searched:false,
      flag: false,
    };
  }
  // Initialize data
  componentDidMount(){
    axios.get('contacts/getcontact')
    .then(res => {
        this.setState({
          infos: res.data,
          totalPage: Math.ceil(res.data.length / 10),
          totalItem: res.data.length,
          flag:true
        })
    });

    this.pubsub_token = PubSub.subscribe('search',function(topic,contactlist){
      this.setState({
        searched: true,
        searchlist: contactlist,
      })}.bind(this));
  }

  // Info Addition updated
  componentDidUpdate(){
    if(this.state.contactUpdated !== this.props.contactUpdated){
      axios.get('contacts/getcontact')
          .then(res => {
              this.setState({
                infos: res.data,
                totalPage: Math.ceil(res.data.length / 10),
                totalItem: res.data.length,
                flag:true
              })
          });
      this.props.updateInfo(false);
    }
  }
  
  //Handle the delete Button for child component delete.js
  handleDelete(_State){
      if(_State.delete === true){
          axios.delete(`contacts/deletecontact/${_State.id}`)
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
  toggledrop() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }
  dropclick(e){
    var sortby = '';
    if (e.target.value === 'Name front'){sortby='firstName'}
    else if (e.target.value === 'Name back'){sortby='firstName back'}
    else if (e.target.value === 'Major'){sortby='Major'}
    else if (e.target.value === 'Departments'){sortby='Department'}
    else if (e.target.value === 'Events'){sortby='Event_Date'}

    if (sortby !== ''){
      this.setState({
        infos:this.state.infos.sort((compare(sortby))),
      })
    }
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
 renderSearchData(){
  let infoDisplay = this.state.searchlist 
  console.log(this.state.searchlist)
  return infoDisplay.map((info, index) => {
      const { id, firstName, lastName, nickname, Department, YOS, Major, Group, Tags, sex,
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
                <span className='text-muted'>{(Group.length === 0 ) ? 'None': Group}</span>
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
                <Fill firstName={firstName}
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
                      Social_Contact_account={"221122"}
                      BM_date={Event_Date}
                      BM_name={Recent_Event}
                      note={note}
                      img={img}
                      getContactInfo = {this.getContactInfo}
                      />
                <Fill2 facebook={SocialAccount.Facebook} twitter={SocialAccount.Twitter}/>
                <Fill3 handleDelete={this.handleDelete} id={id}/>
              </div>  
              </td>
            </tr>
  )
})
}

  render() {
    const indexOfLastItem = (this.state.currentPage!==this.state.totalPage)?(this.state.currentPage * this.state.itemsPerpage):this.state.totalItem;
    const indexOfLastItem2 = (this.state.currentPage!== Math.ceil(this.state.searchlist.length / 10))?(this.state.currentPage * this.state.itemsPerpage):this.state.searchlist.length;
    const indexOfFirstItem = (this.state.currentPage!==this.state.totalPage)?(indexOfLastItem -this.state.itemsPerpage):(this.state.itemsPerpage * (this.state.currentPage-1));
    const indexOfFirstItem2 = (this.state.currentPage!== Math.ceil(this.state.searchlist.length / 10))?(indexOfLastItem2 -this.state.itemsPerpage):(this.state.itemsPerpage * (this.state.currentPage-1));
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <h1 className="h3 mb-3 text-gray-800">Contacts</h1>
            <Fade timeout={200} in={true}>
            <Card className="card-accent-info shadow-sm">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Contact Book
                <div className="card-header-actions">
                <ButtonDropdown className="mr-3 " isOpen={this.state.dropdownOpen} toggle={() => { this.toggledrop(); }}>
                  <DropdownToggle caret color="primary" className='float-right' size ='sm'>
                    Sort By 
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Types</DropdownItem>
                    <DropdownItem value ='Name front' onClick={this.dropclick}>Name (A-Z)</DropdownItem>
                    <DropdownItem value ='Name back' onClick={this.dropclick}>Name (Z-A)</DropdownItem>
                    <DropdownItem value ='Major' onClick={this.dropclick}>Major</DropdownItem>
                    <DropdownItem value ='Departments' onClick={this.dropclick}>Departments</DropdownItem>
                    <DropdownItem value ='Events' onClick={this.dropclick}>Most Recent Event</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
                <Button color="primary"  className="mr-3 " size='sm' onClick={this.toggleExport}>
                  <CSVLink className='export' data={this.state.infos} headers={this.state.headers} filename={"Contact_Book.csv"}><i className="fa fa-cloud-download"></i>&nbsp; Export </CSVLink>
                </Button>
                
                <Link to="/visual"><Button color="primary"  className="mr-3 " size='sm'><i className='fa fa-eye mr-1'></i> Go Visual</Button></Link>
                

                </div>
              </CardHeader>
             <CardBody className=' pb-2 mb-0'>
               {/* Main Table for display */}
               {(this.state.flag)?
                <div>
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
                        {(this.state.searched)?this.renderSearchData():this.renderTableData()}
                      </tbody>
                  </Table>
                </Fade>
                <Row className='mt-3'>
                  <Col md='3' className='pagi-header pl-5'>
                    {(this.state.searched)?
                    <strong>{`${indexOfFirstItem2 +1}- ${indexOfLastItem2} of ${this.state.searchlist.length} Contacts`}</strong>
                    :
                    <strong>{`${indexOfFirstItem +1}- ${indexOfLastItem} of ${this.state.totalItem} Contacts`}</strong>}
                  </Col>
                  <Col md='9'>
                  {(this.state.searched)?
                  <Pagecomponent totalItem ={this.state.searchlist.length}
                                  currentPage={this.state.currentPage}
                                  itemsPerpage={this.state.itemsPerpage}
                                  totalPage={Math.ceil(this.state.searchlist.length / 10)}
                                  paginate={this.paginate}/>
                  :
                  <Pagecomponent totalItem ={this.state.totalItem}
                                currentPage={this.state.currentPage}
                                itemsPerpage={this.state.itemsPerpage}
                                totalPage={this.state.totalPage}
                                paginate={this.paginate}/>}
                  
                  </Col>
                </Row>
                </div>
                :
                <div className='text-center mt-1'>
                  <Spinner style={{width: '1.2rem',height: '1.2rem'}} color = "primary"/>
                </div>}                
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
