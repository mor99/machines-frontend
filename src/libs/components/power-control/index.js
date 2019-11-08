import React, {PureComponent,} from "react";
import PropTypes from "prop-types";

class PowerControl extends PureComponent{
  render(){
    const {type,actions,id,children:Children,} = this.props;
    const hadPower = actions.find(z => z.value === id);
    console.info(44,id, type, Children);
    if (hadPower) {
      return () => <Children />;
    } else if(type === "hidden"){
      return null;
    } else {
      return () => (
        <Children
          disable={true}
          onClick={() => {console.info(11);}}
        />
      );
    }
  }
}
PowerControl.propTypes = {
  id: PropTypes.string.isRequired, // 操作的key
  type: PropTypes.oneOf(["hidden","disabled"])
};

PowerControl.defaultProps = {
  actions: [],
  type: "hidden",
};

export default PowerControl;
