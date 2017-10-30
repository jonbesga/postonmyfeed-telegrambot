module.exports = {
  messageHasURL: (text) => {
    const holyGrail = /((http|ftp|https):\/\/)?([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/g
    const results = text.match(holyGrail)
    if(results){
      return true
    }
    return false 
  }
}