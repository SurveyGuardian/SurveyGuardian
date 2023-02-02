<?php
/**
 * @author Lukas Gruler <lukas.gruler@uni-ulm.de>
 * @copyright 2022 Lukas Gruler <https://uni-ulm.de/>
 * @license GNU
 * @version 1.0.0
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

class surveyGuardian extends PluginBase 
{
    protected $storage = 'DbStorage';
    static protected $name = 'surveyGuardian';
    static protected $description = 'Detecting inattentive or malicious behaving participants.';

    protected $counter = 0; 
    protected $participant_id = 0;

    protected $settings = array(
        'test' => array(
            'type' => 'string',
            'label' => 'Message'
        ),
    );
  
    public function init()
    {
        /**
         * Here you should handle subscribing to the events your plugin will handle
         */
        $this->subscribe('afterPluginLoad');
        $this->subscribe('beforeSurveySettings');
        $this->subscribe('newSurveySettings');
        $this->subscribe('beforeQuestionRender');
        $this->subscribe('afterSurveyComplete', 'showTheResponse');
    }

    public function afterPluginLoad() {
        $survey_url = $_SERVER['REQUEST_URI'];
        
        foreach($_GET as $key => $value)
        {  
            // get participant id frmo url parameters and save to localstorage
            if ($key === "id") {
                $participant_id = $value;
                echo "<script>localStorage.setItem('ls-pid', '".$participant_id."');</script><noscript>IMPORTANT: You need to activate JavaScript!</noscript>";
            }
        }
    }

    public function beforeQuestionRender() 
    {
        if (!$this->getEvent()) {
            throw new CHttpException(403);
        }
        $this->registerNeededAssets();
        $surveyId = $this->getEvent()->get("surveyId");
        $gid = $this->getEvent()->get("gid");

        // initial backend settings from user under "simple plugin settings"
        if ($this->counter < 1) {

            $oEvent = $this->event;

            $page_count = $this->get('group-count', 'Survey', $oEvent->get('surveyId'));
            echo "<input style='display:none;' id='total_pagecount' value='".$page_count."'>";

            $option_attentionchecks = $this->get('attention-checks', 'Survey', $oEvent->get('surveyId'));
            echo "<input style='display:none;' id='option_attentionchecks' value='".$option_attentionchecks."'>";

            $attentioncheck_count = $this->get('ac-count', 'Survey', $oEvent->get('surveyId'));
            echo "<input style='display:none;' id='attentionchecks_count' value='".$attentioncheck_count."'>";

            $option_botdetection = $this->get('bot-detection', 'Survey', $oEvent->get('surveyId'));
            echo "<input style='display:none;' id='option_botdetection' value='".$option_botdetection."'>";

            $option_manualid = $this->get('manual-id', 'Survey', $oEvent->get('surveyId'));
            echo "<input style='display:none;' id='option_manualid' value='".$option_manualid."'>";

            $option_manualid_field = $this->get('manual-id-field', 'Survey', $oEvent->get('surveyId'));
            echo "<input style='display:none;' id='option_manualid_field' value='".$option_manualid_field."'>";

            $option_debug_mode = $this->get('debug-mode', 'Survey', $oEvent->get('surveyId'));
            echo "<input style='display:none;' id='option_debug_mode' value='".$option_debug_mode."'>";

            echo "<input style='display:none;' id='surveyid' value='".$surveyId."'>";
        }

        $this->counter++;
    }

    /**
     * Register needed script and css
     */
    private function registerNeededAssets()
    {
        App()->clientScript->registerScriptFile(App()->assetManager->publish(dirname(__FILE__) . '/assets/jquery-3.6.0.min.js'));
        App()->clientScript->registerScriptFile(App()->assetManager->publish(dirname(__FILE__) . '/assets/crypto-js.min.js'));
        App()->clientScript->registerScriptFile(App()->assetManager->publish(dirname(__FILE__) . '/assets/checker.js'));
    }

    /**
     * This event is fired by the administration panel to gather extra settings
     * available for a survey.
     * The plugin should return setting meta data.
     * @param PluginEvent $event
     */
    public function beforeSurveySettings()
    {
        $url_param = parse_url($_SERVER['REQUEST_URI']);
        if (isset($url_param["query"])) {
            parse_str($url_param["query"], $param);
            if (isset($param["surveyid"])) {
                $surveyId = $param["surveyid"];
            } else {
                $surveyId = 0;
            }
        }

        $temp_path = getcwd()."/upload/plugins/SurveyGuardian/assets/survey-tables/".$surveyId.".csv";
        if(file_exists($temp_path)) {
            $dl_path = 'href="../../upload/plugins/SurveyGuardian/assets/survey-tables/'.$surveyId.'.csv"';
        } else {
            $dl_path = "";
        }  

        $event = $this->event;
        $event->set("surveysettings.{$this->id}", array(
            'name' => get_class($this),
            'settings' => array(    
                'info0' => array(
                    'type' => 'info',
                    'content' => '<p><strong><span class="cl-warning">Important information:</span><br>Due to technical limitations the plugin can only show attention checks on all pages of the survey <u>except the last one</u>.<br>You can use the last page of your survey to show non-mandatory questions such as feedback fields.</strong></p>',
                ),       
                'info1' => array(
                    'type' => 'info',
                    'content' => '<h4>General Settings</h4>',
                ), 
                'group-count' => array(
                    'type' => 'int',
                    'label' => '<span class="cl-warning">Required</span>: Enter how many groups your survey structure contains.',
                    'current' => $this->get('group-count', 'Survey', $event->get('survey')),
                    'default' => 1,
                ),
                'info2' => array(
                    'type' => 'info',
                    'content' => '<h4>Attention Check Settings</h4>',
                ),       
                'attention-checks'=>array(
                    'type'=>'checkbox',
                    'label'=>'Attention Checks',
                    'help'=>'If you turn on attention checks, attention checking questions will be shown randomly in your survey to check participant`s attention',
                    'current' => $this->get('attention-checks', 'Survey', $event->get('survey')),
                    'default' => 0,
                ),
                'ac-count'=>array(
                    'type'=>'int',
                    'label'=>'Number of Attention Checks per Page',
                    'help'=>'How many attention checks should be shown to the user per page?',
                    'current' => $this->get('ac-count', 'Survey', $event->get('survey')),
                    'default'=>1,
                ),
                'info3' => array(
                    'type' => 'info',
                    'content' => '<h4>Malicious Behavior Detection Settings</h4>',
                ), 
                'bot-detection'=>array(
                    'type'=>'checkbox',
                    'label'=>'Malicious Behavior Detection',
                    'help'=>'If you turn on malicious behavior detection, the system automatically checks the participant`s browser for any inhuman actions. <a target="_blank" href="https://github.com/fingerprintjs/BotD">More information about the tool FingerprintJS</a>.',
                    'current' => $this->get('bot-detection', 'Survey', $event->get('survey')),
                    'default'=>0,
                ),
                'info4' => array(
                    'type' => 'info',
                    'content' => '<h4>Manual ID Settings for External Platforms</h4>',
                ), 
                'manual-id'=>array(
                    'type'=>'checkbox',
                    'label'=>'Use manual ID input by user',
                    'help'=>'If activated, a text input field is needed to let the users put in their ID as first input field of your whole survey!',
                    'current' => $this->get('manual-id', 'Survey', $event->get('survey')),
                    'default'=>0,
                ),
                'info6' => array(
                    'type' => 'info',
                    'content' => '<h4>Debug mode</h4>',
                ), 
                'debug-mode'=>array(
                    'type'=>'checkbox',
                    'label'=>'Enable debug mode<br><span class="cl-warning">Only use for unpublished surveys</span>',
                    'help'=>'If activated, the plugin will show extended logging data in the browser console for debugging purposes. Do not use for public surveys.',
                    'current' => $this->get('debug-mode', 'Survey', $event->get('survey')),
                    'default'=>0,
                ),
                'info5' => array(
                    'type' => 'info',
                    'content' => '<h3>Table of failed User Attempts (SurveyID: '.$surveyId.')</h3><a download class="cl-download" '.$dl_path.'><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><rect id="ArtBoard1" x="0" y="0" width="16" height="16" style="fill:none;"/><g id="ArtBoard11" serif:id="ArtBoard1"><path d="M5.333,13.333l2,0l0,-3.333l1.334,0l-0,3.333l2,0l-2.667,2.667l-2.667,-2.667Zm7.653,-8.605c-0.141,-2.634 -2.315,-4.728 -4.986,-4.728c-2.671,0 -4.845,2.094 -4.986,4.728c-1.713,0.309 -3.014,1.804 -3.014,3.605c0,2.025 1.642,3.667 3.667,3.667l2.333,0l0,-1.333l-2.333,-0c-1.287,-0 -2.334,-1.047 -2.334,-2.334c0,-1.864 1.653,-2.555 2.956,-2.48c-0.112,-2.812 1.472,-4.52 3.711,-4.52c2.302,0 3.927,1.865 3.711,4.52c1.164,-0.03 2.956,0.501 2.956,2.48c-0,1.287 -1.047,2.334 -2.334,2.334l-2.333,-0l0,1.333l2.333,0c2.025,0 3.667,-1.642 3.667,-3.667c0,-1.801 -1.301,-3.296 -3.014,-3.605Z" style="fill:#328637;fill-rule:nonzero;"/></g></svg> Download CSV</a>
                    <style>
                    .form-group label.control-label {
                        text-align: left;
                        max-width: 35%;
                        padding-left: 40px;
                    }
                    .col-sm-6.controls {
                        max-width: 35%
                    }
                    .cl-download {
                        padding-left: 25px;
                        color: #328637;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }
                    a.cl-download:not([href]) {
                        cursor: not-allowed;
                        color: grey;
                    }
                    span.cl-warning {
                        color: red;
                    }
                    </style>
                    <script>
                        /* CHECKBOX LOGIC */
                        var obj_ac = document.getElementById("plugin_surveyGuardian_attention-checks");
                        var obj_bd = document.getElementById("plugin_surveyGuardian_bot-detection");

                        var obj_ac_field = document.getElementById("plugin_surveyGuardian_ac-count");

                        toggleAC(obj_ac.checked);

                        function toggleAC(bool) {
                            if (bool) {
                                obj_ac_field.disabled = false;
                            } else {
                                obj_ac_field.disabled = true;
                            }
                        }

                        obj_ac.addEventListener("change", function() {
                            toggleAC(obj_ac.checked);
                        });
                        
                        /* INPUT VALIDATION LOGIC */
                        var val_fields = [document.getElementById("plugin_surveyGuardian_group-count"), document.getElementById("plugin_surveyGuardian_ac-count")]

                        val_fields.forEach(function(input) {
                            if (input.value.length == 0) {
                                input.value = 1;
                            }
                            input.addEventListener("change", function(e) {
                              if (e.target.value <= 0) {
                                e.target.value = 1;
                              }
                            })
                        });

                        /* AC MIN VALUE ALERT */
                        var numb_ac = document.getElementById("plugin_surveyGuardian_group-count");
                        if (numb_ac.value.length == 0 || numb_ac.value < 1) {
                            console.log("true");
                            save_btn.disabled = true;
                        }
                        if (numb_ac.value == 1) {
                            showAlertInfo(true);
                        }
                        numb_ac.addEventListener("input", function (e) {
                            if (numb_ac.value <= 1) {
                                showAlertInfo(true);
                            } else {
                                showAlertInfo(false);
                            }
                        });
                        function showAlertInfo(bool) {
                            if (bool == true) {
                                if (!(document.getElementById("custom_alert_info"))) {
                                    const newDiv = document.createElement("div");
                                    newDiv.setAttribute("id", "custom_alert_info");
                                    newDiv.innerHTML = "<span class=\x22cl-warning\x22>There will be no attention checks if there is only 1 group (see <i>Important Information</i>).</span>";
                                    const currentDiv = numb_ac;
                                    currentDiv.after(newDiv);
                                }
                            } else {
                                if (document.getElementById("custom_alert_info"))
                                    document.getElementById("custom_alert_info").remove();
                            }
                        }
                    </script>',
                ),              
            )
        ));
    }


    public function newSurveySettings()
    {
        $event = $this->event;
        foreach ($event->get('settings') as $name => $value)
        {
            $this->set($name, $value, 'Survey', $event->get('survey'));
        }
    }  

    public function showTheResponse() 
    {
        $this->registerNeededAssetsEndscreen();
        $event      = $this->getEvent();
        $surveyId   = $event->get('surveyId');
        $responseId = $event->get('responseId');
        $response   = $this->pluginManager->getAPI()->getResponse($surveyId, $responseId);

        
        $event->getContent($this)
              ->addContent('<div id="custom-endscreen">
                                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                                <h2>Please wait. Redirecting to end page</h2>
                            </div>
                            <div>
                                <input style=\'display:none;\' id=\'surveyid\' value=\''.$surveyId.'\'>
                            </div>');
                            // <div>
                            // You response was:<br/><pre>' . print_r($response, true) . '</pre>
                            // </div>
    }


    /**
     * Register needed script and css
     */
    private function registerNeededAssetsEndscreen()
    {
        App()->clientScript->registerScriptFile(App()->assetManager->publish(dirname(__FILE__) . '/assets/jquery-3.6.0.min.js'));
        App()->clientScript->registerScriptFile(App()->assetManager->publish(dirname(__FILE__) . '/assets/crypto-js.min.js'));
        App()->clientScript->registerScriptFile(App()->assetManager->publish(dirname(__FILE__) . '/assets/handler.js'));
        App()->clientScript->registerCssFile(App()->assetManager->publish(dirname(__FILE__) . '/assets/customstyle.css'));
    }
}
