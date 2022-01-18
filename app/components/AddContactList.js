import React from "react";
import { Dimensions, View, RefreshControl } from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ScaledSheet, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";

import AppTextInput from "./AppTextInput";
import AddContactCard from "./AddContactCard";

const ViewTypes = {
  Full: 0,
};

const defaultListItemWhenEmpty = [
  {
    _id: "abcdefgh",
  },
];

class AddContactList extends React.Component {
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
            dim.height = scale(56);
            break;
          default:
            dim.width = 0;
            dim.height = 0;
        }
      }
    );

    this._rowRenderer = this._rowRenderer.bind(this);

    this.state = {
      defaultUsers: this.props.users,
      users: this.props.users,
      dataProvider: this.props.users.length
        ? dataProvider.cloneWithRows(this.props.users)
        : dataProvider.cloneWithRows(defaultListItemWhenEmpty),
      searchTerm: "",
    };
  }

  handleChange(text) {
    if (!text.length) {
      let newData = this.state.dataProvider.cloneWithRows(
        this.state.defaultUsers
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

    const newList = this.state.defaultUsers
      .filter(
        (u) =>
          u.name.substring(0, text.length).toLowerCase() == text.toLowerCase()
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

  registeredUsersLength(users) {
    return users.filter((u) => u.isRegistered === true).length;
  }

  _rowRenderer(type, data) {
    switch (type) {
      case ViewTypes.Full:
        return (
          <AddContactCard
            contact={data}
            onInvitePress={() => this.props.onInvitePress(data)}
          />
        );
      default:
        return null;
    }
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.users.length != this.props.users.length ||
      this.registeredUsersLength(prevProps.users) !=
        this.registeredUsersLength(this.props.users) ||
      prevProps.users != this.props.users
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
      <>
        <View style={[styles.mainContainer, this.props.style]}>
          <View style={styles.container}>
            <View style={styles.inputBoxContainer}>
              <Ionicons
                color={defaultStyles.colors.yellow_Variant}
                name="search-sharp"
                size={scale(22)}
              />
              <AppTextInput
                maxLength={10}
                onChangeText={(text) => this.handleChange(text)}
                placeholder="Search in your contacts..."
                style={styles.inputBox}
              />
            </View>
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
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.light,
    borderRadius: "25@s",
    borderWidth: 1,
    marginVertical: "8@s",
    overflow: "hidden",
    width: "90%",
  },
  inputBoxContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: "32@s",
    justifyContent: "space-between",
    paddingHorizontal: "10@s",
    width: "100%",
  },
  inputBox: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "20@s",
    flexShrink: 1,
    height: "30@s",
    marginHorizontal: "5@s",
    paddingHorizontal: "10@s",
    width: "100%",
  },
  listView: {
    flex: 1,
    width: "100%",
  },
  mainContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderBottomColor: defaultStyles.colors.lightGrey,
    borderBottomWidth: "1@s",
    justifyContent: "center",
    width: "100%",
  },
});

export default AddContactList;
