/**
 * Author: luotao
 * Date: 2018-03-26 14:28:33
 * Desc: 图片懒加载
 */
import React,{ PureComponent} from 'react';
import lozad from 'lozad';

import imageDefault from '../../../assets/img/imageDefault.png';

export default class LazyImg extends React.Component {

  constructor(props) {
    super(props);
  }

  render (){
    return (
      <img
        className="lozad "
        {...this.props}
        onError={(e)=>{
          this.imageError(e);
        }}
      />
    )
  }

  componentDidMount(){
    const observer = lozad();//懒加载初始化
    observer.observe();
  }

  imageError(e){
    e.target.src = imageDefault;
  }
}
