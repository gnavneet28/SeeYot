import React from "react";
import { Dimensions, View, TouchableWithoutFeedback } from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import { ScaledSheet, scale } from "react-native-size-matters";

import InviteUserCard from "./InviteUserCard";

const ViewTypes = {
  Full: 0,
};

const defaultListItemWhenEmpty = [
  {
    _id: "abcdefgh",
  },
];

class InviteUserList extends React.Component {
  constructor(props) {
    super(props);

    let { width } = Dimensions.get("window");

    let dataProvider = new DataProvider((r1, r2) => {
      return r1._id != r2._id;
    });

    this._layoutProvider = new LayoutProvider(
      (index) => {
        return ViewTypes.Full;
      },
      (type, dim) => {
        switch (type) {
          case ViewTypes.Full:
            dim.width = width;
            dim.height = scale(46);
            break;
          default:
            dim.width = 0;
            dim.height = 0;
        }
      }
    );

    this._rowRenderer = this._rowRenderer.bind(this);

    this.state = {
      users: this.props.users,
      dataProvider: this.props.users.length
        ? dataProvider.cloneWithRows(this.props.users)
        : dataProvider.cloneWithRows(defaultListItemWhenEmpty),
    };
  }

  _rowRenderer(type, data) {
    switch (type) {
      case ViewTypes.Full:
        return (
          <TouchableWithoutFeedback onPress={this.props.onPress}>
            <InviteUserCard groupName={this.props.groupName} contact={data} />
          </TouchableWithoutFeedback>
        );
      default:
        return null;
    }
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.users.length != this.props.users.length ||
      prevProps.groupName != this.props.groupName
    ) {
      return this.setState({
        ...this.state,
        dataProvider: this.props.users.length
          ? this.state.dataProvider.cloneWithRows(this.props.users)
          : this.state.dataProvider.cloneWithRows(defaultListItemWhenEmpty),
      });
    }
  }

  render() {
    return (
      <View style={styles.listView}>
        <RecyclerListView
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
            keyboradShouldPersistTaps: "handled",
          }}
          dataProvider={this.state.dataProvider}
          extendedState={this.state}
          layoutProvider={this._layoutProvider}
          rowRenderer={this._rowRenderer}
        />
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  listView: {
    flex: 1,
    width: "100%",
  },
});

export default InviteUserList;
