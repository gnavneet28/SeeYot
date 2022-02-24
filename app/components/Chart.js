import React, { memo } from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { PieChart } from "react-native-chart-kit";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

const width = defaultStyles.width;

function Chart({
  chartConfig,
  description,
  onLastMonthDataPress,
  onLastWeekDataPress,
  onTotalDataPress,
  opted = "All",
  pieChartData,
  style,
  title,
  totalData = 0,
}) {
  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.title}>{title}</AppText>
      <AppText style={styles.description}>{description}</AppText>
      <View style={styles.optionsContainer}>
        <AppText
          style={[
            styles.option,
            {
              backgroundColor:
                opted == "All"
                  ? defaultStyles.colors.blue
                  : defaultStyles.colors.light,
              color:
                opted == "All"
                  ? defaultStyles.colors.white
                  : defaultStyles.colors.dark,
            },
          ]}
          onPress={onTotalDataPress}
        >
          Total
        </AppText>
        <AppText
          style={[
            styles.option,
            {
              backgroundColor:
                opted == "Week"
                  ? defaultStyles.colors.blue
                  : defaultStyles.colors.light,

              color:
                opted == "Week"
                  ? defaultStyles.colors.white
                  : defaultStyles.colors.dark,
            },
          ]}
          onPress={onLastWeekDataPress}
        >
          Last 1 week
        </AppText>
        <AppText
          style={[
            styles.option,
            {
              backgroundColor:
                opted == "Month"
                  ? defaultStyles.colors.blue
                  : defaultStyles.colors.light,
              color:
                opted == "Month"
                  ? defaultStyles.colors.white
                  : defaultStyles.colors.dark,
            },
          ]}
          onPress={onLastMonthDataPress}
        >
          Last 1 month
        </AppText>
      </View>
      {totalData ? (
        <>
          <View style={styles.dataContainer}>
            <PieChart
              data={pieChartData}
              height={200}
              width={width}
              chartConfig={chartConfig}
              accessor="population"
              style={chartConfig.style}
            />
            <View style={styles.totalDataContainer}>
              <AppText style={styles.totalDataInfo}>Total</AppText>
              <AppText style={styles.totalDataContent}>{totalData}</AppText>
            </View>
          </View>
        </>
      ) : (
        <AppText style={styles.notData}>No insights available</AppText>
      )}
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    borderColor: defaultStyles.colors.light,
    borderRadius: "8@s",
    borderWidth: 1,
    minHeight: "40@s",
    overflow: "hidden",
    width: "95%",
  },
  dataContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  description: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: "12.5@s",
    marginTop: "5@s",
    paddingTop: 0,
  },
  title: {
    backgroundColor: defaultStyles.colors.secondary,
    borderBottomColor: defaultStyles.colors.dark,
    borderBottomWidth: 1,
    color: defaultStyles.colors.white,
    fontSize: "14@s",
    paddingHorizontal: "10@s",
    width: "100%",
  },
  notData: {
    marginVertical: "10@s",
    paddingHorizontal: "10@s",
    textAlign: "center",
    width: "100%",
  },
  optionsContainer: {
    alignSelf: "center",
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    borderRadius: "5@s",
    flexDirection: "row",
    marginVertical: "10@s",
    overflow: "hidden",
    width: "95%",
  },
  option: {
    backgroundColor: defaultStyles.colors.light,
    flexShrink: 1,
    fontSize: "12@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  totalDataContainer: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "5@s",
    paddingHorizontal: "5@s",
    width: "100%",
  },
  totalDataInfo: {
    color: defaultStyles.colors.dark,
    flexShrink: 1,
    width: "100%",
  },
  totalDataContent: {
    color: defaultStyles.colors.secondary,
    flexShrink: 1,
    paddingHorizontal: "5@s",
    textAlign: "right",
    width: "100%",
  },
});

export default memo(Chart);
