import React from "react";
import { Dimensions, View, ActivityIndicator } from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import { ScaledSheet, scale } from "react-native-size-matters";

import ContactCard from "./ContactCard";

import defaultStyles from "../config/styles";

const ViewTypes = {
  Full: 0,
};

const defaultListItemWhenEmpty = [
  {
    _id: "abcdefgh",
  },
];

class VipSearchResultList extends React.Component {
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

  _rowRenderer(type, data, index) {
    switch (type) {
      case ViewTypes.Full:
        return (
          <ContactCard
            onAddEchoPress={this.props.onAddEchoPress}
            onSendThoughtsPress={this.props.onSendThoughtsPress}
            onImagePress={() => this.props.onImagePress(data)}
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
        <View style={styles.listView}>
          {this.props.isLoading ? (
            <ActivityIndicator
              animating={this.props.isLoading}
              color={defaultStyles.colors.dark_Variant}
              size={scale(22)}
            />
          ) : null}
          <RecyclerListView
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
    flex: 1,
    width: "100%",
  },
});

export default VipSearchResultList;
