import React, { Component } from 'react'
import { Button,Card,CardBody, CardHeader, Col, Row} from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';



export class RecentSummary extends Component {
  constructor(props){
    super(props);
    this.count = this.count.bind(this);
    this.state ={
      contactCount: 0,
      eventCount: 0,
    }
  }
  componentDidMount(){
    this.count();
  }

  async count(){ 
    let count1 = 0;
    let count2 = 0;
    let month = new Date().getMonth();
    await axios.get('contacts/getcontact')
          .then(res => {
                let data = res.data
                data.forEach(contact => {
                  let thismonth = new Date(contact.date);
                  if(thismonth.getMonth() === month){
                    count1++;
                  }
                  if(contact.Recent_Event !== ''){
                    count2++
                  }
                });
              })
          .catch(function(error){
                console.log(error);
            });
    await axios.get('groups/getgroup')
            .then(res => {
              let newdata  = res.data;
              newdata.forEach(group => {
                if (group.Events !== []){
                group.Events.forEach(event => {
                  count2++
                })}
              })
            })
            .catch(function(error){
              console.log(error);
            });
            this.setState({
              contactCount: count1,
              eventCount: count2
            })
    }


    render() {
        const times = new Date()
        let time = times.toLocaleTimeString()
        let date = times.toLocaleDateString()
        return (
            <Card className='dash-card card-accent-info shadow-sm'>
                {/*Analysis Summary display */}
                <CardHeader>
                  <span>Analysis Summary</span>
                  <div className="card-header-actions">
                  <Link to="/analysis">
                    <Button outline className='card-header-action' id='modalbtn'><i className='fa fa-location-arrow'></i> </Button>
                  </Link>
                  </div>
                </CardHeader>
                <CardBody className='pt-0 mt-3'>
                  <h6 className='card3-head'> <strong>This Month </strong> <small className='text-muted'>&nbsp;{`updated ${date} ${time}`}</small></h6>
                  <hr className='mb-3 mt-1 break1 text-left' id='analysis_sum_break'/>
                  <Row className='mb-0 pb-0'>
                    <Col md='6'>
                      <h6 className='text-muted monthsum'><i className="fa fa-user-plus mr-2"></i> New Friends Added</h6>
                      <h6 className='text-muted'><i className="fa fa-comments mr-2"></i> New Events Shared</h6> 
                    </Col>
                    <Col color='secondary' md='6' className='text-right'>
                      <h6 className='text-muted monthsum'><strong>{this.state.contactCount}</strong></h6>
                      <h6 className='text-muted'><strong>{this.state.eventCount}</strong></h6>
                    </Col>
                  </Row>
                  <hr className='mt-1 pt-0 mb-3'/>
                  <h6 className='card3-head'><strong> Mostly Active </strong></h6>
                  <hr className='mb-3 mt-1 break2 text-left' id='analysis_sum_break'/>
                  <Row className='mb-0 pb-0'>
                    <Col md='2'>
                      <div className="avatar pr-0 mr-0">
                        <img className="img-avatar" src="assets/img/avatars/4.jpg" alt="admin@bootstrapmaster.com"></img>
                      </div>
                    </Col>
                    <Col md='4' className= 'pl-0 ml-0'>
                      <div className='pt-2 pl-0 ml-0'>Megan Stanley</div>
                    </Col>
                    <Col md='6' className='text-right'>
                      <div>
                      <small className="text-muted">
                        <i className="icon-social-skype"></i>&nbsp; 8 Tags
                      </small>
                      </div>
                      <div>
                      <small className="text-muted">
                        <i className="icon-calendar"></i>&nbsp; 3 Group Events
                      </small>
                      </div>                     
                    </Col>                    
                  </Row>
                  <hr className='mt-1 pt-0 mb-3 pb-0'/>
                  <Row className='mb-0 pb-0'>
                    <Col md='2'>
                      <div className="avatar pr-0 mr-0">
                        <img className="img-avatar" src="assets/img/avatars/4.jpg" alt="admin@bootstrapmaster.com"></img>
                      </div>
                    </Col>
                    <Col md='4' className= 'pl-0 ml-0'>
                      <div className='pt-2 pl-0 ml-0'>Megan Stanley</div>
                    </Col>
                    <Col md='6' className='text-right'>
                      <div>
                      <small className="text-muted">
                        <i className="icon-social-skype"></i>&nbsp; 8 Tags
                      </small>
                      </div>
                      <div>
                      <small className="text-muted">
                        <i className="icon-calendar"></i>&nbsp; 3 Group Events
                      </small>
                      </div>                     
                    </Col>                    
                  </Row>
                  <hr className='mt-1 pt-0 mb-3 pb-0'/>
                  <Row>
                    <Col md='2'>
                      <div className="avatar pr-0 mr-0">
                        <img className="img-avatar" src="assets/img/avatars/4.jpg" alt="admin@bootstrapmaster.com"></img>
                      </div>
                    </Col>
                    <Col md='4' className= 'pl-0 ml-0'>
                      <div className='pt-2 pl-0 ml-0'>Megan Stanley</div>
                    </Col>
                    <Col md='6' className='text-right'>
                      <div>
                      <small className="text-muted">
                        <i className="icon-social-skype"></i>&nbsp; 8 Tags
                      </small>
                      </div>
                      <div>
                      <small className="text-muted">
                        <i className="icon-calendar"></i>&nbsp; 3 Group Events
                      </small>
                      </div>
                      
                    </Col>
                  </Row>
                  <hr className='mt-1 pt-0 mb-0 pb-2'/>

                </CardBody>
              </Card>
        )
    }
}

export default RecentSummary
