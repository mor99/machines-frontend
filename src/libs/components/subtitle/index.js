/**
 * Author: ry
 * Date: 2018/10/13 09:50
 * Desc: 二级标题
 */
import React, {PureComponent} from "react";

export default class Subtitle extends PureComponent {

  render() {
    const { title,} = this.props;
    return (
      <div className="common-subtitle">
        <span>{title}</span>
      </div>
    );
  }
}
