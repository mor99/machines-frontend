import React, { PureComponent, } from "react";
import { DatePicker, } from "antd";

export default class YearPicker extends PureComponent {
  constructor(props) {
    super(props);
    const year = YearPicker.formatData(props.value);
    this.state = {
      showYear: false,
      year,
    }
  }
  render() {
    const { year, showYear, } = this.state;
    const { width, otherParams,placeholder, } = this.props;
    return (
      <DatePicker
        {...otherParams}
        placeholder={placeholder}
        format="YYYY"
        mode="year"
        value={year}
        open={showYear}
        onPanelChange={this.changeYear}
        onChange={this.changeValue}
        onFocus={() => {
          this.setState({
            showYear: true,
          });
        }}
        onBlur={() => {
          this.setState({
            showYear: false,
          });
        }}
        style={{ width, }}
      />
    );
  }
  changeValue = (e) => {
    const { onChange, } = this.props;
    const year = e === null ? null : moment(e).format("YYYY");
    this.setState({
      year: e,
      showYear: false,
    });
    onChange(year);
  };
  // 选择年份
  changeYear = (e) => {
    const { onChange, } = this.props;
    const year = moment(e).format("YYYY");
    this.setState({
      year,
      showYear: false,
    });
    onChange(year);
  }
  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      const year = YearPicker.formatData(nextProps.value);
      this.setState({
        year,
      });
    }
  }
  static formatData(val) {
    if (val) {
      const isMoment = val.constructor.name === "Moment";
      if (isMoment) {
        return moment(val);
      } else {
        const match = val.match(/\d{4}/);
        return match && match[0] ? moment(`${match[0]}-01-01 00:00:00`) : null;
      }
    }
    return val;
  }
}
