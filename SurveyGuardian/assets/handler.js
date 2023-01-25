var botdetection = 0;
var attentionchecks = 0;
var attentionchecks_count = 0;
var manualid = 0;
var manualid_data = 0;
var surveyid = 0;
var botid = "";
var question_id;
var answer_id;
var answer_corr;
var question_code;
var questions;
var verificator = {
   success: false,
   attentioncheck_failed: false,
   botdetection_failed: false
};

// DEBUG OPTION FOR LOCALHOST DEVELOPMENT ONLY
// var hostname = "http://localhost/";
var hostname = location.protocol + '//' + location.hostname;

$(document).ready(function () {
   surveyid = $('#surveyid').val();
   if (!localStorage.getItem(surveyid + "-ls-1")) {
      document.getElementById("custom-endscreen").style.display = "none";
      return;
   }
})

setTimeout(verifySubmission, 500);

// verify the submission after the survey
function verifySubmission() {
   if (localStorage.getItem(surveyid + "-ls-1") == "PxCbUKv3cw" || localStorage.getItem(surveyid + "-ls-1") == "LXcTTINxJl") {
      verificator["success"] = true;
      stopSurvey(false, botid);
      if (getFailureCount() > 1) {
         // if count of wrong answers to attention checks more than 1
         blockInput();
         verificator["attentioncheck_failed"] = true;
         stopSurvey(true, "");
      }
   } else if (localStorage.getItem(surveyid + "-ls-1") == "PLByEwSvhy") {
      // bot detection fires
      verificator["botdetection_failed"] = true;
      if (getFailureCount() > 1) {
         verificator["attentioncheck_failed"] = true;
      }
      stopSurvey(true, botid);
   }
}

// STOP SURVEY
function stopSurvey(error, visitorID) {
   blockInput();

   url = hostname + `/end.php?id=` + encodeMsg();
   if (getUserId() == 0) {
      url = '../upload/plugins/SurveyGuardian/assets/finished.php';
   }
   clearStorage();
   window.location.replace(url);
}

// block user from doing input while verificating
function blockInput() {
   document.write('');
   document.close();
   var event = $(document).click(function (e) {
      e.stopPropagation();
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
   });

   // disable right click
   $(document).bind('contextmenu', function (e) {
      e.stopPropagation();
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
   });
}

// clear local storage after finishing the survey
function clearStorage() {
   if (localStorage.removeItem(surveyid + "-ls-1") !== null)
      localStorage.removeItem(surveyid + "-ls-1");
   if (localStorage.removeItem("ls-pid") !== null)
      localStorage.removeItem("ls-pid");
   if (localStorage.removeItem(surveyid + "-ls-p") !== null)
      localStorage.removeItem(surveyid + "-ls-p");
   if (localStorage.removeItem(surveyid + "-ls-mid") !== null)
      localStorage.removeItem(surveyid + "-ls-mid");
}

// encode the message (for communication with SurveyHunter)
function encodeMsg() {
   verificator["manualid"] = getManualId();

   var msg = {
      "id": getUserId(),
      "success": verificator["success"],
      "attention_checks": verificator["attentioncheck_failed"],
      "bot_detection": verificator["botdetection_failed"],
      "proof_of_fail": "",
      "manualid": verificator["manualid"],
   }
   msg = JSON.stringify(msg);
   return encryptMsg(msg);
}

// encrypt the message (for communication with SurveyHunter)
function encryptMsg(msg) {
   var key = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef");
   var iv = CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210");

   var encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv,
      padding: CryptoJS.pad.ZeroPadding
   });

   return encrypted.toString();
}

// get the id (assigned by SurveyHunter)
function getUserId() {
   if (localStorage.getItem("ls-pid"))
      return localStorage.getItem("ls-pid");
   else
      return 0;
}

// get the manual id (entered by the participant)
function getManualId() {
   if (localStorage.getItem(surveyid + "-ls-mid"))
      return localStorage.getItem(surveyid + "-ls-mid");
   else
      return 0;
}

// get count of failed attention checks
function getFailureCount() {
   if (localStorage.getItem(surveyid + "-ls-p")) {
      var proof = localStorage.getItem(surveyid + "-ls-p");
      proof = proof.replaceAll('\"', '');
      var proofArray = proof.split(",");
      return proofArray.length;
   }
}