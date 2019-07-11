import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span> 2019 NUS Orbital Project. &nbsp;<a href="https://github.com/Criss-Wang/TeamRichardoMLu" disabled><i className='fa fa-github UrlLink2'></i></a></span>
        <span className="ml-auto">Powered by <a href ='https://coreui.io/' disabled>CoreUI</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
