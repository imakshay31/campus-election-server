const mutations = require("./mutation/mutation");
const queries = require("./query/query");

const resolver = {
  ...mutations,
  ...queries,
};

export default resolver;
