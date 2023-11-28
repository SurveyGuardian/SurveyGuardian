/*
 * Logic for bot detection and attention checks
 */
var botdetection = 0;
var attentionchecks = 0;
var attentionchecks_count = 0;
var manualid = 0;
var manualid_data = 0;
var surveyid = 0;
var debugmode = 0;

var botid = "";

var question_id;
var answer_id;
var answer_corr;
var question_code;

var questions;

var global_question_id;

var proofArray = new Array();

var verificator = {
   success: false,
   attentioncheck_failed: false,
   botdetection_failed: false
};

var active_attentionchecks = 0;

var verification_cache = new Array();

// DEBUG OPTION FOR LOCALHOST DEVELOPMENT ONLY
// var hostname = "http://localhost/";
var hostname = location.protocol + '//' + location.hostname;

var lang = "en";


// ATTENTION CHECKS
$(document).ready(function () {
   botdetection = $('#option_botdetection').val();
   attentionchecks = $('#option_attentionchecks').val();
   attentionchecks_count = $('#attentionchecks_count').val();
   manualid = $('#option_manualid').val();
   surveyid = $('#surveyid').val();
   debugmode = $('#option_debug_mode').val();

   if (!attentionchecks && !botdetection) {
      return
   }

   // check document for language
   if (document.documentElement.lang) {
      lang = document.documentElement.lang;
   }

   // if botdetection is enabled, start it
   if (botdetection == 1) {
      runBotDetection();
   }

   const pageid = $('#thisstep').val();
   const totalpages = $('#total_pagecount').val();

   // check for survey preview mode and handle it
   if (attentionchecks || botdetection) {
      if (debugmode)
         console.log("[SurveyGuardian] Page: " + pageid + "/" + totalpages);

      if ($("#main-col").children().first().hasClass("alert") == false) {
         // if no user id is found
         if (getUserId() == 0) {
            // clearStorage();
            // var url = hostname + `/start.php`;
            // alert("No user id found. You need to start the survey over the platform SurveyHunter. Redirecting you now...");
            // window.location.replace(url);
         }
      } else {
         clearStorage();
         if (debugmode)
            console.log("[SurveyGuardian] Plugin detected survey preview mode. Publish the survey for full plugin functionality.");
      }
   }

   if (debugmode)
      console.log(`[SurveyGuardian] Protection active: Bot-Detection=${botdetection}; Attention-Check=${attentionchecks}; Manual-ID=${manualid}`);


   // generate attention checks from json list
   if (attentionchecks == 1) {
      $.getJSON("../upload/plugins/SurveyGuardian/assets/attentionchecks.json", function (json) {
         if (json["languages"].includes(lang)) {
            questions = json["attentionchecks"];
            if (pageid <= totalpages - 1) {
               for (let i = 0; i < attentionchecks_count; i++) {
                  generateAttentionCheck();
               }
            }
         } else {
            var msg = '<div class="ls-label-question" style="border: 2px solid #c0392b; padding: 15px; line-height: 1.25; color: #222222; font-weight: 500; font-size: 18px;"><span style="display: inline-block; margin-bottom: 10px; color: #c0392b; font-weight: 600; font-size: 22px;">[SurveyGuardian] Plugin Error</span><br>The plugin SurveyGuardian does not support your language yet. Deactivate the attention check feature or switch to a supported language.</div>';
            document.getElementById("limesurvey").insertAdjacentHTML('afterbegin', msg);
         }
      });

      // update users proofArray
      if (localStorage.getItem(surveyid + "-ls-p") !== null) {
         proofArray = JSON.parse(localStorage.getItem(surveyid + "-ls-p"));
      }

      // when user submits, check attention checks
      $('#ls-button-submit').click(function (event) {

         // if submitting on last page
         if (pageid === totalpages) {
            // event.stopPropagation();
            // event.preventDefault();
            // event.stopImmediatePropagation();
            verifySubmission();
         }

         // loop through every generated attention check
         for (let i = 0; i < active_attentionchecks; i++) {
            var data = verification_cache[i];

            // if no response on attention check
            if (!document.querySelector('input[name="587324X1X' + data[1] + '"]:checked') && active_attentionchecks > 0) {
               localStorage.setItem(surveyid + "-ls-1", "PxCbUKv3cw");
               setProof(i);
               // check if response on attention check is correct and save proof if not
            } else if (document.querySelector('input[name="587324X1X' + data[1] + '"]')) {
               if (document.querySelector('input[name="587324X1X' + data[1] + '"]:checked').value !== data[3]) {
                  // stopSurvey(true, "");
                  localStorage.setItem(surveyid + "-ls-1", "PxCbUKv3cw");
                  setProof(i);
                  // end survey
               } else {
                  if (localStorage.getItem(surveyid + "-ls-1") == null)
                     localStorage.setItem(surveyid + "-ls-1", "LXcTTINxJl");
                  // localStorage.setItem(surveyid + "-ls-2", "yx6WwobdIJ");
               }
            }
         }
      })
   } else {
      if (localStorage.getItem(surveyid + "-ls-1") == null)
         localStorage.setItem(surveyid + "-ls-1", "LXcTTINxJl");
   }

   if (manualid == 1 && pageid == 1) {
      // when user submits, set manual id
      $('#ls-button-submit').click(function (event) {
         manualid_data = $('form').find('input[type=text]').filter(':visible:first');
         localStorage.setItem(surveyid + "-ls-mid", manualid_data.val());
      });
   }
});

