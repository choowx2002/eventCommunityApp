export const formatDate = (dateString) => {
    const options = {day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  
  export const formatTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    const date = new Date(timeString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  export const convertTimeToTimestamp = (timeString) => {
    let date = new Date(`1970-01-01T${timeString}Z`);
    return date.getTime()
  }

  export const convertDateToTimestamp = (dateString) => {
    return Date.parse(dateString.replace(/\//g, '-'))
  }