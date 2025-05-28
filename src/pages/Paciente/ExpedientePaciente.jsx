import React, { useEffect, useState } from "react";
import axios from "axios";

const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
};

const ExpedientePaciente = () => {
    const [expediente, setExpediente] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState("");
    const [detalle, setDetalle] = useState(null);

    useEffect(() => {
        const paciente = JSON.parse(localStorage.getItem("paciente"));
        if (!paciente) return;
        setLoading(true);
        axios
            .get("http://localhost:5000/api/pacientes/expediente", {
                params: { id_paciente: paciente.id_paciente },
            })
            .then((res) => {
                setExpediente(res.data);
                setMensaje(res.data.length === 0 ? "No hay citas finalizadas." : "");
            })
            .catch(() => setMensaje("Error al cargar el expediente"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-4" style={{ color: "#2e5da1" }}>
                Mi Expediente
            </h2>
            {loading ? (
                <div className="text-center py-5">Cargando...</div>
            ) : mensaje ? (
                <div className="alert alert-info">{mensaje}</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead style={{ background: "#e3eafc" }}>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Médico</th>
                                <th>Especialidad</th>
                                <th>Motivo</th>
                                <th>Estado</th>
                                <th>Informe</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expediente.map((cita) => (
                                <tr key={cita.id_cita}>
                                    <td>{formatearFecha(cita.fecha_cita)}</td>
                                    <td>{cita.hora_cita ? cita.hora_cita.slice(0, 5) : ""}</td>
                                    <td>
                                        {cita.medico_nombre} {cita.medico_apellido}
                                    </td>
                                    <td>{cita.especialidad}</td>
                                    <td>{cita.motivo}</td>
                                    <td>
                                        <span
                                            className={
                                                cita.estado === 1
                                                    ? "badge bg-success"
                                                    : cita.estado === 2
                                                    ? "badge bg-secondary"
                                                    : cita.estado === 3
                                                    ? "badge bg-secondary"
                                                    : "badge bg-warning text-dark"
                                            }
                                        >
                                            {cita.estado === 1
                                                ? "Finalizada"
                                                : cita.estado === 2
                                                ? "Cancelada por paciente"
                                                : cita.estado === 3
                                                ? "Cancelada por médico"
                                                : "Pendiente"}
                                        </span>
                                    </td>
                                    <td>
                                        {cita.informe ? (
                                            <span className="text-success">Disponible</span>
                                        ) : (
                                            <span className="text-secondary">Sin informe</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => setDetalle(cita)}
                                        >
                                            Ver detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Detalle */}
            {detalle && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.3)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        className="bg-white p-4 rounded shadow"
                        style={{ minWidth: 340, maxWidth: 400, position: "relative" }}
                    >
                        <button
                            className="btn-close position-absolute"
                            style={{ top: 10, right: 10 }}
                            onClick={() => setDetalle(null)}
                        ></button>
                        <h5 className="fw-bold mb-2" style={{ color: "#2e5da1" }}>
                            Detalle de la Cita
                        </h5>
                        <div>
                            <b>Fecha:</b> {formatearFecha(detalle.fecha_cita)}
                            <br />
                            <b>Hora:</b> {detalle.hora_cita ? detalle.hora_cita.slice(0, 5) : ""}
                            <br />
                            <b>Médico:</b> {detalle.medico_nombre} {detalle.medico_apellido}
                            <br />
                            <b>Especialidad:</b> {detalle.especialidad}
                            <br />
                            <b>Motivo:</b> {detalle.motivo}
                            <br />
                            <b>Estado:</b>{" "}
                            {detalle.estado === 1
                                ? "Finalizada"
                                : detalle.estado === 2
                                ? "Cancelada por paciente"
                                : detalle.estado === 3
                                ? "Cancelada por médico"
                                : "Pendiente"}
                            <br />
                            <b>Informe:</b>
                            <div className="border rounded p-2 mt-1 mb-2" style={{ minHeight: 40 }}>
                                {detalle.informe ? (
                                    <span>{detalle.informe}</span>
                                ) : (
                                    <span className="text-secondary">Sin informe disponible</span>
                                )}
                            </div>
                            {detalle.informe && (
                                <div>
                                    <b>Fecha informe:</b>{" "}
                                    {formatearFecha(detalle.fecha_registro)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpedientePaciente;