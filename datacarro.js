let aVehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
let editIndex = null; // Para controlar edición

document.addEventListener("DOMContentLoaded", () => {
    const btnGuardar = document.getElementById("btnGuardar");

    window.agregarVehiculo = () => {
        let marca = document.getElementById("marca").value;
        let modelo = document.getElementById("modelo").value;
        let año = document.getElementById("año").value;
        let costo = document.getElementById("costo").value;
        let placa = document.getElementById("placa").value;
        let imagenInput = document.getElementById("imagen").files[0];

        if ([marca, modelo, año, costo, placa].some(campo => campo.trim() === "")) {
            Swal.fire({ title: "ERROR", text: "Falta llenar campos!!!", icon: "error" });
            return;
        }

        const processImage = (imagenBase64) => {
            if (editIndex !== null) {
                // Actualización de vehículo existente
                aVehiculos[editIndex] = { marca, modelo, año, costo, placa, imagen: imagenBase64 || aVehiculos[editIndex].imagen };
                editIndex = null;
            } else {
                // Creación de nuevo vehículo
                const vehiculo = { marca, modelo, año, costo, placa, imagen: imagenBase64 };
                aVehiculos.push(vehiculo);
            }

            guardarYRefrescar();
        };

        if (imagenInput) {
            const reader = new FileReader();
            reader.onload = () => processImage(reader.result);
            reader.readAsDataURL(imagenInput);
        } else {
            processImage("");
        }
    };

    window.editarVehiculo = (index) => {
        const vehiculo = aVehiculos[index];
        editIndex = index;

        document.getElementById("marca").value = vehiculo.marca;
        document.getElementById("modelo").value = vehiculo.modelo;
        document.getElementById("año").value = vehiculo.año;
        document.getElementById("costo").value = vehiculo.costo;
        document.getElementById("placa").value = vehiculo.placa;
        document.getElementById("imagen").value = "";

        btnGuardar.innerText = "Actualizar";
        const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
        modal.show();
    };

    window.eliminarVehiculo = (index) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede revertir",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                aVehiculos.splice(index, 1);
                guardarYRefrescar();
            }
        });
    };

    const guardarYRefrescar = () => {
        localStorage.setItem("vehiculos", JSON.stringify(aVehiculos));
        limpiarCampos();
        cerrarModal("exampleModal");
        refrescarTabla();
    };

    const limpiarCampos = () => {
        document.getElementById("marca").value = "";
        document.getElementById("modelo").value = "";
        document.getElementById("año").value = "";
        document.getElementById("costo").value = "";
        document.getElementById("placa").value = "";
        document.getElementById("imagen").value = "";
        btnGuardar.innerText = "Guardar";
    };

    const cerrarModal = (id) => {
        const modalEl = document.getElementById(id);
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    };

    const refrescarTabla = () => {
        const tbody = document.getElementById("listaVehiculos");
        tbody.innerHTML = "";

        aVehiculos.forEach((v, index) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td><img src="${v.imagen || 'https://via.placeholder.com/80'}" alt="Vehículo" width="80"></td>
                <td>${v.marca}</td>
                <td>${v.modelo}</td>
                <td>${v.año}</td>
                <td>${v.costo}</td>
                <td>${v.placa}</td>
                <td>
                    <button class="btn btn-primary me-2" onclick="editarVehiculo(${index})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-danger" onclick="eliminarVehiculo(${index})"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    refrescarTabla();
    btnGuardar.addEventListener("click", agregarVehiculo);
});