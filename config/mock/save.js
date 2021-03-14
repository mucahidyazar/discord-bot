const fs = require("fs");
const Filter = require("bad-words");
const filter = new Filter();

const badWordDisabler = async () => {
  await fs.readFile("./kufurler.txt", "utf8", (err, data) => {
    const datas = data.split("\n");
    const badwords = [];
    datas.forEach((item) => {
      badwords.push(item.replace("\r", ""));
    });
    filter.addWords(...badwords);
    console.log(filter.clean("amini"));
  });
};

module.exports = {
  badWordDisabler,
};
