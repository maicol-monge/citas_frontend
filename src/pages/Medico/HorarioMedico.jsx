import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
];

const HorarioMedico = () => {
    const medico = JSON.parse(localStorage.getItem("medico"));
    const [horarios, setHorarios] = useState([]);
    const [dia, setDia] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchHorarios = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/medico/horarios", {
                params: { id_medico: medico.id_medico },
            });
            setHorarios(res.data);
        } catch {
            setHorarios([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHorarios();
        // eslint-disable-next-line
    }, []);

    const handleAgregar = async (e) => {
        e.preventDefault();
        if (!dia || !horaInicio || !horaFin) {
            Swal.fire("Error", "Completa todos los campos.", "error");
            return;
        }
        if (horaInicio >= horaFin) {
            Swal.fire("Error", "La hora de inicio debe ser menor que la de fin.", "error");
            return;
        }
        try {
            await axios.post("http://localhost:5000/api/medico/horarios", {
                id_medico: medico.id_medico,
                dia_semana: dia,
                hora_inicio: horaInicio,
                hora_fin: horaFin,
            });
            Swal.fire("Horario agregado", "El horario fue registrado correctamente.", "success");
            setDia("");
            setHoraInicio("");
            setHoraFin("");
            fetchHorarios();
        } catch {
            Swal.fire("Error", "No se pudo agregar el horario.", "error");
        }
    };

    const handleEliminar = async (id_horario_medico) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar horario?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (confirm.isConfirmed) {
            try {
                await axios.delete(
                    `http://localhost:5000/api/medico/horarios/${id_horario_medico}`
                );
                Swal.fire("Eliminado", "Horario eliminado correctamente.", "success");
                fetchHorarios();
            } catch {
                Swal.fire("Error", "No se pudo eliminar el horario.", "error");
            }
        }
    };

    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-3" style={{ color: "#2e5da1" }}>
                Definir Disponibilidad de Horario
            </h2>
            <form className="row g-2 align-items-end mb-4" onSubmit={handleAgregar}>
                <div className="col-md-3">
                    <label className="form-label">Día de la semana</label>
                    <select
                        className="form-select"
                        value={dia}
                        onChange={(e) => setDia(e.target.value)}
                        required
                    >
                        <option value="">Seleccione...</option>
                        {diasSemana.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Hora de inicio</label>
                    <input
                        type="time"
                        className="form-control"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Hora de fin</label>
                    <input
                        type="time"
                        className="form-control"
                        value={horaFin}
                        onChange={(e) => setHoraFin(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <button
                        className="btn btn-primary fw-bold"
                        style={{ background: "#2e5da1", border: "none", borderRadius: 8 }}
                        type="submit"
                    >
                        Agregar horario
                    </button>
                </div>
            </form>
            <h5 className="fw-bold mb-2" style={{ color: "#2e5da1" }}>
                Horarios registrados
            </h5>
            {loading ? (
                <div className="text-center text-secondary py-3">Cargando...</div>
            ) : horarios.length === 0 ? (
                <div className="alert alert-info text-center">
                    No tienes horarios registrados. Agrega tus horarios de atención.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead style={{ background: "#e3eafc" }}>
                            <tr>
                                <th>Día</th>
                                <th>Hora de inicio</th>
                                <th>Hora de fin</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {horarios.map((h) => (
                                <tr key={h.id_horario_medico}>
                                    <td>{h.dia_semana}</td>
                                    <td>{h.hora_inicio}</td>
                                    <td>{h.hora_fin}</td>
                                    <td>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleEliminar(h.id_horario_medico)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="alert alert-secondary mt-4">
                <ul className="mb-0">
                    <li>Puedes agregar varios horarios en un mismo día (ejemplo: mañana y tarde).</li>
                    <li>Solo los horarios aquí registrados estarán disponibles para que los pacientes agenden una cita.</li>
                    <li>Recuerda eliminar o modificar horarios si tu disponibilidad cambia.</li>
                </ul>
            </div>
        </div>
    );
};

export default HorarioMedico;