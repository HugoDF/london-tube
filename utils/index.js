var utils = {};
var tfl = require('tfl');
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
utils.formatDate = function(date){
  return date.toLocaleDateString();
}
utils.isLine = function(query){
    const lines = tfl.tube.lines.values;
    const str = query.toLowerCase();
    for(k in lines){
        if(str===k.toLowerCase()){
            return true;
        }
    }
    return false;
}
utils.isStation = function(query){
    const stations = tfl.tube.stations.values;
    const str = query.toLowerCase();
    for(k in stations){
        if(str===k.toLowerCase()){
            return true;
        }
    }
    return false;
}
utils.mapLineName = function(query){
    const lines = tfl.tube.lines.values;
    const str = query.toLowerCase();
    for(k in lines){
        if(str===k.toLowerCase()){
            return k;
        }
    }
    return query;
}
utils.mapStationName = function(query){
    const stations = tfl.tube.stations.values;
    const str = query.toLowerCase();
    for(k in stations){
        if(str===k.toLowerCase()){
            return k;
        }
    }
    return query;
}

utils.lineNames = function(){
    const lines = tfl.tube.lines.values;
    var lineNames = [];
    for(k in lines){
        lineNames.push(k);
    }
    return lineNames;
}
module.exports = utils;
