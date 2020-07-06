var dynamicDivClone = $("#dynamicPropertyDivToggle").clone();
var staticDivClone = $("#staticPropertyDivToggle").clone();

function insertDynamicPropertyDetail() {
	const inputs = $("#dynamicPropertyDiv").children();
	const key = inputs[0];
	console.log(key.text);

	for(var i=1; i<inputs.length; i++) {
		console.log(inputs[i]);
	}
}

function insertDiv(id, div) {
	id.append(div);
}

function insertStaticPropertyDetail() {
	const div = `
				<div>
					<h4> Add Static Property</h4>
					<label>Enter Key Name: </label>
					<input type="text" name="staticPropertyName">
					<br>
					<label>Enter Key Value: </label>
					<input type="text" name="staticPropertyValue"><br><br>
					<button type="button" class="addPropertyToForm">Add Property</button>
				</div>`;

	$("#addProperties").before(div);
}

function addProperty(key, value, id) {
	const div = `
				<div class="form-group form-row">
					<label class="col-sm-2 col-form-label">${key}</label>
					<input class="form-control col-sm-4" type="text" name="${key}" value="${value}">
					<input class="btn btn-outline-secondary ml-4 deleteButton" type="button" value="delete">
				</div>
				`;

	id.append(div);
}

// Deleting property on clicking delete button...
$(document).ready( function() { 
	$(document).on('click', '.deleteButton', function() {
		$(this).closest('div').remove();
	});
});


// Adding static properties to the Form....
$(document).ready( function() { 
	$(document).on('click', '.addStaticPropertyButtonId', function() {
		const key = $("#staticPropertyDivToggle").find("input")[0].value;
		const value = $("#staticPropertyDivToggle").find("input")[1].value;
		const id = $("#propertiesDiv");

		if($(this).hasClass('btn-primary')) {
			addProperty(key, value, id);
		}
		
		$("#addProperties option[value=no_option]").prop('selected', 'selected');
		$("#addProperties").toggle();
		$("#staticPropertyDivToggle").replaceWith(staticDivClone.clone()).toggle();
	});
});

//Dealing with dynamic...
$(document).ready( function() {
	$(document).on("click", "#addDynamicSubPropertyButtonId", function() {
		const key = $("#dynamicPropertyDivToggle").find("select")[0].value;
		const value = $("#dynamicPropertyDivToggle").find("select")[1].value;
		
		const id = $("#dynamicPropertyDiv");

		addProperty(key, value, id);
	});

	$(document).on("click", ".addDynamicPropertyButtonId", function() {
		const div = $("<div>");
        const id = $("#propertiesDiv");
        
		const inputs = $("#dynamicPropertyDiv input[type=text]")
		
		if($(this).hasClass('btn-primary')) {
			div.append("<hr>");
			// div.append(`<label class="input-group-text" > ${inputs[0].value }: </label>`)

			for(var i=1; i<inputs.length; i++) {
				const key = inputs[0].value+"["+inputs[i].name+"]";
				const value = inputs[i].value;
				
				addProperty(key, value, div);
			}
			div.append('<input class="btn btn-outline-secondary deleteButton" type="button" value="delete">');
			div.append("<hr>");
			
			insertDiv(id, div);
		}

		$("#dynamicPropertyDivToggle").replaceWith(dynamicDivClone.clone()).toggleClass("d-none");
		$("#addProperties").toggle();
		$("#addProperties option[value=no_option]").prop('selected', 'selected');
	});
});



// checks which to run...
$(document).ready( function() { 
	$(document).on('change', '#addProperties', function() {
		if( $("#addPropertyType").val() === 'static') {
			$("#addProperties").toggle();
			$("#staticPropertyDivToggle").toggleClass('d-none');
		}
		else if ($("#addPropertyType").val() === 'dynamic') {
			$("#addProperties").toggle();
			$("#dynamicPropertyDivToggle").toggleClass('d-none');
		}
	});
});


// dealing with form
$('#myForm').submit( function() {
	return $(this).serializeJSON();
});