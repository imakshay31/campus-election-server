import mutations from "./mutation/mutation.js";
import queries from "./query/query.js";

const resolver = {
  ...mutations,
  ...queries,
};

export default resolver;