function runBotDetection() {
   // ------- FingerprintJS OPEN SOURCE VERSION 0.1 -------
   // async function run() {
   //    try {
   //       // const botdPromise = await import('../dist/botd.esm.js')
   //       const botdPromise = await import("https://openfpcdn.io/botd/v0.1");
   //       const botd = await botdPromise.load({ publicKey: "YoIM5lbtswcq7p3f77pidEpA" });
   //       const detectResponse = await botd.detect();
   //       // FOR SECURITY REASONS CALL /verify METHOD ON YOUR SERVER!
   //       const botdServerAPI = "https://botd.fpapi.io/api/v1"
   //       const verifyBody = JSON.stringify({
   //          "secretKey": "I52cbPf1G8eWXajzrlfyIpZp",
   //          "requestId": detectResponse.requestId
   //       })
   //       const result = await fetch(`${botdServerAPI}/verify`, {
   //          body: verifyBody,
   //          method: "POST"
   //       })
   //          .then(response => response.json())
   //       var probs = [result.bot.automationTool.probability, result.bot.browserSpoofing.probability, result.bot.searchEngine.probability, result.vm.probability];
   //       if (debugmode)
   //          console.log(result);
   //       // TEST DEBUG:
   //       // probs = [0.6, 0, 0, 0];
   //       if (probs.some(el => el > 0.5)) {
   //          // stopSurvey(false, result.bot.ip);
   //          botid = result.bot.ip;
   //          localStorage.setItem(surveyid + "-ls-1", "PLByEwSvhy");
   //       }

   //       if (debugmode)
   //          console.log(probs);
   //    } catch (e) {
   //       if (debugmode)
   //          console.log(e);
   //    }
   // }

   // ------- FingerprintJS OPEN SOURCE VERSION 1.1.0 -------
   async function run() {
      try {
         // Initialize agent at application startup, once per page/app.
         const botdPromise = import('https://openfpcdn.io/botd/v1').then((Botd) => Botd.load())
         // Get detection results
         botdPromise
            .then((botd) => botd.detect())
            .then((result) => botResultHandling(result))
            .catch((error) => console.error(error))
      } catch (e) {
         if (debugmode)
            console.log(e);
      }
   }

   run();
}

// handle the result of the bot detection tool
function botResultHandling(resultArray) {
   if (resultArray['bot'] == true) {
      localStorage.setItem(surveyid + "-ls-1", "PLByEwSvhy");
   }
   if (debugmode)
      console.log(resultArray);
}



// STOP SURVEY
function stopSurvey(error, visitorID) {
   const pid = getUserId();

   logging().done(function (result) {
      if (result == 0) {
         url = hostname + `/end.php?id=` + encodeMsg();
         if (getUserId() == 0) {
            url = '../upload/plugins/SurveyGuardian/assets/finished.php';
         }
         clearStorage();
         window.location.replace(url);
      } else {
         alert(result);
      }
   });
}

// log failures to csv table
function logging() {
   var proof = "";
   proof = localStorage.getItem(surveyid + "-ls-p");

   return $.ajax({
      url: '../upload/plugins/SurveyGuardian/assets/logging.php',
      type: 'POST',
      data: { surveyid: surveyid, userid: getUserId(), manualid: getManualId(), proof: proof, ac: verificator["attentioncheck_failed"], bd: verificator["botdetection_failed"] },
   });
}

// stop the user from doing any input for verification process
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

