var tabla_empleado;
$(document).ready(function () {
    tabla_empleado = $("#tblEmpleados").DataTable({
        info: false,
        ordering: false,
        paging: false,

        "ajax": {
            "url": "https://localhost:7015/api/empleados/obtenerEmpleados",
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "numeroNomina" },
            { "data": "nombre" },
            { "data": "apellidoPaterno" },
            { "data": "apellidoMaterno" },
            {
                "data": "idEstadoNavigation", "render": function (data) {
                    return data.estado;
                }
            },
            {
                "data": "id", "render": function (data) {
                    return "<button class='btn btn-primary btn-sm' type='button' onclick='abrirModal(" + data + ")'><i class='fas fa-pen'></i></button>" +
                        "<button class='btn btn-danger btn-sm ml-2' type='button' onclick='eliminar(" + data + ")'><i class='fa fa-trash'></i></button>"
                },
                "orderable": false,
                "searchable": false,
                "width": "150px"
            }
        ],
        dom: 'Bfrtip',
        buttons: [
            {
                text: 'Agregar Nuevo',
                attr: { class: 'btn btn-success btn-sm' },
                action: function (e, dt, node, config) {
                    abrirModal(0)
                }
            }
        ]
    });
    cerrarModal();
});

function abrirModal(idEmpleado) {
    $("#hdnIdEmpleado").val(idEmpleado);

    if (idEmpleado != 0) {

        jQuery.ajax({
            url: "https://localhost:7015/api/empleados/" + idEmpleado,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {

                if (data != null) {
                    //alert(data.idEstadoNavigation.id);
                    //alert(data.idEstadoNavigation.estado);

                    $("#txtNombre").val(data.nombre);
                    $("#txtAPaterno").val(data.apellidoPaterno);
                    $("#txtAMaterno").val(data.apellidoMaterno);
                    
                    obtenerCatEntFederativas(data.idEstadoNavigation.id);
                }
            }
        });
    } else {
        $("#txtNombre").val("");
        $("#txtAPaterno").val("");
        $("#txtAMaterno").val("");
        obtenerCatEntFederativas(1);
    }
    $("#formModalEmpleado").modal('show');
    $("#cboxEFederativa option[value=3]").attr("selected", true);
}

function Guardar() {
    let idEmpleado = $("#hdnIdEmpleado").val();
    if (idEmpleado != 0) {

        const entidadFederativa = {
            id: parseInt($("#cboxEFederativa").val()),
            estado: $('select[name="cboxEFederativa"] option:selected').text()
        }
        const empleado = {
            id: idEmpleado,
            numeroNomina: '23',
            nombre: $("#txtNombre").val(),
            apellidoPaterno: $("#txtAPaterno").val(),
            apellidoMaterno: $("#txtAMaterno").val(),
            idEstado: parseInt($("#cboxEFederativa").val()),
            idEstadoNavigation: entidadFederativa
        }

        jQuery.ajax({
            url: "https://localhost:7015/api/empleados/" + idEmpleado,
            type: "PUT",
            data: JSON.stringify(empleado),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log(data);

                if (!data.error) {
                    tabla_empleado.ajax.reload();
                    cerrarModal();
                }
            },
            error: function (error) {
                tabla_empleado.ajax.reload();
                console.log(error)
            }
        });
        tabla_empleado.ajax.reload();
        cerrarModal();
    }
    else {

        const entidadFederativa = {
            id: parseInt($("#cboxEFederativa").val()),
            estado: $('select[name="cboxEFederativa"] option:selected').text()
        }

        const empleado = {
            id: 0,
            numeroNomina: '23',
            nombre: $("#txtNombre").val(),
            apellidoPaterno: $("#txtAPaterno").val(),
            apellidoMaterno: $("#txtAMaterno").val(),
            idEstado: parseInt($("#cboxEFederativa").val()),
            idEstadoNavigation: entidadFederativa
        }

        jQuery.ajax({
            url: "https://localhost:7015/api/empleados/registrarEmpleado",
            type: "POST",
            data: JSON.stringify(empleado),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log(data);

                if (!data.error) {
                    tabla_empleado.ajax.reload();
                    cerrarModal();
                }
            },
            error: function (error) {
                tabla_empleado.ajax.reload();
                console.log(error)
            }
        });
        tabla_empleado.ajax.reload();
        cerrarModal();
    }
}

function eliminar(idEmpleado) {
    if (confirm("¿Realmente desea eliminar el registro?")) {
        jQuery.ajax({
            url: "https://localhost:7015/api/empleados/" + idEmpleado,            
            type: "DELETE",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log(data);

                if (!data.error) {
                    tabla_empleado.ajax.reload();
                    cerrarModal();
                }
            },
            error: function (error) {
                tabla_empleado.ajax.reload();
                console.log(error)
            }
        });
        tabla_empleado.ajax.reload();
        cerrarModal();
    }
    tabla_empleado.ajax.reload();
    cerrarModal();
}

function cerrarModal() {
    $('#formModalEmpleado').modal('hide');
    tabla_empleado.ajax.reload();
}