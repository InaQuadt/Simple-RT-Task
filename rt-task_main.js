/* Change 1: Adding the image hosting site */
// define the site that hosts stimuli images
// usually https://<your-github-username>.github.io/<your-experiment-name>/
var repo_site = "https://inaquadt.github.io/Simple-RT-Task/";

/* create timeline */
var timeline = [];

/* define welcome message trial */
var welcome_block = {
  type: "html-keyboard-response",
  stimulus: "Welcome to the experiment. Press any key to begin."
};
timeline.push(welcome_block);

/* define instructions trial */
var instructions = {
  type: "html-keyboard-response",
  stimulus: "<p>In this experiment, a shape will appear on the screen </p>" +
      "<p> If a <strong>circle</strong> appears, press the letter <strong>F</strong> on the keyboard as fast as you can. </p>" +
      "<p> If a <strong>triangle</strong> appears, press the letter <strong>J</strong> on the keyboard as fast as you can. </p>" +
      "<div style='width: 700px;'>"+
      "<div style='float: left;'><img src='" + repo_site + "img/circle.png'></img>" + // Change 2: Adding `repo_site` in `instructions`
      "<p class='small'><strong>Press the F key</strong></p></div>" +
      "<div class='float: right;'><img src='" + repo_site + "img/triangle.png'></img>" + // Change 2: Adding `repo_site` in `instructions`
      "<p class='small'><strong>Press the J key</strong></p></div>" +
      "</div>"+
      "<p style='color: red'><strong> Press any key to begin. </strong></p>",
  post_trial_gap: 2000
};
timeline.push(instructions);

/* test trials */

/*var test_stimuli = [
  { stimulus: repo_site + "img/blue.png", // Change 3: Adding `repo_site` in `test_stimuli`
   data: { test_part: 'test', correct_response: 'f' } },
  { stimulus: repo_site + "img/orange.png", // Change 3: Adding `repo_site` in `test_stimuli`
  data: { test_part: 'test', correct_response: 'j'} }
];*/
var test_stimuli = [
  { stimulus: repo_site + "img/circle.png", side: 'left', data: { test_part: 'test', correct_response: 'f', side: 'left'}}, //congruent
  { stimulus: repo_site + "img/triangle.png", side: 'left', data: { test_part: 'test', correct_response: 'j', side: 'left' }}, //INcongruent
  { stimulus: repo_site + "img/circle.png", side: 'right', data: { test_part: 'test', correct_response: 'f', side: 'right'}}, //INcongruent
  { stimulus: repo_site + "img/triangle.png", side: 'right', data: { test_part: 'test', correct_response: 'j', side: 'right'}} //congruent
];

var fixation = {
  type: 'html-keyboard-response',
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: function(){
    return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
  },
  data: {test_part: 'fixation'}
}

/*var test = {
  type: "image-keyboard-response",
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: ['f', 'j'],
  data: jsPsych.timelineVariable('data'),
  on_finish: function(data){
    data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
  },
}*/

var test = {
  type: "html-keyboard-response",
  stimulus: function() {
      // define a variable called "shift" that determines the left/right shift value, based on "side" from timeline variables
      var shift;
      if (jsPsych.timelineVariable('side', true) == 'left') {
        // shift image 300 px to the left - percentages also work
        shift = "-600px";
      } else if (jsPsych.timelineVariable('side', true) == 'right') {
        // shift image 300 px to the right - percentages also work
        shift = "600px";
      }
      // combine the "stimulus" (image file path) and "shift" in a single HTML string to use for the trial stimulus
      return '<img src="'+jsPsych.timelineVariable('stimulus',true)+'" style="transform: translate('+shift+'); width:300px;"/>'
  },
  choices: ['f', 'j'],
  data: jsPsych.timelineVariable('data'),
  on_finish: function(data){
    data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
  }
};


var test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  repetitions: 5,
  randomize_order: true
}
timeline.push(test_procedure);

/* define debrief */

var debrief_block = {
  type: "html-keyboard-response",
  stimulus: function() {

    var trials = jsPsych.data.get().filter({test_part: 'test'});
    var correct_trials = trials.filter({correct: true});
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    var rt = Math.round(correct_trials.select('rt').mean());

    return "<p>You responded correctly on "+accuracy+"% of the trials.</p>"+
    "<p>Your average response time was "+rt+"ms.</p>"+
    "<p>Press any key to complete the experiment. Thank you!</p>";

  }
};
timeline.push(debrief_block);
