---
title: "SurveyGuardian: Improving Online Surveys for Research by Detecting Inattentiveness and Undesirable Behavior"
authors:
- affiliation: 1
  name: Mark Colley
  orcid: 0000-0001-5207-5029
- affiliation: 1
  name: Lukas Gruler
  orcid: 0000-0003-0142-4115
- affiliation: 1
  name: Enrico Rukzio
  orcid: 0000-0002-4213-2226

date: "28 January, 2023"
output: 
  pdf_document:
    latex_engine: xelatex
bibliography: bibliography.bib
tags:
- attention checks
- bot detection
- limesurvey
affiliations:
- index: 1
  name: Ulm University, Germany
---

# Aims of the Package

In applied research, user feedback in various forms is necessary, including employing online surveys. 


# Statement of Need
Online studies, which are filled out by the participant in their browser, entail opportunities but also challenges [@online-studies; @online-studies2; @Maniaci.2014]. Conducting this type of study can be facilitated by simplified data collection, lower costs, improved participant-acquisition and accessibility [@online-studies; @online-studies2] and, generally speaking, may even enable the study to be conducted at all since no direct contact with the participant is necessary. Disadvantages also come with it, such as the participants clicking through the survey without being attentive, giving incorrect answers or even cheating [@online-studies; @Maniaci.2014]. This can lead to a data bias which endangers the result of the entire study.

# Comparison to Other Services/Packages

There exist services like [Prolific](https://www.prolific.co/), [MTurk](https://www.mturk.com/), [SurveySwap](https://www.surveyswap.io/), which do preliminary checks. However, these services still have a high bot rate. Using these providers, participants are redirected to the researcher's data collection platform (LimeSurvey, Google Forms, etc.).

**SurveyGuardian** helps to detect the bots and inattentive participants that make it through the initial screenings.


# Examples of Features

**https://github.com/SurveyGuardian/SurveyGuardian** provides various functions for detecting bots and inattentive behavior. However, the main goal of the plugin is to enable researchers to quickly and automatically include compliant attention checks and bot detection features. The client-side logic is shown in \autoref{fig:client-logic}.

![The client-side logic happening in the background of the users browser (modeled using BPMN 2.0).\label{fig:client-logic}](client-logic.jpg)


# Licensing and Availability

**SurveyGuardian** is licensed under the GNU General Public License (v3.0), with all source code stored at GitHub (https://github.com/SurveyGuardian/SurveyGuardian), and with a corresponding issue tracker for bug reporting and feature enhancements. In the spirit of honest and open science, we encourage requests/tips for fixes, feature updates, as well as general questions and concerns via direct interaction with contributors and developers, by [filing an issue](https://github.com/SurveyGuardian/SurveyGuardian/issues/).

# Acknowledgments


# References