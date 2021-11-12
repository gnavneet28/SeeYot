import React from "react";
import { StyleSheet, Dimensions, View, RefreshControl } from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import Ionicons from "react-native-vector-icons/Ionicons";

import defaultStyles from "../config/styles";

import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import AddFavoriteCard from "./AddFavoriteCard";

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
            dim.height = 64;
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

  _rowRenderer(type, data) {
    switch (type) {
      case ViewTypes.Full:
        return (
          <AddFavoriteCard
            favoriteUser={data}
            name={data.name}
            onMessagePress={() => this.props.onMessagePress(data)}
            processing={this.props.processing}
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
        defaultUsers: this.props.users,
        dataProvider: this.props.users.length
          ? this.state.dataProvider.cloneWithRows(this.props.users)
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
              placeholder="Search..."
              style={styles.inputBox}
            />
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <AppText style={styles.favoritePeople}>Favorite People</AppText>
          <AppText
            onPress={this.props.onAllRepliesPress}
            style={styles.allReplies}
          >
            All Replies
          </AppText>
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
  allReplies: {
    alignSelf: "flex-end",
    backgroundColor: defaultStyles.colors.dark_Variant,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    color: defaultStyles.colors.yellow_Variant,
    height: 35,
    marginVertical: 5,
    paddingHorizontal: 20,
    textAlignVertical: "center",
  },
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: 25,
    borderWidth: 1,
    elevation: 2,
    marginVertical: 8,
    overflow: "hidden",
    width: "95%",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  favoritePeople: {
    color: defaultStyles.colors.blue,
    height: 35,
    marginVertical: 5,
    paddingHorizontal: 20,
    textAlignVertical: "center",
  },
  inputBoxContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: 42,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
  },
  inputBox: {
    borderRadius: 20,
    flexShrink: 1,
    height: 40,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
  listView: {
    flex: 1,
    marginTop: 10,
    width: "100%",
  },
});

export default AddContactList;
