import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo_clinica_blanco.png"; // Asegúrate de tener el logo en la ruta correcta

const RegistrarMedico = () => {
    const navigate = useNavigate();
    const [especialidades, setEspecialidades] = useState([]);
    const [form, setForm] = useState({
        nombres: "",
        apellidos: "",
        direccion: "",
        telefono: "",
        correo: "",
        sexo: "",
        num_identificacion: "",
        licencia_medica: "",
        id_especialidad: ""
    });

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/admin/especialidades")
            .then((res) => setEspecialidades(res.data))
            .catch(() => setEspecialidades([]));
    }, []);

    // Submáscara DUI: solo permite 8 dígitos, un guion y 1 dígito
    const handleDUIChange = (e) => {
        let value = e.target.value.replace(/[^\d-]/g, "");
        // Si el usuario escribe 9 dígitos seguidos, inserta el guion automáticamente
        if (/^\d{9}$/.test(value)) {
            value = value.slice(0, 8) + "-" + value.slice(8);
        }
        // Solo permite el formato 8 dígitos, guion, 1 dígito
        if (value.length > 10) value = value.slice(0, 10);
        setForm({ ...form, num_identificacion: value });
    };

    // Submáscara Licencia Médica: solo permite 5 dígitos
    const handleLicenciaChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 5) value = value.slice(0, 5);
        setForm({ ...form, licencia_medica: value });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de formato DUI
        if (!/^\d{8}-\d$/.test(form.num_identificacion)) {
            Swal.fire("Error", "El DUI debe tener el formato 00000000-0", "error");
            return;
        }
        // Validación de formato Licencia Médica (solo los 5 números)
        if (!/^\d{5}$/.test(form.licencia_medica)) {
            Swal.fire("Error", "La Licencia Médica debe tener el formato J.V.P.M-00000", "error");
            return;
        }

        // Concatenar el prefijo antes de enviar
        const dataToSend = {
            ...form,
            licencia_medica: `J.V.P.M-${form.licencia_medica}`
        };

        try {
            console.log(dataToSend);
            await axios.post("http://localhost:5000/api/admin/registrar-medico", dataToSend);
            
            Swal.fire("¡Éxito!", "Médico registrado exitosamente y correo enviado.", "success");
            setForm({
                nombres: "",
                apellidos: "",
                direccion: "",
                telefono: "",
                correo: "",
                sexo: "",
                num_identificacion: "",
                licencia_medica: "",
                id_especialidad: ""
            });
        } catch (err) {
            if (err.response?.data?.message?.includes("DUI")) {
                Swal.fire("Error", "El DUI ya está registrado.", "error");
            } else if (err.response?.data?.message?.includes("licencia")) {
                Swal.fire("Error", "La Licencia Médica ya está registrada.", "error");
            } else {
                Swal.fire("Error", err.response?.data?.message || "Error al registrar médico", "error");
            }
        }
    };

    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{
                minHeight: "80vh",
                width: "100%",
                background: "#f5faff"
            }}
        >
            <div
                className="shadow p-4 rounded my-5"
                style={{
                    background: "#fff",
                    maxWidth: "600px",
                    width: "100%",
                    borderRadius: "18px",
                    boxShadow: "0 4px 24px 0 rgba(46,93,161,0.10)"
                }}
            >
                <div className="text-center mb-4">
                    <img
                        src={Logo}
                        alt="Logo Clínica Johnson"
                        style={{
                            height: "56px",
                            width: "56px",
                            objectFit: "contain",
                            borderRadius: "50%",
                            background: "#2e5da1",
                            padding: "8px",
                            boxShadow: "0 2px 8px 0 rgba(46,93,161,0.10)"
                        }}
                    />
                    <h3 className="fw-bold mt-3" style={{ color: "#2e5da1", letterSpacing: "0.5px" }}>
                        Registrar Nuevo Médico
                    </h3>
                    <p className="text-secondary" style={{ fontSize: "1.08rem" }}>
                        Complete el formulario para registrar un médico en el sistema.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Nombres</label>
                        <input type="text" className="form-control" name="nombres" value={form.nombres} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Apellidos</label>
                        <input type="text" className="form-control" name="apellidos" value={form.apellidos} onChange={handleChange} required />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label">Dirección</label>
                        <input type="text" className="form-control" name="direccion" value={form.direccion} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Teléfono</label>
                        <input type="number" className="form-control" name="telefono" value={form.telefono} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Correo</label>
                        <input type="email" className="form-control" name="correo" value={form.correo} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Sexo</label>
                        <select className="form-select" name="sexo" value={form.sexo} onChange={handleChange} required>
                            <option value="">Seleccione...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">DUI</label>
                        <input
                            type="text"
                            className="form-control"
                            name="num_identificacion"
                            value={form.num_identificacion}
                            onChange={handleDUIChange}
                            required
                            placeholder="00000000-0"
                            maxLength={10}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Licencia Médica</label>
                        <div className="input-group">
                            <span className="input-group-text">J.V.P.M-</span>
                            <input
                                type="text"
                                className="form-control"
                                name="licencia_medica"
                                value={form.licencia_medica}
                                onChange={handleLicenciaChange}
                                required
                                placeholder="00000"
                                maxLength={5}
                                inputMode="numeric"
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Especialidad</label>
                        <select className="form-select" name="id_especialidad" value={form.id_especialidad} onChange={handleChange} required>
                            <option value="">Seleccione...</option>
                            {especialidades.map((esp) => (
                                <option key={esp.id_especialidad} value={esp.id_especialidad}>
                                    {esp.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 mt-2 d-flex gap-2">
                        <button
                            type="submit"
                            className="btn btn-primary w-100 fw-bold"
                            style={{
                                background: "#2e5da1",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "1.1rem",
                                letterSpacing: "0.5px"
                            }}
                        >
                            Registrar Médico
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary w-100 fw-bold"
                            style={{
                                borderRadius: "8px",
                                fontSize: "1.1rem",
                                letterSpacing: "0.5px"
                            }}
                            onClick={() => {
                                window.scrollTo(0, 0);
                                navigate("/admin/medicos");
                            }}
                        >
                            Volver
                        </button>
                    </div>
                </form>
                <div
                    className="alert alert-info mt-4 text-center"
                    role="alert"
                    style={{
                        background: "#f5faff",
                        color: "#2e5da1",
                        border: "1px solid #e3eafc"
                    }}
                >
                    La contraseña será generada automáticamente y enviada al correo del médico.
                </div>
            </div>
        </div>
    );
};

export default RegistrarMedico;