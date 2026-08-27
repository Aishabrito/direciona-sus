const { getDefaultConfig } = require('expo/metro-config'); // ✅ CERTO
const config = getDefaultConfig(__dirname);
module.exports = config;                                   // ✅ CERTO