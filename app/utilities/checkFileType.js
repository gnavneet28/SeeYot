const checkFileType = (file) => {
  let text = file.toLowerCase();

  let fileExtensions = [
    ".aa",
    ".aax",
    ".aac",
    ".act",
    ".aiff",
    ".alac",
    ".amr",
    ".ape",
    ".au",
    ".awb",
    ".m4a",
    ".m4b",
    ".m4p",
    ".mmf",
    ".mp3",
    ".mpc",
    ".ogg",
    ".oga",
    ".voc",
    ".tta",
    ".rm",
    ".ra",
    ".wav",
    ".wma",
    ".wv",
    ".webm",
    ".cda",
    ".mp4",
  ];

  if (fileExtensions.filter((t) => text.endsWith(t)).length) {
    return true;
  }

  return false;
};

export default checkFileType;
