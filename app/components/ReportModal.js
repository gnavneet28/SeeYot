import React, { memo, useState } from "react";
import { View, Modal, TextInput } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";

import defaultStyles from "../config/styles";

import AppText from "./AppText";
import AppButton from "./AppButton";
import Backdrop from "./Backdrop";

function ReportModal({
  handleProblemSubmitPress,
  isLoading,
  openReport,
  problemDescription,
  setOpenReport,
  setProblemDescription,
}) {
  const [height, setHeight] = useState(0);

  return (
    <Modal
      animationType="slide"
      onRequestClose={() => setOpenReport(false)}
      transparent={true}
      visible={openReport}
    >
      <View style={styles.reportModal}>
        <Backdrop onPress={() => setOpenReport(false)} />
        <View style={styles.closeMessageIconContainer}>
          <AntDesign
            onPress={() => setOpenReport(false)}
            name="downcircle"
            color={defaultStyles.colors.secondary_Variant}
            size={scale(28)}
          />
        </View>
        <View style={styles.optionsContainerReport}>
          <AppText style={styles.reportProblemTitle}>Report Problem</AppText>
          <TextInput
            editable={!isLoading}
            maxLength={250}
            multiline={true}
            onChangeText={setProblemDescription}
            placeholder="Describe your problem..."
            subStyle={styles.inputProblem}
            style={[
              styles.problemInput,
              { height: Math.min(100, Math.max(60, height)) },
            ]}
            onContentSizeChange={(event) =>
              setHeight(event.nativeEvent.contentSize.height)
            }
          />
          <View style={styles.actionContainer}>
            <AppText style={styles.problemDescriptionLength}>
              {problemDescription.length}/250
            </AppText>
            <AppButton
              disabled={
                problemDescription.replace(/\s/g, "").length >= 1 && !isLoading
                  ? false
                  : true
              }
              onPress={handleProblemSubmitPress}
              style={[
                styles.submitProblemButton,
                {
                  backgroundColor:
                    problemDescription.replace(/\s/g, "").length >= 1 &&
                    !isLoading
                      ? defaultStyles.colors.yellow_Variant
                      : defaultStyles.colors.light,
                },
              ]}
              subStyle={styles.submitProblemButtonSub}
              title="Report"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  actionContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5@s",
    width: "100%",
  },
  closeMessageIconContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "25@s",
    bottom: "-25@s",
    height: "40@s",
    justifyContent: "center",
    padding: "5@s",
    width: "40@s",
    zIndex: 222,
  },
  inputProblem: {
    fontSize: "15@s",
    height: "100%",
    textAlignVertical: "top",
  },
  optionsContainerReport: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderLeftColor: defaultStyles.colors.light,
    borderLeftWidth: 1,
    borderRightColor: defaultStyles.colors.light,
    borderRightWidth: 1,
    borderTopColor: defaultStyles.colors.light,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    borderTopWidth: 1,
    bottom: 0,
    //height: "210@s",
    overflow: "hidden",
    paddingHorizontal: "10@s",
    paddingTop: "20@s",
    paddingBottom: "15@s",
    width: "100%",
  },
  problemInput: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    borderWidth: 1,
    color: defaultStyles.colors.dark,
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    fontStyle: "normal",
    marginBottom: "10@s",
    padding: "5@s",
    width: "95%",
  },
  problemDescriptionLength: {
    fontSize: "12@s",
  },
  reportModal: {
    flex: 1,
    justifyContent: "space-between",
    overflow: "hidden",
    width: "100%",
  },
  reportProblemTitle: {
    // borderBottomColor: defaultStyles.colors.lightGrey,
    //borderBottomWidth: 1,
    marginBottom: "10@s",
    textAlign: "center",
    width: "100%",
  },
  submitProblemButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    height: "30@s",
    width: "60@s",
  },
  submitProblemButtonSub: {
    color: defaultStyles.colors.secondary,
  },
});

export default memo(ReportModal);
