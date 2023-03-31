/**
 * Location utils funcions
 */
const locationParts = [
  {
    name: "stock",
    letter: "S",
  },
  {
    name: "aisle",
    letter: "A",
    min: 0,
    max: 99,
  },
  {
    name: "position",
    letter: "P",
    min: 0,
    max: 999,
  },
  {
    name: "height",
    letter: "H",
    min: 0,
    max: 99,
  },
  {
    name: "depth",
    letter: "D",
    min: 0,
    max: 99,
  },
  {
    name: "free",
    letter: "F",
    min: 0,
    max: 99,
  },
];
/**
 * gets a location name string and return a object
 * @param {*} locationNameStr
 */
const parseLocation = (locationNameStr) => {
  const locationNameArray = locationNameStr.split("/");

  const stock = locationNameArray.find((l) => l.includes("S"));
  const aisle = locationNameArray.find((l) => l.includes("A"));
  const position = locationNameArray.find((l) => l.includes("P"));
  const height = locationNameArray.find((l) => l.includes("H"));
  const depth = locationNameArray.find((l) => l.includes("D"));
  const free = locationNameArray.find((l) => l.includes("F"));

  return {
    stock: stock !== undefined ? parseInt(stock.replace("S", ""), 10) : null,
    aisle: aisle !== undefined ? parseInt(aisle.replace("A", ""), 10) : null,
    position: position !== undefined ? parseInt(position.replace("P", ""), 10) : null,
    height: height !== undefined ? parseInt(height.replace("H", ""), 10) : null,
    depth: depth !== undefined ? parseInt(depth.replace("D", ""), 10) : null,
    free: free !== undefined ? parseInt(free.replace("F", ""), 10) : null,
  };
};

const convertToString = (locationObj, pattern) => {
  const locationArr = pattern.map((part) => {
    const value = locationObj[part.name];
    return `${part.letter}${typeof value !== "undefined" && value !== null && value !== "" ? value : "_"}`;
  });

  return locationArr.join("/");
};

const getPatternOrder = (pattern) => {
  const patternArr = pattern.split("/");

  return patternArr.map((part) => part.split("$")[0]).map((part) => locationParts.find((lp) => lp.letter === part));
};

const getLocationMask = (locationNameStr) => {
  return locationNameStr.replace(/\d/g, "9");
};
const getLocationPattern = (locationNameStr) => {
  return locationNameStr.replace(/\d/g, "9");
};

export { parseLocation, convertToString, getLocationMask, getLocationPattern, getPatternOrder };
