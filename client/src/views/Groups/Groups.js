import React, { Component, } from 'react';
import {
  Badge,Card,CardBody,
  CardHeader,Col,Row,Fade, Spinner
} from 'reactstrap';
import Fill1 from './InfoSheet1';
import Fill2 from './InfoSheet2';
import Pagecomponent from './Paginate';
import axios from "axios";

class Groups extends Component {
  constructor(props) {
    super(props);
    this.paginate = this.paginate.bind(this);
    this.renderTableData1 = this.renderTableData1.bind(this);
    this.renderTableData2 = this.renderTableData2.bind(this);
    this.renderCardEventList = this.renderCardEventList.bind(this);
    this.getGroupInfo = this.getGroupInfo.bind(this);
    this.updateGroupInfo = this.updateGroupInfo.bind(this);
    this.deleteGroupInfo = this.deleteGroupInfo.bind(this);
    this.renderCardImgList = this.renderCardImgList.bind(this);
    this.state = {
      dropdownOpen: false,
      GroupInfo: [],
      currentPage: 1,
      itemsPerpage: 8,
      totalItem: 0,
      flag:false
    };
  }
  componentDidMount(){
    axios.get(`groups/getgroup/${localStorage.groupId}`)
         .then(response => {
             this.setState({
              GroupInfo: response.data,
              totalPage: Math.ceil(response.data.length / 8),
              totalItem: response.data.length,
              flag:true
            })
         });
  };
  //Create New Group
  getGroupInfo(_info){
    axios.post(`groups/new/${localStorage.groupId}`, _info)
        .then(res => {
          this.setState({
            GroupInfo: res.data,
            totalPage: Math.ceil(res.data.length / 8),
            totalItem: res.data.length,
          })
        });
  }
  
  //updata Info
  updateGroupInfo(_info, id){
    axios.put(`groups/${localStorage.groupId}/updategroup/${id}`, _info)
        .then(response => {
          this.setState({
            GroupInfo: response.data,
            totalPage: Math.ceil(response.data.length / 8),
            totalItem: response.data.length,
          })
        });
  }

  deleteGroupInfo(id){
    axios.delete(`groups/${localStorage.groupId}/deletegroup/${id}`)
        .then(response => {
        this.setState({
          GroupInfo: response.data,
          totalPage: Math.ceil(response.data.length / 8),
          totalItem: response.data.length,
        })
      });
  }

  //Render the event list for each card
  renderCardEventList(Events){
    if(Events.length === 0){return (<div></div>)}
    if (Events.length <= 3) {
      return Events.map((event, index)=>{
        return (<div key={index} id = {index} className=' text-left gp_event mb-1 pl-2'> {event.EventName} </div>)
      })} 
    else {
      return (<div ><div id = {0} className=' text-left gp_event mb-1 pl-2'> {Events[0].EventName} </div>
      <div id = {1} className=' text-left gp_event mb-1 pl-2'> {Events[1].EventName} </div>
      <div id = {2} className=' text-left gp_event mb-1 pl-2 text-muted'> {`and ${Events.length -2} More ...`} </div> </div>
      )}
  }

