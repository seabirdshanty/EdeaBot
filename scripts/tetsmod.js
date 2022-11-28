(function() {

var someThings = "...";

module.exports.itsSummerTime = function() { // to display time on logfiles
	var d = new Date()
	, dSM = d.getMonth()
	, dSD = d.getDate()
	, dSE = d.getDay()
	, dSY = d.getFullYear()
	, h = d.getHours()
	, m = d.getMinutes()
	, ap = "am";

	// am pm shenanigans
	if(h >= 12) { h = h - 12; ap = "pm"; }
	if(h == 0) { h = 12; }
	// add leading zeros
	if(h < 10 ) { h = "0" + h; }
	if(m < 10 ) { m = "0" + m; }
	dSM++ // increment month for correct month
	if(dSM == 13) { dSM == "01";} // incase of january?
	// add leading zeros
	if(dSM < 10 ) { dSM = "0" + dSM; }
	if(dSD < 10 ) { dSD = "0" + dSD; }

	// output
	var dispTime = "" + dSM + "-" + dSD + "-" + dSY + "(" + h + "" + m + ap + ")";
	return dispTime; //return the time
}

module.exports.knockOutThreeAM = function() {
	setTimeout(function(){process.exit()}, 5000);
}

module.exports.getSomeThings = function() {
	return someThings();
}

}());
