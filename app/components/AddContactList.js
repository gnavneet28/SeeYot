import React from "react";
import { StyleSheet, Dimensions, View, RefreshControl } from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import Ionicons from "react-native-vector-icons/Ionicons";

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
            dim.height = 70;
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
        dataProvider: newData,
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

  _rowRenderer(type, data) {
    switch (type) {
      case ViewTypes.Full:
        return (
          <AddContactCard
            isRegistered={data.isRegistered}
            name={data.name}
            onInvitePress={() => this.props.onInvitePress(data)}
            onPress={() => this.props.onAddPress(data)}
            phoneNumber={data.phoneNumber}
          />
        );
      default:
        return null;
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.users.length != this.props.users.length) {
      return this.setState({
        ...this.state,
        dataProvider: this.state.dataProvider.cloneWithRows(this.props.users),
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
              onChangeText={(text) => this.handleChange(text)}
              placeholder="Search in your contacts..."
              style={styles.inputBox}
            />
          </View>
          {/* {this.props.users.length < 1 && this.state.searchTerm ? (
            <AppText subStyle={{ textAlign: "center" }}>
              No result found!
            </AppText>
          ) : null} */}
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

const styles = StyleSheet.create({
  container: {
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: 25,
    borderWidth: 1,
    marginVertical: 5,
    overflow: "hidden",
    width: "95%",
  },
  inputBoxContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: 50,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
  },
  inputBox: {
    flexShrink: 1,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
  listView: {
    flex: 1,
    width: "100%",
  },
});

export default AddContactList;
