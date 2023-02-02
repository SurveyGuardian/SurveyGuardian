
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
The plugin includes the [FingerprintJS BotD framework](https://github.com/fingerprintjs/BotD) in version 1 (v1) for detecting bots.
If there are updates to version 1, the newest code will automatically be loaded. If there is a major update of FingerprintJs BotD, for example, version 2, you can contact us to notify to update the code. You can also update the code yourself in the file "checker.js" ([Link to checker.json](https://github.com/SurveyGuardian/SurveyGuardian/blob/master/SurveyGuardian/assets/checker.js)) lines 208-232. 

### Extend the number of attention check questions
If you want to delete, add, or edit attention check questions, navigate to "SurveyGuardian > assets > attentionchecks.json" ([Link to attentionchecks.json](https://github.com/SurveyGuardian/SurveyGuardian/blob/master/SurveyGuardian/assets/attentionchecks.json)). Create new entries in the same pattern. The current attention checks are:

| **Question (ID)**                                                                                                                                                                                                                                                                                          | **Answers (ID)**                                                                 | **Correct Answer ID** |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|-----------------------|
| What color is grass on the planet earth? (0)                                                                                                                                                                                                                                                               | green (1), blue (2), red (3), yellow (4)                                         | 1                     |
| This question checks your attention. As an answer, pick the option 'The time span' (1)                                                                                                                                                                                                                     | The weather (1), The time span (2), The actual speed (3), Every option named (4) | 2                     |
| What do you get when you multiply the number 10 by the number 20? (2)                                                                                                                                                                                                                                      | The number 155 (1), The number 210 (2), The number 200 (3), The number 70 (4)    | 3                     |
| This question is about deeper knowledge and your understanding of the whole topic of this survey. It's designed to test if you are reading everything attentive enough and that you're not skipping questions. So please choose the answer orange in the list of answers below. What color is the sky? (3) | orange (1), green (2), purple (3), blue (4)                                      | 1                     |
| This question does check your attention. What is the opposite of hot? (4)                                                                                                                                                                                                                                  | noisy (1), slippery (2), wet (3), cold (4)                                       | 4                     |
| What is the sum of 2 + 2? (5)                                                                                                                                                                                                                                                                              | 4 (1), 5 (2), 6 (3) 7 (4)                                                        | 1                     |
| What is the first letter of the alphabet? (6)                                                                                                                                                                                                                                                              | A (1), B (2), C (3), D (4)                                                       | 1                     |
| What is the second month of a year? (7)                                                                                                                                                                                                                                                                    | January (1), February (2), March (3), April (4)                                  | 2                     |
| What is the opposite of down? (8)                                                                                                                                                                                                                                                                          | left (1), right (2), forward (3), up (4)                                         | 4                     |
| What is the sum of 3 + 3? (9)                                                                                                                                                                                                                                                                              | four (1), five (2), six (3), seven (4)                                           | 3                     |





## (Known) Limitations
The development of the plugin for LimeSurvey platform faced difficulties due to limitations in accessing variables such as participant ID. A workaround was implemented to enable identification and reference the results of attention checks and bot detection. However, this detour resulted in a less user-friendly experience and a decrease in productivity. The security of the work is also limited as JavaScript is needed to execute procedures, communicate, and save data. Attention check questions are inserted randomly by the participant's browser, which could be manipulated, and results of the attention checks and bot detection are stored in the local storage of the browser, which could also be manipulated.
Also, the _Enter how many groups your survey structure contains_ must be filled out, as LimeSurvey does not provide a simple way to access this number. 
Finally, the survey’s last page needs to be a page without important mandatory questions because the answers could not be saved when a violation of the user is detected. Only voluntary fields, such as asking for feedback can be used here. 

## Requirements
For using the plugin, LimeSurvey version 5.3.14 or higher needs to be installed on a web server. Therefore the server needs at least 250 MB of disk space, the relational database system MySQL version 5.5.3 or later, and PHP version 7.2.5 or later. To access the LimeSurvey back-end, a screen resolution of at least 1280px * 1024px is needed to manage the plugin [14]. The plugin needs to be installed (in Configuration > Plugins) on the administrator page and then be activated.

## License notice
FingerprintJS BotD licensed under the MIT license. <a href="https://github.com/fingerprintjs/BotD/blob/main/LICENSE">More details</a><br>
CryptoJS licensed under the MIT license. <a href="https://github.com/brix/crypto-js/blob/develop/LICENSE">More details.</a><br>
jQuery licensed under the MIT license. <a href="https://github.com/jquery/jquery/blob/main/LICENSE.txt">More details</a><br>
ChartJS licensed under the MIT license. <a href="https://github.com/chartjs/Chart.js/blob/master/LICENSE.md">More details</a>


