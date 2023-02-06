#' Create List of Inattentive Participants
#'
#' @param fileName, the .csv which is separated by ;
#' @param whichID either "MANUALID" or "LSID"
#'
#' @return a list of participant ids that failed at least two attention checks
#' @export
#'
#' @examples test <- createListInattentiveParticipants("path/to/file/587324.csv", whichID = "MANUALID")
createListInattentiveParticipants <- function(fileName, whichID = c("MANUALID", "LSID")) {
  assertthat::not_empty(fileName)
  assertthat::not_empty(whichID)


  inattPart <- read.delim(file = fileName, sep = ";")

  list_failures_equal_or_greater_two <- c()

  for (i in 1:nrow(inattPart)) {
    if (inattPart[i, ]$FAILURES >= 2) {
      list_failures_equal_or_greater_two <- append(list_failures_equal_or_greater_two, inattPart[i, whichID])
    }
  }

  inattPart <- NULL
  return(list_failures_equal_or_greater_two)
}


#' Create List of Found Bot Activity
#'
#' @param fileName, the .csv which is separated by ;
#' @param whichID either "MANUALID" or "LSID"
#'
#' @return a list of participant ids that showed bot activities
#' @export
#'
#' @examples  test2 <- createListFoundBotActivity("587324.csv", whichID = "MANUALID")
createListFoundBotActivity <- function(fileName, whichID = c("MANUALID", "LSID")) {
  assertthat::not_empty(fileName)
  assertthat::not_empty(whichID)

  botDf <- read.delim(file = fileName, sep = ";")

  list_bot_activity <- c()

  for (i in 1:nrow(botDf)) {
    if (botDf[i, ]$BD.VIOLATION) {
      list_bot_activity <- append(list_bot_activity, botDf[i, whichID])
    }
  }

  botDf <- NULL
  return(list_bot_activity)
}
