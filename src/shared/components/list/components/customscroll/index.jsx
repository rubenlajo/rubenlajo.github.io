import React, { Component } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import PropTypes from "prop-types";

import "./styles.css";

const propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  offsetTop: PropTypes.number,
  scrollBottomTrigger: PropTypes.func,
  scrollThreshold: PropTypes.number,
};

class CustomScroll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollActive: false,
      alreadyCalledLoadMore: false,
    };

    this.id = `customScroll-${new Date().getTime()}`;

    this.firstLoad = true;

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  componentDidMount() {
    this.firstLoad = true;
  }

  componentDidUpdate() {
    const { offsetTop } = this.props;
    if (this.firstLoad && offsetTop) {
      // eslint-disable-next-line react/no-string-refs
      this.refs[this.id].scrollTop(offsetTop);
      this.firstLoad = false;
    }
  }

  handleUpdate(values) {
    const { scrollHeight, clientHeight } = values;
    if (scrollHeight > clientHeight) {
      this.setState({ scrollActive: true });
    } else {
      this.setState({ scrollActive: false });
    }
  }

  handleOnScroll() {
    const { scrollBottomTrigger, scrollThreshold } = this.props;
    const { alreadyCalledLoadMore } = this.state;
    const values = this.refs[this.id].getValues();
    if (scrollBottomTrigger && values.top >= scrollThreshold && !alreadyCalledLoadMore) {
      this.setState({ alreadyCalledLoadMore: true });
      scrollBottomTrigger();
      setTimeout(() => {
        this.setState({ alreadyCalledLoadMore: false });
      }, 1000);
    }
  }

  render() {
    const { className, children } = this.props;
    const { scrollActive } = this.state;
    return (
      <Scrollbars
        {...this.props}
        onScroll={this.handleOnScroll}
        onUpdate={this.handleUpdate}
        className={`custom-scroll ${className || ""} ${scrollActive ? "scroll-visible" : "scroll-hidden"}`}
        ref={this.id}
        // autoHide
      >
        <div className="scroll-content">{children}</div>
      </Scrollbars>
    );
  }
}

CustomScroll.propTypes = propTypes;

CustomScroll.defaultProps = {
  scrollThreshold: 0.9,
};

export default CustomScroll;
