import React from "react";
import { Dimensions, View, TouchableWithoutFeedback } from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import { ScaledSheet, scale } from "react-native-size-matters";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";

import InviteUserCard from "./InviteUserCard";
import AppTextInput from "./AppTextInput";
import defaultStyles from "../config/styles";

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
        searchTerm: "",
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
      searchTerm: text,
      dataProvider: newList.length
        ? newDataProvider.cloneWithRows(newList)
        : newDataProvider.cloneWithRows(defaultListItemWhenEmpty),
    });
  }

  _rowRenderer(type, data) {
    switch (type) {
      case ViewTypes.Full:
        return (
          <TouchableWithoutFeedback onPress={this.props.onPress}>
            <InviteUserCard
              //onInvitePress={this.props.onInvitePress}
              groupName={this.props.groupName}
              contact={data}
            />
          </TouchableWithoutFeedback>
        );
      default:
        return null;
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.users.length != this.props.users.length) {
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
                value={this.state.searchTerm}
                maxLength={10}
                onChangeText={(text) => this.handleChange(text)}
                placeholder="Search in your friendslist..."
                style={styles.inputBox}
              />
            </View>
          </View>
        </View>
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
      </>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    borderWidth: 1,
    marginVertical: "8@s",
    overflow: "hidden",
    width: "95%",
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
    justifyContent: "center",
    width: "100%",
  },
});

export default InviteUserList;