  //Render the img list for each card
  renderCardImgList(img){
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

  // Render the cards in the first row
  renderTableData1() {
    const indexOfLastItem = this.state.currentPage * 8 -4; //this.state.itemsPerpage
    const indexOfFirstItem = indexOfLastItem - 4; //this.state.itemsPerpage
    let infoDisplay = this.state.GroupInfo.slice(indexOfFirstItem, indexOfLastItem); 

    return infoDisplay.map((info, index) => {
       const { name, Events, GroupName, img, id} = info;
       return (
        <Col xs="12" sm="6" md="3" key={index+indexOfFirstItem}>
          <Fade timeout={this.state.timeout} in={this.state.fadeIn}>                
            <Card className='dash-card group shadow-sm'>
              <CardHeader>
                <span><strong>{GroupName}</strong></span>
                <div className="card-header-actions">
                  <Fill2 info = {info} 
                         updateGroupInfo={this.updateGroupInfo} 
                         deleteGroupInfo={this.deleteGroupInfo}
                         id={info._id}
                         idlist = {id}
                         img = {img}/>
                </div>
              </CardHeader>
              <CardBody className='pt-0 mt-0'>
                <p className='pt-2 mt-0 pb-2 mb-0'>People <Badge className=" float-right mt-1" color="primary" size='sm'>{name.length}</Badge></p>
                <hr className='mt-0 pt-0'/>
                <div className="text-left">
                  <div className="avatars-stack mt-0 mb-0">
                    {this.renderCardImgList(img)}
                  </div>
                  <div className='people_ex text-left text-muted'> {(name.length <= 2 ) ? `${name[0]}, ${name[1]}`: `${name[0]}, ${name[1]} and ${name.length -2}+`}</div>
                </div>
                <p className='pt-2 mt-0 pb-2 mb-0'>Events <Badge className=" float-right mt-1" color="primary" size='sm'>{Events.length}</Badge></p>
                <hr className='mt-0 pt-0 pb-2 mb-0'/>
                {this.renderCardEventList(Events)}
              </CardBody>
            </Card>
          </Fade>
        </Col>
      )
    })
  }

  // Render the cards in the second row
  renderTableData2(){
    const indexOfLastItem = this.state.currentPage * 8; //this.state.itemsPerpage
    const indexOfFirstItem = indexOfLastItem - 4; //this.state.itemsPerpage
    if (indexOfFirstItem > this.state.totalItem){
      return (<div></div>)
    }
    else {
    let infoDisplay = this.state.GroupInfo.slice(indexOfFirstItem, indexOfLastItem); 

    return infoDisplay.map((info, index) => {
       const { name, Events, GroupName, img, id} = info;
        //using name.length, Events.length
        //destructuring
        console.log(info)
       return (
        <Col xs="12" sm="6" md="3" key={index+indexOfFirstItem}>
          <Fade timeout={this.state.timeout} in={this.state.fadeIn}>                
            <Card className='dash-card group shadow-sm'>
              <CardHeader>
                <span><strong>{GroupName}</strong></span>
                <div className="card-header-actions">
                  <Fill2 info = {info} 
                         updateGroupInfo={this.updateGroupInfo} 
                         deleteGroupInfo={this.deleteGroupInfo}
                         id={info._id}
                         img = {img}
                         idlist={id}/>
                </div>
              </CardHeader>
              <CardBody className='pt-0 mt-0'>
                <p className='pt-2 mt-0 pb-2 mb-0'>People <Badge className=" float-right mt-1" color="primary" size='sm'>{name.length}</Badge></p>
                <hr className='mt-0 pt-0'/>
                <div className="text-left">
                  <div className="avatars-stack mt-0 mb-0">
                   {this.renderCardImgList(img)}
                  </div>
                  <div className='people_ex text-left text-muted'> {(name.length <= 2 ) ? `${name[0]}, ${name[1]}`: `${name[0]}, ${name[1]} and ${name.length -2}+`}</div>
                </div>
                <p className='pt-2 mt-0 pb-2 mb-0'>Events <Badge className=" float-right mt-1" color="primary" size='sm'>{Events.length}</Badge></p>
                <hr className='mt-0 pt-0 pb-2 mb-0'/>
                {this.renderCardEventList(Events)}
              </CardBody>
            </Card>
          </Fade>
        </Col>
      )
    })
  }
}

  // pagination for group cards display
  paginate(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    })
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <h1 className="h3 mb-3 text-gray-800">Groups</h1>
            <Card className="card-accent-info shadow-sm mb-4 pb-0">
              <CardHeader>
              <i className="fa fa-users"></i> Network Groupings <span className='text-muted pl-1 amount'> {`(${this.state.totalItem} in total)`}</span>
              <Pagecomponent currentPage={this.state.currentPage} totalPage={Math.ceil(this.state.GroupInfo.length / 8)} paginate={this.paginate}/>
                <Fill1 getGroupInfo={this.getGroupInfo} />
              </CardHeader>
              <CardBody className='mb-2 pb-0'>
              {(this.state.flag)?
                <div>
                <Row>
                  {this.renderTableData1()}
                </Row>
                <Row>
                  {this.renderTableData2()}
                </Row>
                </div>
                :
                <div className='text-center mt-1'>
                  <Spinner style={{width: '1.2rem',height: '1.2rem'}} color = "primary"/>
                </div>} 
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Groups;
