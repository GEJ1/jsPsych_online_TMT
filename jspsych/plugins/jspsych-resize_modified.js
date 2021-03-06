/**
* jspsych-resize
* Steve Chao
*
* plugin for controlling the real world size of the display
*
* documentation: docs.jspsych.org
*
**/

jsPsych.plugins["resize"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'resize',
    description: '',
    parameters: {
      item_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Item height',
        default: 1,
        description: 'The height of the item to be measured.'
      },
      item_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Item width',
        default: 1,
        description: 'The width of the item to be measured.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'The content displayed below the resizable box and above the button.'
      },
      pixels_per_unit: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Pixels per unit',
        default: 100,
        description: 'After the scaling factor is applied, this many pixels will equal one unit of measurement.'
      },
      starting_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Starting size',
        default: 100,
        description: 'The initial size of the box, in pixels, along the larget dimension.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'Label to display on the button to complete calibration.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    

    
    var aspect_ratio = trial.item_width / trial.item_height; //item_width e item_height es dato (se lo pasamos por parametro)

    // variables to determine div size
    // Aca elije cual es la dimension mas grande de las que les pasamos y la asigna a starting_size
    if(trial.item_width >= trial.item_height){ 
      var start_div_width = trial.starting_size;
      var start_div_height = Math.round(trial.starting_size / aspect_ratio);
    } else {
      var start_div_height = trial.starting_size;
      var start_div_width = Math.round(trial.starting_size * aspect_ratio);
    }

    // create html for display
    var html =
      //big div
      '<div id="jspsych-resize-div" style="border: 2px solid steelblue; height: ' +
      start_div_height +
      "px; width:" +
      start_div_width +
      'px; margin: 7px auto; background-color: lightsteelblue; position: relative;">';
    html +=
      //small div 
      `<div id="jspsych-resize-handle" style="cursor: nwse-resize; background-color: red; width: 10px; height: 10px; border: 
        2px solid lightsteelblue; position: absolute; bottom: 0; right: 0;"></div>`;
    html += "</div>" 
    html += '<div id="dpi" style="height: 1in; width: 1in; left: 100%; position: fixed; top: 100%;"></div>' 

   
     

    if (trial.prompt !== null) {
      html += trial.prompt;
    }
    html +=
      //button
      '<a class="jspsych-btn" id="jspsych-resize-btn">' +
      trial.button_label +
      "</a>";

    // render
    display_element.innerHTML = html;


    var dpi_x = document.getElementById('dpi').offsetWidth;
    var dpi_y = document.getElementById('dpi').offsetHeight;
    var width = screen.width / dpi_x;
    var height = screen.height / dpi_y;

    console.log (dpi_x + ' x ' + dpi_y);
    console.log (width + ' x ' + height);

    // listens for the click
    document.getElementById("jspsych-resize-btn").addEventListener('click', function() {
      scale();
      end_trial();
    });

    var dragging = false;
    var origin_x, origin_y;
    var cx, cy;

    var mousedownevent = function(e){
      e.preventDefault();
      dragging = true;
      origin_x = e.pageX; //An integer value, in pixels, indicating the X coordinate at which the mouse pointer was located when the event occurred.
      origin_y = e.pageY;
      // el scale div es esto: document.getElementById("jspsych-resize-div")
      cx = parseInt(scale_div.style.width); //convert to int
      cy = parseInt(scale_div.style.height);
    }

    // Le damos logica al cuadradito pequenio
    display_element.querySelector('#jspsych-resize-handle').addEventListener('mousedown', mousedownevent);

    var mouseupevent = function(e){
      dragging = false;
    }

    document.addEventListener('mouseup', mouseupevent);

    var scale_div = display_element.querySelector('#jspsych-resize-div');

    var resizeevent = function(e){
      if(dragging){
        var dx = (e.pageX - origin_x);
        var dy = (e.pageY - origin_y);

        if(Math.abs(dx) >= Math.abs(dy)){
          scale_div.style.width = Math.round(Math.max(20, cx+dx*2)) + "px";
          scale_div.style.height = Math.round(Math.max(20, cx+dx*2) / aspect_ratio ) + "px";
        } else {
          scale_div.style.height = Math.round(Math.max(20, cy+dy*2)) + "px";
          scale_div.style.width = Math.round(aspect_ratio * Math.max(20, cy+dy*2)) + "px";
        }
      }
    }

    document.addEventListener('mousemove', resizeevent);

    // scales the stimulus
    var scale_factor;
    var final_height_px, final_width_px;

    function scale() {
      final_width_px = scale_div.offsetWidth;
      //final_height_px = scale_div.offsetHeight; //This was commented in original version

      var pixels_unit_screen = final_width_px / trial.item_width;

      // scale_factor = (pixels_unit_screen / trial.pixels_per_unit)*1.4;
      scale_factor = (pixels_unit_screen / trial.pixels_per_unit);
      console.log("pixel_per_unit " + trial.pixels_per_unit + " usado en resize");
     

      document.getElementById("jspsych-content").style.transform = "scale(" + scale_factor + ")";
      // document.getElementsByClassName('jspsych-display-element')[0].style.transform = "scale(" + scale_factor + ")";
      // jspsych-display-element
    };

   

    // function to end trial
    function end_trial() {

      // clear document event listeners
      document.removeEventListener('mousemove', resizeevent);
      document.removeEventListener('mouseup', mouseupevent);

      // clear the screen
      display_element.innerHTML = '';

      // finishes trial

      var trial_data = {
        'final_height_px': final_height_px,
        'final_width_px': final_width_px,
        'scale_factor': scale_factor, 
      }

      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();
