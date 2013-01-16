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
    var asanas = ['Cobra', 'Warrior I', 'Savasana', 'Warrior 2', 'Eagle',
    'Child', 'Plow', 'Plank', 'Happy Baby', 'Shoulder Stand', 'Lotus', 'Dancer',
    'Pigeon', 'King Pigeon', 'Goddess'];
    asanas.sort();
    
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
