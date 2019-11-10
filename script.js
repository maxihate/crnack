let myRequest = new Request('message_1.json');
let songsYT = [];
let songsSpotify = [];
let songsAll = [];
let stats = {};

fetch(myRequest)
.then(function(response) {
  if (!response.ok) {
    throw new Error('HTTP error, status = ' + response.status);
  }
  return response.json();
})
.then(function(response) {

  let msgs = response.messages;

  //scan json for messages, supply arrays with objects
  msgs.forEach(msg => {
      if (!msg.share) {
        return "bad massage";
      } else if (msg.share.link.includes("youtu")) {
        songsYT.push({"link": msg.share.link, "sender_name": msg.sender_name, "timestamp": msg.timestamp_ms});
      } else if (msg.share.link.includes("spotify")) {
        songsSpotify.push({"link": msg.share.link, "sender_name": msg.sender_name, "timestamp": msg.timestamp_ms});
      }
    }
  );

  //pass everything to songsALl
  songsAll = [...songsYT, ...songsSpotify];

  //populate songs
  songsYT.forEach(song => { //or songsSpotify
    let div = document.createElement("div");
    div.innerHTML = song.link;
    document.body.appendChild(div);
  });

  //list of participants
  let people = function() {
    let arr = [];

    response.participants.forEach(person => {
      arr.push(person.name);
    });

    return arr.sort();
  };

  //calculate how many songs each participant shared
  let calculateStats = function(person) {
    let count = 0;

    for (song of songsAll) {
      if (song.sender_name == person) {
        count += 1;
      }
    }

    return count;
  }

  for (person of people()) {
    stats[person] = calculateStats(person);
  }

});
