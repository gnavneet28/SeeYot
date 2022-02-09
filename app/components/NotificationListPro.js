import React from "react";
import { Dimensions, View, RefreshControl } from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import { ScaledSheet, scale } from "react-native-size-matters";

import NotificationCard from "./NotificationCard";
import defaultStyles from "../config/styles";

const ViewTypes = {
  Full: 0,
};

const defaultListItemWhenEmpty = [
  {
    _id: "abcdefgh",
  },
];

class NotificationListPro extends React.Component {
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
            dim.height = scale(60);
            break;
          default:
            dim.width = 0;
            dim.height = 0;
        }
      }
    );

    this._rowRenderer = this._rowRenderer.bind(this);

    this.state = {
      notifications: this.props.notifications,
      dataProvider: this.props.notifications.length
        ? dataProvider.cloneWithRows(this.props.notifications)
        : dataProvider.cloneWithRows(defaultListItemWhenEmpty),
    };
  }

  _rowRenderer(type, data, index) {
    switch (type) {
      case ViewTypes.Full:
        return (
          <NotificationCard
            isConnected={this.props.isConnected}
            index={index}
            tapToSeeMessage={this.props.onTapToSeeMessage}
            onTapToSeePress={this.props.onTapToSeePress}
            notification={data}
            tapToSendMessage={this.props.onTapToSendMessage}
            tapToSeeMatchedThought={this.props.onTapToSeeMatchedThought}
          />
        );
      default:
        return null;
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.notifications != this.props.notifications) {
      return this.setState({
        ...this.state,
        dataProvider: this.props.notifications.length
          ? this.state.dataProvider.cloneWithRows(this.props.notifications)
          : this.state.dataProvider.cloneWithRows(defaultListItemWhenEmpty),
      });
    }
  }

  render() {
    return (
      <>
        <View style={styles.listView}>
          <RecyclerListView
            refreshControl={
              <RefreshControl
                onRefresh={this.props.onRefresh}
                refreshing={this.props.refreshing}
              />
            }
            canChangeSize={true}
            dataProvider={this.state.dataProvider}
            extendedState={this.state}
            layoutProvider={this._layoutProvider}
            rowRenderer={this._rowRenderer}
          />
        </View>
      </>
    );
  }
}

const styles = ScaledSheet.create({
  listView: {
    borderTopColor: defaultStyles.colors.light,
    borderTopWidth: 1,
    flex: 1,
    width: "100%",
  },
});

export default NotificationListPro;
