import React from "react";
import { Dimensions, View } from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppText from "./AppText";
import ContactCard from "./ContactCard";

const ViewTypes = {
  Full: 0,
};

const defaultListItemWhenEmpty = [
  {
    _id: "abcdefgh",
  },
];

class ActiveUsersList extends React.Component {
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
            dim.height = scale(70);
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
          <ContactCard
            //onAddFriendPress={this.props.onAddFriendPress}
            onAddEchoPress={() => this.props.onAddEchoPress(data)}
            onSendThoughtsPress={() => this.props.onSendThoughtsPress(data)}
            // onImagePress={() => this.props.onImagePress(data)}
            user={data}
          />
        );
      default:
        return null;
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.users != this.props.users) {
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
      <>
        {!this.props.users.length ? (
          <View style={styles.emptyActiveUsersInfoContainer}>
            <AppText style={styles.emptyActiveUsersListInfo}>
              No active users were found at the moment.
            </AppText>
          </View>
        ) : null}
        <View style={styles.listView}>
          <RecyclerListView
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
            }}
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
  emptyActiveUsersInfoContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  emptyActiveUsersListInfo: {
    fontSize: "14@s",
    marginBottom: "20@s",
    textAlign: "center",
    width: "80%",
  },
  listView: {
    flex: 1,
    width: "100%",
  },
});

export default ActiveUsersList;
