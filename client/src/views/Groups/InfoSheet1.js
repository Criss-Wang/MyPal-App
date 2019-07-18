import React, { Component } from 'react'
import { Badge, Button, Input, Modal, ModalBody, 
          ModalFooter, ModalHeader, Col, Row, Form, FormGroup, 
          Label,} from 'reactstrap';
import Select from 'react-select';
import axios from 'axios';

export class InfoSheet extends Component {
  constructor(props) {
    super(props);
    this.togglemodal = this.togglemodal.bind(this);
    this.togglesubmit = this.togglesubmit.bind(this);
    this.handleAddMem = this.handleAddMem.bind(this);
    this.addEvent = this.addEvent.bind(this); 
    this.mountEventlist = this.mountEventlist.bind(this);
    this.onChange= this.onChange.bind(this);
    this.onEventChange = this.onEventChange.bind(this);
    this.getContact = this.getContact.bind(this);
    this.contactSync = this.contactSync.bind(this);

    this.state = {
      modal: false,
      selectedOption:null,
      options:[],
      newEvents: [{name:"", date:"", notes:""}],
      name: [],
      GroupName: '',
      img:[],
      ids:[],
    };
  }

  contactSync(id, name){
    axios.put(`contacts/synccontact/${id}`, {gn:name})
        .then(res => {
          console.log('done')
        })
  }

  async getContact(){
    let avail_friends = [];
    let img = [];
    let id = []
    await axios.get('contacts/getcontact')
    .then(res => {
          let data = res.data
          data.forEach(contact => {
            let name = `${contact.firstName} ${contact.lastName}`
            if (!(this.state.name.includes(name))){
            avail_friends.push({value: name, label: name})}
            img.push(contact.img)
            id.push(contact._id)
          });
        })
    .catch(function(error){
          console.log(error);
      });
    this.setState({
      options:avail_friends,
      img: img,
      ids: id
    })
  }

  componentWillMount(){
    this.getContact()
  }

  //For Group card creation
  togglesubmit(){
    let namelist = [];
    this.state.name.forEach((nameObj)=>{
      namelist.push(nameObj.value)
    });
    let eventlist = [];
    if (!(this.state.newEvents===null)){
    [...this.state.newEvents].forEach((event)=>{
      if(event.name !== ''){
      eventlist.push({
        EventName:event.name, 
        EventDate:event.date, 
        EventNote:event.notes
      })}
    })}
    let imglist = [];
    this.state.name.forEach(name => {
      imglist.push(this.state.img[this.state.options.indexOf(name)])})
    
    let idlist = [];
    this.state.name.forEach(name => {
      idlist.push(this.state.ids[this.state.options.indexOf(name)])})
    const getGroupInfo = this.props.getGroupInfo;
    const info = {
      Events: eventlist,
      name: namelist,
      GroupName: this.state.GroupName,
      img: imglist,
      id: idlist
    }

    idlist.forEach(id => {
      this.contactSync(id, this.state.GroupName)
    })

    getGroupInfo(info);

    if (this.state.modal){
      this.setState({
        selectedOption:null,
        newEvents: [{name:"", date:"", notes:""}],
        name: [],
        GroupName: '',
        img:[],
      })
    }
    this.getContact()
    this.setState({
      modal: !this.state.modal,
    });
  }

  //For New Contact Submission Modal
  togglemodal() {
    if (this.state.modal){
      this.setState({
        selectedOption:null,
        newEvents: [{name:"", date:"", notes:""}],
        name: [],
        GroupName: '',
        img:[],
      })
    }
    this.getContact()
    this.setState({
      modal: !this.state.modal,
    });
  }

  // Value inputs
  onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  // Member addition
  handleAddMem = selectedOption => {
    this.setState({ 
      selectedOption,
      name: selectedOption,
     });
    
    console.log(`Option selected:`, selectedOption);
  };
  // Event Addition
  onEventChange(e){
     {let eventlist = [...this.state.newEvents];
      eventlist[e.target.dataset.id][e.target.name] = e.target.value
      this.setState({ newEvents: eventlist }, () => console.log(this.state.newEvents))}
  }
  
  addEvent = (e) => {
    this.setState((prevState) => ({
      newEvents: [...prevState.newEvents, {name:"", date:""}],
    }));
  }

