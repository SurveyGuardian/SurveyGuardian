# SurveyGuardian Plugin for LimeSurvey 


## Description
When using online-surveys for research there are disadvantages decreasing the quality of data, such as inattentive participants or participants who cheat or have undesirable behavior.
To counteract this problem, we created a plugin for the online-survey platform [LimeSurvey](https://www.limesurvey.org/), which automatically detects participants being inattentive with the help of automated display and evaluation of attention checks or participants executing non-human actions. The filtered participants could then be excluded from the survey data to maintain the study's validity and prevent the participant from getting a reward. This enables the researchers to have an execution cost of the online survey based on valid participation only. Study participants who violate the rules multiple times can also be excluded from participating in further surveys.


## Installation of the plugin
To install the plugin, simply zip all the files in the folder "SurveyGuardian" and upload the zip-file in the LimeSurvey plugin back-end. It is then automatically activated and ready to use.

## Functionality
The plugin can be configured through the back end. The attention checks and bot detection can be activated independently. 
The researcher can also specify the number of attention checks per survey page (Label: **Number of Attention Checks per Page**). 
A button (Label: **Table of failed User Attempts**) enables the researcher to download a table with all the survey participants which didn't comply with the rules while answering the questions – either by inattentive answering or non-human behavior. The table shows Boolean values for attention check or bot detection violation. It also includes the proof of inattentiveness which is formatted with a three-part pattern, e.g., "3-1-2". The first number is the ID of the attention check question to identify which question got asked. The second number is the ID of the correct answer and the third number is the ID of the answer which was chosen by the participant. If the last character is "x" instead the participant did not answer the attention check question.\\
Depending on the setup, the plugin can include the participant ID from the _first field_ (Label: **Use manual ID input by user**).

The survey participant can not recognize that the plugin or its features are activated because everything is working in the background.

## Good to know

### Updating the included Bot Detection Framework
The plugin includes the <a href="https://github.com/fingerprintjs/BotD">FingerprintJS BotD framework</a> in version 1 (v1) for detecting bots.<br>
If there are updates to version 1 the newest code will automatically be loaded. If there is a major update of FingerprintJs BotD, for example version 2, you can contact the plugin creator to notify to update the code. You can also update the code yourself in the file "checker.js" ([Link to checker.json](https://github.com/SurveyGuardian/SurveyGuardian/blob/master/SurveyGuardian/assets/checker.js)) lines 208-232. 

### Extend the number of attention check questions
If you want to delete, add or edit attention check questions, navigate to "SurveyGuardian > assets > attentionchecks.json" ([Link to attentionchecks.json](https://github.com/SurveyGuardian/SurveyGuardian/blob/master/SurveyGuardian/assets/attentionchecks.json)). Create new entries in the same pattern.

## (Known) Limitations
The development of the plugin for LimeSurvey platform faced difficulties due to limitations in accessing variables such as participant ID. A workaround was implemented to enable identification and reference the results of attention checks and bot detection. However, this detour resulted in a less user-friendly experience and a decrease in productivity. The security of the work is also limited as JavaScript is needed to execute procedures, communicate, and save data. Attention check questions are inserted randomly by the participant's browser, which could be manipulated, and results of the attention checks and bot detection are stored in the local storage of the browser, which could also be manipulated.
Finally, the _Enter how many groups your survey structure contains_ must be filled out, as LimeSurvey does not provide a simple way to access this number.

## License notice
FingerprintJS BotD licensed under the MIT license. <a href="https://github.com/fingerprintjs/BotD/blob/main/LICENSE">More details</a><br>
CryptoJS licensed under the MIT license. <a href="https://github.com/brix/crypto-js/blob/develop/LICENSE">More details.</a><br>
jQuery licensed under the MIT license. <a href="https://github.com/jquery/jquery/blob/main/LICENSE.txt">More details</a><br>
ChartJS licensed under the MIT license. <a href="https://github.com/chartjs/Chart.js/blob/master/LICENSE.md">More details</a>


