function allow_drop(event) {
    event.preventDefault();
}

function get_dropped_asana(event) {
    return document.getElementById(event.dataTransfer.getData("asana_id"));
}

function set_dropped_asana(event, id) {
    event.dataTransfer.setData("asana_id", event.target.id);
}

function show_edit() {
    document.getElementById("trash").className = "";
    document.getElementById("flow-window").className = "";
    document.getElementById("asanas").className = "";
    document.getElementById("edit-button").style.display = "none";
    document.getElementById("stop-editing").className = "";
}

function hide_edit() {
    document.getElementById("trash").className = "hidden";
    document.getElementById("asanas").className = "hidden";
    document.getElementById("edit-button").style.display = "block";
    document.getElementById("stop-editing").className = "hidden";
}

function hide_instructions() {
    var instructions = document.querySelectorAll(".instructions");
    for (i = 0, len = instructions.length; i < len; i++) {
        instructions[i].style.display = "none";
    }
    document.getElementById("flow").className = "";
}

var Asana = {
    'create': function (name) {
        asana = document.createElement('li');
        asana.innerHTML = name;
        asana.title = name;
        asana.draggable = true;
        return asana;
    },
    
    'hover_begin': function (event) {
        event.target.style.opacity=0.5;
    },
    
    'hover_end': function (event) {
        event.target.style.opacity=1;
    },

    'reorder_drop': function (event) {
        event.stopPropagation();    
        event.target.parentNode.insertBefore(
            Asana.prepare_for_flow(get_dropped_asana(event)), event.target);
        event.target.style.opacity = 1;
        Hash.rebuild();
    },
    
    'flow_drop': function (flow) {
            return function (event) {
                var asana = get_dropped_asana(event);
                flow.appendChild(Asana.prepare_for_flow(asana));
                hide_instructions();
                Hash.rebuild();
        };
    },
    
    'trash_drop': function (flow) {
        return function (event) {
            flow.removeChild(get_dropped_asana(event));
            Hash.rebuild();
        };
    },
    
    'drag_start': function (event) {
        set_dropped_asana(event);
        event.target.style.opacity = 0.5;
    },
    
    'drag_end': function (event) { event.target.style.opacity = 1; },

    'prepare_for_flow': function (asana) {
        if (asana.parentNode != null && asana.parentNode.id != "flow") {
            asana = asana.cloneNode(true);
            asana.id = "asana" + Date.now();
        }

        asana.ondragstart = Asana.drag_start;
        asana.ondragend = Asana.drag_end;
        asana.ondragenter = Asana.hover_begin;
        asana.ondragleave = Asana.hover_end;
        asana.ondrop = Asana.reorder_drop;
        asana.ondragover = allow_drop;
        
        return asana;
    }
}

var Hash = {
    'rebuild': function () {
        var hash = '';
        var asanas = document.getElementById('flow').children;
        
        for (i = 0, len = asanas.length; i < len; i++) {
            hash += Hash.encode_index(asanas[i].getAttribute("data-asana"));
        }
        window.location.hash = $.base64.encode(hash);
    },
    
    'encode_index': function (idx) {
        return String.fromCharCode(parseInt(idx));
    },
    
    'decode_index': function (code) {
        return code.charCodeAt(0);
    }
}

var Setup = {
    'asanas': function (asanas, asana_list) {
        for (i = 0, len = asanas.length; i < len; i++) {
            asana = Asana.create(asanas[i]);
            asana.ondrag = Asana.drag_end;
            asana.ondragstart = Asana.drag_start;
            asana.ondragend = Asana.drag_end;
            asana.id = "asana" + i;
            asana.setAttribute("data-asana", i);
            asana_list.appendChild(asana);
        }
    },
    
    'flow': function (flow, flow_data, asanas) {
        var asana;
        var asana_index;
        var flow_data = $.base64.decode(flow_data.slice(1));
        
        for (i = 0, len = flow_data.length; i < len; i++) {
            asana_index = Hash.decode_index(flow_data[i]);        
            asana = Asana.create(asanas[asana_index]);
            asana.id = "flow-asana"+i;
            asana.setAttribute("data-asana", asana_index);
            
            flow.appendChild(Asana.prepare_for_flow(asana));
        }
    }
}

