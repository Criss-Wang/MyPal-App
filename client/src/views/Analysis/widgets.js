
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {Row, Col, Card, CardBody } from 'reactstrap';

import classNames from 'classnames';

import { mapToCssModules } from 'reactstrap/lib/utils';



const propTypes = {

  header: PropTypes.string,

  mainText: PropTypes.string,

  icon: PropTypes.string,

  val:PropTypes.string,

  color: PropTypes.string,

  variant: PropTypes.string,

  footer: PropTypes.bool,

  link: PropTypes.string,

  children: PropTypes.node,

  className: PropTypes.string,

  cssModule: PropTypes.object,

};



class Widget extends Component {

  render() {

    const { className, cssModule, header, mainText, icon, color, footer, link, children, val, variant, ...attributes } = this.props;



    // demo purposes only

    const padding = (variant === '0' ? { card: 'p-3', icon: 'p-3', lead: 'mt-2' } : (variant === '1' ? {

      card: 'p-0', icon: 'p-4', lead: 'pt-3',

    } : { card: 'p-0', icon: 'p-4 px-5', lead: 'pt-3' }));



    const card = { style: 'clearfix', color: color, icon: icon, classes: '', val:val };

    card.classes = mapToCssModules(classNames(className, card.style, padding.card), cssModule);



    const lead = { style: 'h5 mb-0', color: color, classes: '' };

    lead.classes = classNames(lead.style, 'text-' + card.color, padding.lead);



    const blockIcon = function (icon) {

      const classes = classNames(icon, 'bg-' + card.color, padding.icon, 'font-2xl mr-3 float-left');

      return (<i className={classes}></i>);

    };

    const change = function (value) {
        if (parseInt(value) === 0) { return <div> </div>}
        return ((parseInt(value) > 0 )?
        <div className='text-right' style={{ color: 'grey' }}><i className="fa fa-long-arrow-up" ></i> {value} <div className='this-month'>this month</div></div>:
        <div className='text-right' style={{ color: 'grey' }}><i className="fa fa-long-arrow-down" ></i> {Math.abs(parseInt(value))} <div className='this-month'>this month</div></div>);
      };

    return (

      <Card>

        <CardBody className={card.classes} {...attributes}>

          {blockIcon(card.icon)}
          <Row>
              <Col xs='6'>
                <div className={lead.classes}>{header}</div>
                <div className="text-muted mt-1 font-weight-bold font-xs">{mainText}</div>
             </Col>
             <Col xs='6' className='mt-3'>
                {change(card.val)}
             </Col>
          </Row>
          
        </CardBody>

      </Card>

    );

  }

}

Widget.propTypes = propTypes;
export default Widget;