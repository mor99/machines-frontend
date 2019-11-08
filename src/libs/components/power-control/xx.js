import React from 'react';
const Power  = (config) => WrappedComponent => class extends WrappedComponent {
  render() {
    console.info(111, config);
    return (
      super.render()
    );
  }
};
export default Power;
