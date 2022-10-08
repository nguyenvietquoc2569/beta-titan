export const getConfig = (path: string) => {
  return getObjectPath(config, path, '')
}

const config = {
  "mongodb": {
    "dev": { "connectionString": `mongodb://${process.env.mongoHost}/dev-service-db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false` },
    "qa": { "connectionString": `mongodb://${process.env.mongoHost}/qa-service-db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false` },
    "prod": { "connectionString": `mongodb://${process.env.mongoHost}/qa-service-db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false` },
  },
  "mongodbMultimedia": {
    "dev": { "connectionString": `mongodb://${process.env.mongoHost}/dev-file-db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false` },
    "qa": { "connectionString": `mongodb://${process.env.mongoHost}/qa-file-db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false` },
    "prod": { "connectionString": `mongodb://${process.env.mongoHost}/qa-file-db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false` },
  },
  "MultimediaSpeakingTest": {
    "dev": { "connectionString": `mongodb://${process.env.mongoHost}/file-speaking-test-db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false` },
    "qa": { "connectionString": `mongodb://${process.env.mongoHost}/file-speaking-test-db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false` },
    "prod": { "connectionString": `mongodb://${process.env.mongoHost}/file-speaking-test-db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false` },
  },
  "jwt": {
    "secret": "Examination Portal Application beta1"
  },
  "mail-credentials": {
    "userid": "<smtp server userId>",
    "password": "<smtp server password>"
  },
  thingsHost: {
    dev: 'http://localhost:3333',
    qa: 'https://message-qa.betaschool.edu.vn',
    prod: 'https://message.betaschool.edu.vn'
  },
  "centerOnline": {
    qa: '$2b$10$VpUPCkC1GrwBnabsdZ87.uvDH4ujGWiLp/sPi5ei81rCnCwxajYHi',
    prod: '$2b$10$VpUPCkC1GrwBnabsdZ87.uvDH4ujGWiLp/sPi5ei81rCnCwxajYHi',
    dev: '$2b$10$VpUPCkC1GrwBnabsdZ87.uvDH4ujGWiLp/sPi5ei81rCnCwxajYHi'
  },
  "microsoft": {
    client_id: "9ddc6095-8e6f-491e-970e-afd4af2baefa",
    client_secret: ".RVnQAw3W~35-uYqhc-J2A1F7w..WvQ765",
    tenant: '631ab3ed-90f5-4bd4-a918-57b7f41509e3',
    delegate: '65ea46e4-5ce9-4516-b66b-b73332fcdedb'
  },
  "betaDomain": ['betaschool.edu.vn', 'sv.betaschool.edu.vn', 'thptbinhson.edu.vn', 'sv.thptbinhson.edu.vn', 'thptbs.betaschool.edu.vn', 'hsthptbs.betaschool.edu.vn'],
  "thptbinhson": {
    code: 'THPTBinhSon',
    giaovienDomain: 'thptbinhson.edu.vn',
    hocsinhDomain: 'sv.thptbinhson.edu.vn'
  },
  beta: {
    code: 'BetaSchool',
    nvDomain: 'betaschool.edu.vn',
    giaovienDomain: 'betaschool.edu.vn',
    hocsinhDomain: 'sv.betaschool.edu.vn'
  },
  msfStudentLicenseGroup: '5f778566-5081-4f80-8e70-19e60e5e8f43',
  msfFacultyLicenseGroup: '9037890f-5963-4704-b659-409cacbd98a8'
}

const getObjectPath = function (obj, path, def) {
  /**
   * If the path is a string, convert it to an array
   * @param  {String|Array} path The path
   * @return {Array}             The path array
   */
  const stringToPath = function (path) {
    // If the path isn't a string, return it
    if (typeof path !== 'string') return path;
    // Create new array
    const output = [];
    // Split to an array with dot notation
    path.split('.').forEach(function (item, index) {
      // Split to an array with bracket notation
      item.split(/\[([^}]+)\]/g).forEach(function (key) {
        // Push to the new array
        if (key.length > 0) {
          output.push(key);
        }
      });
    });
    return output;
  };

  // Get the path as an array
  path = stringToPath(path);
  // Cache the current object
  let current = obj;
  // For each item in the path, dig into the object
  for (let i = 0; i < path.length; i++) {
    // If the item isn't found, return the default (or null)
    if (!current[path[i]]) return def;
    // Otherwise, update the current  value
    current = current[path[i]];
  }
  return current;
};