  mountEventlist(){
    let eventlist = this.state.newEvents;
    return eventlist.map((value, index)=> {
        let nameId = `name-${index}`, dateId = `date-${index}`, noteId = `note-${index}`;
        return (
          <FormGroup row id={index} key={index} className='mr-0'>
            <Col xs='1' className=" mr-0 pr-0 pt-1 "><Badge color='primary' htmlFor={nameId} className='event_label'>{`#${index + 1}`}</Badge></Col>
            <Col xs="12" md="5" className=" ml-0 pl-0 mr-0 pr-2">
              <Input
                type="text"
                name='name'
                data-id={index}
                id={nameId}
                value={eventlist[index].name} 
                className="name"
                placeholder = "Event Name"
                onChange={this.onEventChange}
              />
            </Col>
            <Col xs="5" className='ml-0 pl-0 mr-0 pr-0'>
              {/* <Label htmlFor={dateId}>Date</Label> */}
              <Input
                type="date"
                name='date'
                data-id={index}
                id={dateId}
                value={eventlist[index].date} 
                className="date"
                placeholder = "Event Date"
                onChange={this.onEventChange}
              />
            </Col>
            <Col xs="11" className='ml-auto mt-2 pr-5 mr-3'>
              <Input 
                type="textarea" 
                name='notes'
                id={noteId}
                data-id={index}
                rows="2"
                value={eventlist[index].note} 
                className='note'
                placeholder="Additional Notes..." 
                onChange={this.onEventChange}
              />
            </Col>
          </FormGroup>
        );
      })
    };


    render() {
        return (
          <div className='float-right mr-3'>
            <Button block outline size='sm' color='primary' onClick={this.togglemodal} className=" d-md-down-none">
              <i className="fa fa-user-plus"></i>&nbsp; Create New Group
            </Button>
            <Modal isOpen={this.state.modal} toggle={this.togglemodal} className={'modal-lg modal-primary '+ this.props.className} id='modalCenter'>
              <ModalHeader toggle={this.togglemodal} className='pt-2 mt-0 pb-2 mb-0'>
                <strong className='modal-title'>Groups Info Sheet</strong>
                <small> Creation</small>
              </ModalHeader>
              <ModalBody>
                <Row>
                  
                  <Col lg='12' xs='12'  className='pl-4 pr-3'>
                    <h5 className='ml-1'><i className='fa fa-list'></i>&nbsp; <ins> Group Details</ins></h5>
                    <Row className='mt-3 mb-0 pb-0'>
                      <Col>
                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                          <FormGroup row>
                          <Col md="2" className="mt-1 mr-0 pr-0">
                            <Label htmlFor="Firstname"><i className="fa fa-group mr-1"></i> Group Name</Label>
                          </Col>
                          <Col xs="12" md="10" className=" ml-0 pl-0">
                            <Input type="text" id="groupname" name="GroupName" placeholder="required*" 
                                  value={this.state.GroupName} onChange={this.onChange} required/> {/* Edit OnChange here to enable text editing */}
                          </Col>
                          </FormGroup>
                        </Form>
                      </Col>
                    </Row>
                    <hr className='mt-0 pt-0 mb-2 pb-0'/>
                    <h5 className='ml-1 mb-3'>
                      <i className='fa fa-user'></i>&nbsp; <ins> Add New Members </ins>  
                      <small className='text-muted'>&nbsp; (choose at least 2 people to form a group)</small>
                    </h5>
                    <Row className='mb-4'>
                      <Col xs="12" md="12" className='pr-8'>
                        <Select value={this.state.selectedOption} onChange={this.handleAddMem} options={this.state.options} isMulti/>
                      </Col>        
                    </Row>
                    <hr className='mt-0 pt-0 mb-2 pb-0'/>
                    <h5 className='ml-1'><i className='fa fa-calendar'></i>&nbsp; <ins> Add New Events</ins><Button onClick={this.addEvent} className='add_item_btn' id='create_event_btn'><i className="fa fa-plus-circle pt-1" id='fa-add'></i>&nbsp; Add Another </Button></h5>
                    <Row className=' mb-1'>
                      <Col xs="12" md="12" className=" ml-3 pl-0">
                        <Form>
                          {this.mountEventlist()}
                        </Form>
                      </Col>        
                    </Row>                    
                  </Col>
                </Row>
                
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.togglesubmit}>Create</Button>{' '}
                <Button color="secondary" onClick={this.togglemodal}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </div>
        )
    }
}

export default InfoSheet
