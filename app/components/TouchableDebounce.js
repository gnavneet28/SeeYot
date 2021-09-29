import React from "react";
import { ViewPropTypes, TouchableHighlight } from "react-native";
import PropTypes from "prop-types";
import debounce from "../utilities/debounce";

//PureComponent handles shouldComponentUpdate for you.
// class TouchableDebounce extends React.PureComponent {
//   constructor(props) {
//     super(props);
//   }
//   handlePress = () => {
//     const { onPress, debounceTime, handleFirstTap } = this.props;
//     debounce(onPress, debounceTime, handleFirstTap);
//   };
//   render() {
//     return (
//       <TouchableHighlight
//         style={this.props.style}
//         {...this.props}
//         onPress={this.handlePress}
//       >
//         {this.props.children}
//       </TouchableHighlight>
//     );
//   }
// }

const TouchableDebounce = ({
  onPress,
  style,
  handleFirstTap = true,
  timeOut = 500,
  children,
  ...otherProps
}) => {
  const handlePress = () => {
    return debounce(onPress, timeOut, handleFirstTap);
  };

  return (
    <TouchableHighlight {...otherProps} style={style} onPress={handlePress}>
      {children}
    </TouchableHighlight>
  );
};

export default TouchableDebounce;
