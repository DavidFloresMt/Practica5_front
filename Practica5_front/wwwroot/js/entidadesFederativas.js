function obtenerCatEntFederativas(idSeleccionCatEntFed) {
    jQuery.ajax({
        url: "https://localhost:7015/api/catEntFederativas/obtenerEntFederativas",
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            if (data != null) {
                console.log(data);

                let dropDownList = "'<select>";
                $.each(data, function (ind, elem) {
                    if (idSeleccionCatEntFed == elem.id) {
                        dropDownList += "<option selected='true' value=" + elem.id + ">" + elem.estado + "</option>";
                    } else {
                        dropDownList += "<option value=" + elem.id + ">" + elem.estado + "</option>";
                    }
                });
                dropDownList += "</select>'";

                $("#cboxEFederativa").html(dropDownList);
            }
        }
    });
}