import React, { Component } from 'react'
import {
    Button,Card,CardBody, CardHeader, ListGroupItem, ListGroup, Spinner
  } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const sortdate = (arr) => {
  return arr.sort(function(a, b){
    return new Date(a.Event_Date) - new Date(b.Event_Date);
  });
}

const convertDay = (num) => {
  let day;
  switch (num) {
    case 0:
      day = "Sun";
      break;
    case 1:
      day = "Mon";
      break;
    case 2:
       day = "Tue";
      break;
    case 3:
      day = "Wed";
      break;
    case 4:
      day = "Thu";
      break;
    case 5:
      day = "Fri";
      break;
    case 6:
      day = "Sat";
      break;
    default:
      day = 'Sat'
  } 
  return day
}
const convertMonth = (num) => {
  let month;
  switch (num) {
    case 0:
      month = "Jan";
      break;
    case 1:
      month = "Feb";
      break;
    case 2:
      month = "Mar";
      break;
    case 3:
      month = "Apr";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "Jun";
      break;
    case 6:
      month = "Jul";
      break;
    case 7:
      month = "Aug";
      break;
    case 8:
      month = "Sep";
      break;
    case 9:
      month = "Oct";
      break;
    case 10:
      month = "Nov";
      break;
    case 11:
      month = "Dec";
      break;
    default:
      month = 'Dec'
  } 
  return month
}

export class RecentEvent extends Component {
  constructor(props){
    super(props);
    this.renderGroupImgList = this.renderGroupImgList.bind(this);
    this.individuals = this.individuals.bind(this);
    this.contact = this.contact.bind(this);
    this.group = this.group.bind(this);
    this.state ={
      contactData:[],
      groupData:[],
      img: [],
      eventUpdated: false,
      flag: false
    }
  }
  async contact(){ 
    var data = [];
    var tempdata = [];
    await axios.get('contacts/getcontact')
          .then(res => {
                let sortdata = res.data
                sortdata.forEach(contact => {
                  if (contact.Recent_Event !== ''){
                  tempdata.push({img:contact.img, name:contact.firstName, Event_Name: contact.Recent_Event, Event_Date:contact.Event_Date, Event_Note:contact.note})
                }});
                tempdata = sortdate(tempdata).reverse().slice(0,2)
                tempdata.forEach(ele => {data.push(ele)})
              })
          .catch(function(error){
                console.log(error);
            });
    this.setState({
      contactData: data
    })
  }

  async group(){
    var data = [];
    var tempdata = [];
    await axios.get('groups/getgroup')
        .then(res => {
          let newdata  = res.data;
          newdata.forEach(group => {
            if (group.Events !== []){
            group.Events.forEach(event => {
              tempdata.push({img: group.img, name:group.GroupName, Event_Name:event.EventName, Event_Date:event.EventDate, Event_Note: event.EventNote})
            })}
          })
          tempdata = sortdate(tempdata).reverse().slice(0,2)
          tempdata.forEach(ele => {data.push(ele)})
        })
        .catch(function(error){
          console.log(error);
        });
        this.setState({
          groupData: data,
          flag: true
        })
  }

  componentWillMount(){
    this.contact();
    this.group();
  }

  componentDidUpdate(){
    if(this.props.eventUpdated === true ){
        this.contact();
        this.group();
        this.props.updateEventInfo(false)
    }
  }
  //Render the img list for each card
  renderGroupImgList(img){
    if(img.length !== 0){
      return img.map((img, index)=>{
        return (
          <div className="avatar avatar-xs" key={index}>
              <img src={(img!== '')?img:'../../assets/img/defaultUser.png'} className="img-avatar" alt="admin@bootstrapmaster.com" />
          </div>
        )
      })
    }
  }

  individuals(arr){
    return arr.map((Event,index) => {
      let tempdate = new Date(Event.Event_Date);
      let date = `${convertMonth(tempdate.getMonth())} ${tempdate.getDate().toString()}, ${convertDay(tempdate.getDay())}`
      let cn = (index === 0) ? 'list-group-item-accent-primary list-group-item-divider':'list-group-item-accent-info list-group-item-divider'

      return (
        <ListGroupItem key={index} action tag="a" href="#" className={cn}>
          <div className="avatar float-right">
            <img className="img-avatar" src={(Event.img!== '')?Event.img:'../../assets/img/defaultUser.png'} alt="event_friend"></img>
          </div>
          <div>{Event.Event_Name} with <strong>{Event.name}</strong> </div>
          <small className="text-muted mr-3">
            <i className="icon-calendar"></i>&nbsp; {date}
          </small>
          <small className="text-muted">
            <i className="icon-location-pin"></i> {(Event.Event_Note === '')?"No Description":Event.Event_Note}
          </small>
      </ListGroupItem>
      )
    })}

  groups(arr){
    return arr.map((Event,index) => {
      let tempdate = new Date(Event.Event_Date);
      let date = `${convertMonth(tempdate.getMonth())} ${tempdate.getDate().toString()}, ${convertDay(tempdate.getDay())}`
      let cn = (index === 0) ? 'list-group-item-accent-warning list-group-item-divider':'list-group-item-accent-danger list-group-item-divider'

      return (
        <ListGroupItem action tag="a" href="#" className={cn} key={index}>
          <div><strong>{Event.name} </strong>{Event.Event_Name}</div>
          <small className="text-muted mr-3"><i className="icon-calendar"></i>&nbsp; {date}</small>
          <small className="text-muted"><i className="icon-home"></i>&nbsp; {(Event.Event_Note === '')?"No Description":Event.Event_Note}</small>
          <div className="avatars-stack mt-0 float-right">
            {this.renderGroupImgList(Event.img)}
          </div>
        </ListGroupItem>
      )
    })
  }

    render() {
        return (
            <Card className='dash-card card-accent-info shadow-sm'>
                {/*Event Summary display */}
                <CardHeader>
                  <span>Recent Events</span>
                  <div className="card-header-actions">
                  <Link to="/profile">
                    <Button outline className='card-header-action' id='modalbtn'><i className='fa fa-location-arrow'></i> </Button>
                  </Link>
                  </div>
                </CardHeader>
                <CardBody className='pl-0 pt-0 ml-0 mt-0 mr-0 pr-0 mb-0 pb-3'>
                  {(this.state.flag)?
                  <div>
                    <ListGroup className="list-group-accent" tag={'div'}>
                    <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Individuals</ListGroupItem>
                    {this.individuals(this.state.contactData)}
                    
                    <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Group Events</ListGroupItem>
                    {this.groups(this.state.groupData)}
                  </ListGroup>
                  </div>
                  :
                  <div className='text-center mt-3'>
                    <Spinner style={{width: '1.2rem',height: '1.2rem'}} color = "primary"/>
                  </div>}
                </CardBody>
              </Card>
        )
    }
}

export default RecentEvent
