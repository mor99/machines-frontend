import React, {PureComponent,} from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import {isObject,} from "../../../util/helpers";

export default class BottomBtn extends PureComponent{
  constructor(props) {
    super(props);
  }
  static propTypes = {
    actionItems: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          type: PropTypes.oneOf(['primary','dashed','danger']),
          onClick: PropTypes.func,
          icon: PropTypes.node,
          disabled: PropTypes.boolean,
        }),
      ),
      PropTypes.shape({
        title: PropTypes.string,
        type: PropTypes.oneOf(['primary','dashed','danger']),
        onClick: PropTypes.func,
        icon: PropTypes.node,
        disabled: PropTypes.boolean,
      })
    ]).isRequired,
  };
  static defaultProps = {
    actionItems: [
      {
        title: "提交",
        type: "primary",
      },
    ],
  };
  render() {
    return (
      <div className="common-form-submit-box">
        <div
          className="common-form-submit"
          id="common-submit-btn"
        >
          {
            this.generateBtn()
          }
        </div>
      </div>
    );
  }
  generateBtn = () => {
    const {actionItems,} = this.props;
    let items = isObject(actionItems) ? [actionItems] : actionItems;
    return items.map((z,i) => {
      return (
        <Button
          onClick={z.onClick.bind(this)}
          disabled={z.disabled}
          type={z.type || 'primary'}
          key={z.title || i}
        >
          {z.title || "提交"}
        </Button>
      );
    });
  };
  componentDidMount() {
    document.addEventListener("scroll", this.setBtnStyle)
  }
  componentWillUnmount() {
    document.removeEventListener("scroll", this.setBtnStyle);
  }
  setBtnStyle = () => {
    const el = document.querySelector("#common-submit-btn");
    const root = document.querySelector("html");
    const windowHeight = document.body.clientHeight;
    const scrollHeight = document.body.scrollHeight;
    if (windowHeight + root.scrollTop + el.clientHeight < scrollHeight) {
      requestAnimationFrame(
        () => {
          el.style.left = "3.08rem";
          el.style.width = 'calc(100% - 3.56rem)';
          el.style.position = 'fixed';
        }
      );
    } else if (windowHeight + root.scrollTop + el.clientHeight >= scrollHeight) {
      requestAnimationFrame(
        () => {
          el.style.width = "100%";
          el.style.position = 'static';
        }
      );
    }
  }
}