window.onload = function () {
    var flow_data = window.location.hash;    
    var trash = document.getElementById("trash");
    var flow_window = document.getElementById("flow-window");
    var flow = document.getElementById("flow");
    var asana_list = document.getElementById("asanas");
    var edit_button = document.getElementById("edit-button")
    var asanas = ['Angle',
 'Arm-Pressing Posture',
 'Auspicious',
 'Balance Posture',
 'Bed',
 'Belly-Revolving Posture',
 "Bharadvaja's Twist",
 'Big Toe',
 'Bird of Paradise',
 'Boat',
 'Both Feet Behind Head',
 'Bound Angle',
 'Bow',
 'Bridge',
 'Camel',
 'Cat ',
 'Chair',
 "Child's",
 'Circle',
 "Cobbler's",
 'Cobra',
 'Cockerel',
 'Compass',
 'Concealed Posture',
 'Corpse',
 'Cow Face',
 'Cow',
 'Crane',
 'Crescent Lunge',
 'Crescent Moon',
 'Crocodile',
 'Crow',
 'Dolphin Plank',
 'Dolphin',
 'Dolphin Push-Ups',
 'Down Dog Split',
 'Downward-Facing Dog',
 'Downward-Facing Tree',
 'Dragonfly',
 'Eagle',
 'Ear Pressure',
 'Ear-Pressing',
 'Easy',
 'Eight-Angle',
 "Elephant's Trunk",
 'Equal Standing',
 "Eternal One's",
 'Extended Hand-To-Big-Toe',
 'Extended Puppy',
 'Extended Side Angle',
 'Extended Side Angle Variations',
 'Extended Triangle',
 'Eye of the Needle',
 'Feathered Peacock',
 'Fetus',
 'Fire Log',
 'Firefly',
 'Fish',
 'Flying Crow',
 'Foot Behind Head',
 'Forearm Stand',
 'Four-Limbed Staff',
 'Frog',
 'Full Boat',
 'Garland',
 'Gate',
 'Goddess',
 'Half Bear',
 'Half Boat Posture',
 'Half Forward Bend',
 'Half Frog',
 'Half Lord of the Fishes',
 'Half Lotus',
 'Half Moon',
 'Half Wheel',
 'Hands and Knees Balance',
 'Handstand',
 'Happy Baby',
 'Head Stand',
 'Head to Knee',
 'Head-to-Knee Forward Bend',
 'Headstand',
 'Hero',
 'Heron',
 'High Lunge',
 'High Lunge Variation',
 'Horse',
 'Intense Side Stretch',
 'Inverted Tortoise',
 'King Dancer',
 'King Pigeon',
 'Knee to Ankle',
 'Knees, Chest, and Chin',
 'Legs-Up-the-Wall',
 'Lion',
 'Little Thunderbolt',
 'Lizard',
 'Locust',
 'Lord Of the Fishes',
 'Lord Of the Dance',
 'Lotus',
 'Low Lunge',
 'Lunge',
 'Lunge With a Twist',
 "Marichi's",
 'Monkey',
 'Mountain',
 'Noose',
 'Noose',
 'One Legged Arm Balance',
 'One Legged Dedicated to the Sage Koundinya II',
 'One Legged Supported Headstand',
 'One-Legged King Pigeon',
 'One-Legged King Pigeon II',
 'Open Angle',
 'Peacock',
 'Pelvic Tilts',
 'Pendant',
 'Perfect',
 'Pigeon',
 'Plank',
 'Plow',
 'Pose Dedicated to the Sage Koundinya I',
 'Pose Dedicated to the Sage Koundinya II',
 'Pose Dedicated to the Sage Marichi I',
 'Prosperous',
 'Pyramid',
 'Rabbit',
 'Raised Hands',
 'Reclining Big Toe',
 'Reclining Bound Angle',
 'Reclining Hero',
 'Reverse Warrior',
 'Revolved Half Moon',
 'Revolved Head-to-Knee',
 'Revolved Side Angle',
 'Revolved Triangle',
 'Royal Pigeon',
 'Scale',
 'Scorpion',
 'Seated Forward Bend',
 'Seated Wide Legged Straddle',
 'Shoulder Stand',
 'Shoulder-Pressing',
 'Side Crane',
 'Side Crow',
 'Side Plank',
 'Side-Reclining Leg Lift',
 'Sitting Down',
 'Sleeping Vishnu',
 'Sphinx',
 'Staff',
 'Standing Big Toe',
 'Standing Forward Bend',
 'Standing Half Forward Bend',
 'Standing Split',
 'Standing Straddle Forward Bend',
 'Straight Angle',
 'Sugarcane',
 'Supine Spinal Twist',
 'Supported Headstand',
 'Supported Shoulderstand',
 'The Abdominal Lock',
 'The Great Seal Posture',
 'The Liberated',
 'Thunderbolt',
 'Tortoise',
 'Tree',
 'Triangle',
 'Tripod Headstand',
 'Twisted One Legged Arm Balance',
 'Two-Legged Inverted Staff',
 'Unsupported Shoulder Stand',
 'Upward Bow',
 'Upward Facing Dog',
 'Upward Facing Two-Foot Staff ',
 'Upward Lotus',
 'Upward Plank',
 'Upward Salute',
 'Upward-Facing Dog',
 'Warrior I',
 'Warrior II',
 'Warrior III',
 'Wheel',
 'Wide-Angle Seated Forward Bend',
 'Wide-Legged Forward Bend',
 'Wild Thing'];
    
    if (asana_list.innerHTML == '') {
        Setup.asanas(asanas, asana_list);
    } else {
        for (i = 0, len = asana_list.children.length; i < len; i++) {
            asana = asana_list.children[i];
            asana.ondrag = Asana.drag_end;
            asana.ondragstart = Asana.drag_start;
            asana.ondragend = Asana.drag_end;
        }
    }
    
    if (flow_data.length > 0) {
        Setup.flow(flow, flow_data, asanas);
        
        edit_button.style.display = "block";
        
        hide_instructions();
        document.getElementById("flow-window").className = "";
    } else {
        show_edit();
        asana_list.className = "";
    }
    
    edit_button.onclick = show_edit;
    
    trash.ondragover = allow_drop;
    trash.ondrop = Asana.trash_drop(flow);
    
    flow_window.ondragover = allow_drop;
    flow_window.ondrop = Asana.flow_drop(flow);
    document.getElementById("stop-editing").onclick = hide_edit;
    
    $('#flow-window').blurjs({
        source: '#background-loader',
        radius: 20,
        overlay: 'rgba(0,51,51,0.2)'
    });
}
