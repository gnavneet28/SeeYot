import React from "react";
import { StyleSheet, Dimensions, View, RefreshControl } from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ScaledSheet, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";

import AppTextInput from "./AppTextInput";
import ReplyCard from "./ReplyCard";

const ViewTypes = {
  Full: 0,
};

const defaultListItemWhenEmpty = [
  {
    _id: "abcdefgh",
  },
];

class RepliesList extends React.Component {
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
            dim.height = scale(150);
            break;
          default:
            dim.width = width;
            dim.height = scale(150);
        }
      }
    );

    this._rowRenderer = this._rowRenderer.bind(this);

    this.state = {
      defaultReplies: this.props.replies,
      replies: this.props.replies,
      dataProvider: this.props.replies.length
        ? dataProvider.cloneWithRows(this.props.replies)
        : dataProvider.cloneWithRows(defaultListItemWhenEmpty),
      searchTerm: "",
    };
  }

  handleChange(text) {
    if (!text.length) {
      let newData = this.state.dataProvider.cloneWithRows(
        this.state.defaultReplies
      );

      return this.setState({
        ...this.state,
        dataProvider: newData.getSize()
          ? newData
          : this.state.dataProvider.cloneWithRows(defaultListItemWhenEmpty),
      });
    }

    this.setState({
      ...this.state,
      searchTerm: text,
    });

    const newList = this.state.defaultReplies
      .filter(
        (r) =>
          r.createdFor.name.substring(0, text.length).toLowerCase() ==
          text.toLowerCase()
      )
      .sort();

    let newDataProvider = this.state.dataProvider;
    this.setState({
      ...this.state,
      dataProvider: newList.length
        ? newDataProvider.cloneWithRows(newList)
        : newDataProvider.cloneWithRows(defaultListItemWhenEmpty),
    });
  }

  _rowRenderer(type, data) {
    switch (type) {
      case ViewTypes.Full:
        return (
          <ReplyCard
            message={data}
            onDeletePress={() => this.props.onDeletePress(data)}
            onModalOpenPress={() => this.props.onModalOpenPress(data)}
          />
        );
      default:
        return null;
    }
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.replies.length != this.props.replies.length ||
      prevProps.replies != this.props.replies
    ) {
      return this.setState({
        ...this.state,
        defaultReplies: this.props.replies,
        dataProvider: this.props.replies.length
          ? this.state.dataProvider.cloneWithRows(this.props.replies)
          : this.state.dataProvider.cloneWithRows(defaultListItemWhenEmpty),
      });
    }
  }

  render() {
    return (
      <>
        <View style={[styles.container, this.props.style]}>
          <View style={styles.inputBoxContainer}>
            <Ionicons
              color={defaultStyles.colors.yellow_Variant}
              name="search-sharp"
              size={25}
            />
            <AppTextInput
              maxLength={10}
              onChangeText={(text) => this.handleChange(text)}
              placeholder="Search people who replied you..."
              style={styles.inputBox}
            />
          </View>
        </View>
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
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "25@s",
    borderWidth: 1,
    elevation: 2,
    marginVertical: "8@s",
    overflow: "hidden",
    width: "95%",
  },
  inputBoxContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: "38@s",
    justifyContent: "space-between",
    paddingHorizontal: "10@s",
    width: "100%",
  },
  inputBox: {
    borderRadius: "20@s",
    flexShrink: 1,
    height: "36@s",
    marginHorizontal: "5@s",
    paddingHorizontal: "10@s",
    width: "100%",
  },
  listView: {
    flex: 1,
    width: "100%",
  },
});

export default RepliesList;
