import JailMonkey from "jail-monkey";

const checkJailBreak = async () => {
  console.log("Adb", await JailMonkey.AdbEnabled());
  console.log("MockLocation", await JailMonkey.canMockLocation());
  console.log("Hook detected", await JailMonkey.hookDetected());
  console.log("DebggedMode", await JailMonkey.isDebuggedMode());
  console.log("Jail broken", await JailMonkey.isJailBroken());
  console.log("External Device", await JailMonkey.isOnExternalStorage());
  console.log(
    "Development settings mode",
    await JailMonkey.isDevelopmentSettingsMode()
  );
};

export default checkJailBreak;
