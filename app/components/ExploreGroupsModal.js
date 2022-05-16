import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import defaultStyles from "../config/styles";

import DropdownSelect from "./DropdownSelect";
import AppModal from "./AppModal";
import AppHeader from "./AppHeader";
import defaultProps from "../utilities/defaultProps";
import MyGroupsListPro from "./MyGroupsListPro";
import InfoAlert from "./InfoAlert";

import apiActivity from "../utilities/apiActivity";

import groupsApi from "../api/groups";
import AppActivityIndicator from "./ActivityIndicator";
import useAuth from "../auth/useAuth";

const filterSubCategory = (category) => {
  if (category == "Entertainment")
    return ["All", ...defaultProps.categoriesData.entertainmentCategory];
  else if (category == "Art")
    return ["All", ...defaultProps.categoriesData.artCategory];
  else if (category == "Food")
    return ["All", ...defaultProps.categoriesData.foodCategory];
  else if (category == "Relationship")
    return ["All", ...defaultProps.categoriesData.relationShipCategory];
  else if (category == "Wellness and Care")
    return ["All", ...defaultProps.categoriesData.wellnessCategory];
  else if (category == "Jobs")
    return ["All", ...defaultProps.categoriesData.jobsCategory];
};

const ExploreGroupsModal = ({
  visible,
  handleCloseModal,
  onAddEchoPress,
  onSendThoughtsPress,
  onGroupSelection,
}) => {
  const { tackleProblem } = apiActivity;
  const { user } = useAuth();

  const [isReady, setIsReady] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [defaultGroups, setDefaultGroups] = useState([]);
  const [category, setCategory] = useState("Entertainment");
  const [subCategory, setSubCategory] = useState("");
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  const handleCloseInfoAlert = () =>
    setInfoAlert({ showInfoAlert: "false", infoAlertMessage: "" });

  let isUnmounting = false;

  useEffect(() => {
    return () => (isUnmounting = false);
  }, []);

  const getGroups = async (category) => {
    if (!isUnmounting) {
      setCategory(category);
      setIsReady(false);
    }
    const { ok, data, problem } = await groupsApi.exploreGroups(category);
    if (!isUnmounting && ok) {
      setGroups(data);
      setDefaultGroups(data);
      return setIsReady(true);
    }

    if (!isUnmounting) {
      setIsReady(true);
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  useEffect(() => {
    if (!isUnmounting) {
      getGroups(category);
      setSubCategories(filterSubCategory(category));
      setSubCategory("All");
    }
  }, [category]);

  const filterGroups = (subCategory) => {
    setSubCategory(subCategory);
    if (subCategory == "All") return setGroups(defaultGroups);
    let newGroupsList = defaultGroups.filter(
      (g) => g.subCategory == subCategory
    );
    setGroups(newGroupsList);
  };

  return (
    <>
      <AppModal
        visible={visible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <AppHeader
          title="Explore"
          leftIcon="arrow-back"
          onPressLeft={handleCloseModal}
        />
        <View style={styles.container}>
          <View style={styles.categorySelectorContainer}>
            <DropdownSelect
              selected={category}
              containerStyle={styles.categoryDropdownOne}
              data={defaultProps.categoriesData.categories}
              onOptionSelection={setCategory}
            />
            <DropdownSelect
              selected={subCategory}
              onOptionSelection={filterGroups}
              data={subCategories}
              defaultPlaceholder={"Select Subcategory"}
            />
          </View>
          {!isReady ? (
            <AppActivityIndicator />
          ) : (
            <MyGroupsListPro
              inputBoxStyle={styles.inputBoxStyle}
              onAddEchoPress={onAddEchoPress}
              onSendThoughtsPress={onSendThoughtsPress}
              groups={groups}
              user={user}
              onVisitGroupPress={onGroupSelection}
              placeholder={"Search groups..."}
            />
          )}
        </View>
      </AppModal>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.white,
    flex: 1,
    width: defaultStyles.width,
  },
  categorySelectorContainer: {
    backgroundColor: defaultStyles.colors.light,
    flexDirection: "row",
    paddingBottom: "2@s",
    paddingHorizontal: "10@s",
    paddingTop: "10@s",
  },
  categoryDropdownOne: {
    marginRight: "10@s",
  },
  inputBoxStyle: {
    borderRadius: "7@s",
  },
});

export default ExploreGroupsModal;