// generate random Integer between min and max
function randomInteger(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate the attention check
function generateAttentionCheck() {
   const global_question_id = setGlobalQuestionID();
   const question = questions[global_question_id];
   question_id = randomInteger(999, 999999);
   answer_id = "#answer587324X1X" + question_id;
   answer_corr = "AO0" + question["correct"];

   if (document.querySelector('.fa-asterisk')) {
      // <!-- answer_row --> <li id="javatbd587324X1X` + question_id + `AO01" class="answer-item radio-item"> <input class="att-checking" type="radio" value="AO01" name="587324X1X` + question_id + `" id="answer587324X1X` + question_id + `AO01" onclick="if (document.getElementById('answer587324X1X` + question_id + `othertext') != null) document.getElementById('answer587324X1X` + question_id + `othertext').value='';checkconditions(this.value, this.name, this.type)"> <label for="answer587324X1X` + question_id + `AO01" class="control-label radio-label">` + question["answers"][lang][0] + `</label> </li> <!-- end of answer_row -->
      answers_code = ``;

      answer_count = 0;
      answer_index = 0;
      question["answers"][lang].forEach(function (answer) {
         answer_count++;
         answers_code += `<!-- answer_row --> <li id="javatbd587324X1X` + question_id + `AO0` + answer_count + `" class="answer-item radio-item"> <input class="att-checking" type="radio" value="AO0` + answer_count + `" name="587324X1X` + question_id + `" id="answer587324X1X` + question_id + `AO0` + answer_count + `" onclick="if (document.getElementById('answer587324X1X` + question_id + `othertext') != null) document.getElementById('answer587324X1X` + question_id + `othertext').value='';checkconditions(this.value, this.name, this.type)"> <label for="answer587324X1X` + question_id + `AO0` + answer_count + `" class="control-label radio-label">` + question["answers"][lang][answer_index] + `</label> </li> <!-- end of answer_row -->`;
         answer_index++;
      });

      question_code = `<div id="question` + question_id + `" class="row list-radio mandatory question-container"> <div class=" question-title-container col-xs-12 "> <div class="asterisk pull-left"> <sup class="text-danger fa fa-asterisk small" aria-hidden="true"></sup> <span class="sr-only text-danger">(This question is mandatory)</span> </div> <div class=" question-text "> <div id="ls-question-text-587324X1X` + question_id + `" class=" ls-label-question "> ` + question["question"][lang] + ` </div> </div> </div> <div class="question-help-container text-info col-xs-12 hidden"> </div> <div class=" question-valid-container text-info col-xs-12"> <div class="ls-question-help " role="alert" id="vmsg_9"> <div id="vmsg_9_default" class="ls-question-message ls-em-tip em_default ls-em-success"> <span class="fa fa-exclamation-circle" aria-hidden="true"></span> Choose one of the following answers </div> </div> </div> <!-- Answer --> <div class=" answer-container col-xs-12"> <div class="ls-answers answers-list radio-list row" role="radiogroup" aria-labelledby="ls-question-text-587324X1X` + question_id + `"> <!-- on small screen, each column is full widht, so it look like a single colunm--> <ul class="list-unstyled col-sm-12 col-xs-12"> ` + answers_code + ` </ul></div> <input class="att-checking" id="java587324X1X` + question_id + `" disabled="disabled" type="hidden" value="AO01" name="java587324X1X` + question_id + `"> <!-- end of answer --> </div> <!-- End of question ATTC1 --> </div>`
   } else if (document.querySelector('.ri-asterisk')) {
      // <!-- answer_row --> <li id="javatbd587324X1X` + question_id + `AO01" class="answer-item radio-item imageselect-container"> <input class="att-checking" type="radio" value="AO01" name="587324X1X` + question_id + `" id="answer587324X1X` + question_id + `AO01" onclick="if (document.getElementById('answer587324X1X` + question_id + `othertext') != null) document.getElementById('answer587324X1X` + question_id + `othertext').value='';checkconditions(this.value, this.name, this.type)"> <label for="answer587324X1X` + question_id + `AO01" class="control-label radio-label">` + question["answers"][lang][0] + `</label> </li> <!-- end of answer_row -->
      answers_code = ``;

      answer_count = 0;
      answer_index = 0;
      question["answers"][lang].forEach(function (answer) {
         answer_count++;
         answers_code += `<!-- answer_row --> <li id="javatbd587324X1X` + question_id + `AO0` + answer_count + `" class="answer-item radio-item imageselect-container"> <input class="att-checking" type="radio" value="AO0` + answer_count + `" name="587324X1X` + question_id + `" id="answer587324X1X` + question_id + `AO0` + answer_count + `" onclick="if (document.getElementById('answer587324X1X` + question_id + `othertext') != null) document.getElementById('answer587324X1X` + question_id + `othertext').value='';checkconditions(this.value, this.name, this.type)"> <label for="answer587324X1X` + question_id + `AO0` + answer_count + `" class="control-label radio-label">` + question["answers"][lang][answer_index] + `</label> </li> <!-- end of answer_row -->`;
         answer_index++;
      });
      question_code = `<div id="question` + question_id + `" class="row list-radio mandatory question-container"> <div class=" question-title-container col-xs-12 "> <i class="asterisk ri-asterisk" title="(This question is mandatory)"></i> <div class=" question-text "> <div id="ls-question-text-587324X1X` + question_id + `" class=" ls-label-question "> ` + question["question"][lang] + ` </div> </div> </div> <div class="question-help-container text-info col-xs-12 hidden"> </div> <div class=" question-valid-container text-info col-xs-12"> <div class="ls-question-help " role="alert" id="vmsg_9"> <div id="vmsg_9_default" class="ls-question-message ls-em-tip em_default ls-em-success"> Choose one of the following answers </div> </div> </div> <!-- Answer --> <div class=" answer-container col-xs-12"> <div class="ls-answers answers-list radio-list row" role="radiogroup" aria-labelledby="ls-question-text-587324X1X` + question_id + `"> <!-- on small screen, each column is full widht, so it look like a single colunm--> <ul class="imageselect-list col-md-12 col-12"> ` + answers_code + ` </ul></div> <input class="att-checking" id="java587324X1X` + question_id + `" disabled="disabled" type="hidden" value="AO01" name="java587324X1X` + question_id + `"> <!-- end of answer --> </div> <!-- End of question ATTC1 --> </div>`
   }
   // $('.group-container').append(question_code);

   // add attention check html to DOM, save generated values to array verification_cache
   $('div[id^="question"]').eq(
      Math.floor(Math.random() * $('div[id^="question"').length)
   ).after(question_code);
   verification_cache[active_attentionchecks] = [global_question_id, question_id, answer_id, answer_corr];
   active_attentionchecks++;
}

// clear local storge after finishing the survey
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

// get the user id (assigned by SurveyHunter)
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

// verify the submission for attention checks and bot detection
function verifySubmission() {
   if (localStorage.getItem(surveyid + "-ls-1") == "PxCbUKv3cw") {
      if (getFailureCount() > 1) {
         // wrong answers to more than one attention check
         blockInput();
         verificator["attentioncheck_failed"] = true;
         stopSurvey(true, "");
      }
   } else if (localStorage.getItem(surveyid + "-ls-1") == "PLByEwSvhy") {
      // bot detection fires
      blockInput();
      verificator["botdetection_failed"] = true;
      if (getFailureCount() > 1) {
         verificator["attentioncheck_failed"] = true;
      }
      stopSurvey(true, botid);
   } else if (localStorage.getItem(surveyid + "-ls-1") == "LXcTTINxJl") {
      // correct answers
      // verificator["success"] = true;
      // stopSurvey(false, botid);
   }
}

// encode the message sent to SurveyHunter
function encodeMsg() {
   verificator["manualid"] = getManualId();
   var msg = {
      "id": getUserId(),
      "success": verificator["success"],
      "attention_checks": verificator["attentioncheck_failed"],
      "bot_detection": verificator["botdetection_failed"],
      "proof_of_fail": localStorage.getItem(surveyid + "-ls-p"),
      "manualid": verificator["manualid"],
   }
   msg = JSON.stringify(msg);
   return encryptMsg(msg);
}

// encrypt the message sent to SurveyHunter
function encryptMsg(msg) {
   // var key = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef");
   // var iv = CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210");

   // var encrypted = CryptoJS.AES.encrypt(msg, key, {
   //    iv,
   //    padding: CryptoJS.pad.ZeroPadding
   // });

   // return encrypted.toString();
}

// set the proof of failure to localstorage
function setProof(i) {
   var data = verification_cache[i];
   const question = questions[data[0]];
   correct_answer_id = question["correct"];
   if (document.querySelector('input[name="587324X1X' + data[1] + '"]:checked')) {
      given_answer_id = document.querySelector('input[name="587324X1X' + data[1] + '"]:checked').value.slice(-1);
   } else {
      given_answer_id = "x";
   }

   var proofCode = String(data[0]) + "-" + String(correct_answer_id) + "-" + String(given_answer_id);
   proofArray.push(proofCode);
   localStorage.setItem(surveyid + "-ls-p", JSON.stringify(proofArray));
}

// get count of failures in the survey
function getFailureCount() {
   if (localStorage.getItem(surveyid + "-ls-p")) {
      var proof = localStorage.getItem(surveyid + "-ls-p");
      proof = proof.replaceAll('\"', '');
      var proofArray = proof.split(",");
      return proofArray.length;
   }
}

// set the global question id for generated attention checks
function setGlobalQuestionID() {
   return randomInteger(0, questions.length - 1);
}