# SurveyGuardian Plugin for LimeSurvey 


## Description
When using online-surveys for research there are disadvantages decreasing the quality of data, such as inattentive participants or participants who cheat or have undesirable behavior.
To counteract this problem, I created a plugin for the online-survey platform LimeSurvey, which automatically detects participants being inattentive with the help of automated display and evaluation of attention checks or participants executing non-human actions. The filtered participants could then be excluded from the survey data to maintain the study's validity and prevent the participant from getting a reward. This enables the researchers to have an execution cost of the online survey based on valid participation only. Study participants who violate the rules multiple times can also be excluded from participating in further surveys.


## Installation of the plugin
To install the plugin, simply zip all the files in the folder "SurveyHunterProtection" and upload the zip-file in the LimeSurvey plugin back-end. It is then automatically activated and ready to use.


## Good to know

### Updating the included Bot Detection Framework
The plugin includes the <a href="https://github.com/fingerprintjs/BotD">FingerprintJS BotD framework</a> in version 1 (v1) for detecting bots.<br>
If there are updates to version 1 the newest code will automatically be loaded. If there is a major update of FingerprintJs BotD, for example version 2, you can contact the plugin creator to notify to update the code. You can also update the code yourself in the file "checker.js" lines 208-232. 

### Extend the number of attention check questions
If you want to delete, add or edit attention check questions, navigate to "SurveyHunterProtection > assets > attentionchecks.json". Create new entries in the same pattern.


## License notice
FingerprintJS BotD licensed under the MIT license. <a href="https://github.com/fingerprintjs/BotD/blob/main/LICENSE">More details</a><br>
CryptoJS licensed under the MIT license. <a href="https://github.com/brix/crypto-js/blob/develop/LICENSE">More details.</a><br>
jQuery licensed under the MIT license. <a href="https://github.com/jquery/jquery/blob/main/LICENSE.txt">More details</a><br>
ChartJS licensed under the MIT license. <a href="https://github.com/chartjs/Chart.js/blob/master/LICENSE.md">More details</a>


