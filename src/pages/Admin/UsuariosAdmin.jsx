import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    direccion: "",
    telefono: "",
    correo: "",
    sexo: "",
    rol: "admin",
    contrasena: "",
  });
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Filtros de búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [busquedaId, setBusquedaId] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    axios
      .get("http://localhost:5000/api/admin/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch(() => setUsuarios([]));
  };

  // Filtrado en frontend
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideBusqueda =
      busqueda.trim() === "" ||
      usuario.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideId =
      busquedaId.trim() === "" ||
      usuario.id_usuario.toString() === busquedaId.trim();
    const coincideRol =
      filtroRol === "todos" || usuario.rol === filtroRol;
    return coincideBusqueda && coincideId && coincideRol;
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nombres.trim() ||
      !form.apellidos.trim() ||
      !form.correo.trim() ||
      !form.rol.trim() ||
      (!editId && !form.contrasena.trim())
    ) {
      Swal.fire("Error", "Por favor completa los campos obligatorios.", "error");
      return;
    }
    try {
      if (editId) {
        // Editar usuario (sin contraseña ni rol)
        const { contrasena, rol, ...editData } = form;
        await axios.put(`http://localhost:5000/api/admin/usuarios/${editId}`, editData);
        Swal.fire("¡Actualizado!", "Usuario actualizado.", "success");
      } else {
        // Crear solo usuario admin
        if (form.rol !== "admin") {
          Swal.fire("Error", "Solo puedes crear usuarios con rol admin.", "error");
          return;
        }
        await axios.post("http://localhost:5000/api/admin/usuarios", form);
        Swal.fire("¡Agregado!", "Usuario admin registrado.", "success");
      }
      setForm({
        nombres: "",
        apellidos: "",
        direccion: "",
        telefono: "",
        correo: "",
        sexo: "",
        rol: "admin",
        contrasena: "",
      });
      setEditId(null);
      fetchUsuarios();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "No se pudo guardar", "error");
    }
  };

  const handleEdit = (usuario) => {
    setForm({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
      correo: usuario.correo,
      sexo: usuario.sexo,
      rol: usuario.rol,
      contrasena: "",
    });
    setEditId(usuario.id_usuario);
  };

  const handleDelete = async (id, rol) => {
    if (rol !== "admin") {
      Swal.fire("Acción no permitida", "Solo puedes eliminar usuarios admin.", "warning");
      return;
    }
    Swal.fire({
      title: "¿Eliminar usuario admin?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/admin/usuarios/${id}`);
          Swal.fire("Eliminado", "Usuario eliminado.", "success");
          fetchUsuarios();
        } catch (err) {
          Swal.fire(
            "Error",
            err.response?.data?.message || "No se pudo eliminar el usuario.",
            "error"
          );
        }
      }
    });
  };

  const handleCancelEdit = () => {
    setForm({
      nombres: "",
      apellidos: "",
      direccion: "",
      telefono: "",
      correo: "",
      sexo: "",
      rol: "admin",
      contrasena: "",
    });
    setEditId(null);
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        minHeight: "80vh",
        width: "100%",
        background: "#f5faff",
      }}
    >
      <div
        className="shadow p-4 rounded my-5"
        style={{
          background: "#fff",
          maxWidth: "1100px",
          width: "100%",
          borderRadius: "18px",
          boxShadow: "0 4px 24px 0 rgba(46,93,161,0.10)",
        }}
      >
        <h3 className="fw-bold text-center mb-3" style={{ color: "#2e5da1" }}>
          Gestión de Usuarios Admin
        </h3>

        {/* Buscador y filtros */}
        <form className="row g-2 mb-4 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Buscar por nombre, apellido o correo</label>
            <input
              type="text"
              className="form-control"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Ej: Juan, Pérez, correo@correo.com"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Filtrar por ID</label>
            <input
              type="number"
              className="form-control"
              value={busquedaId}
              onChange={e => setBusquedaId(e.target.value)}
              placeholder="ID usuario"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Filtrar por rol</label>
            <select
              className="form-select"
              value={filtroRol}
              onChange={e => setFiltroRol(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="admin">Admin</option>
              <option value="paciente">Paciente</option>
              <option value="medico">Médico</option>
            </select>
          </div>
        </form>

        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Nombres*</label>
            <input
              type="text"
              className="form-control"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Apellidos*</label>
            <input
              type="text"
              className="form-control"
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Correo*</label>
            <input
              type="email"
              className="form-control"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              disabled={!!editId}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              className="form-control"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              className="form-control"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Sexo</label>
            <select
              className="form-select"
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
            >
              <option value="">Seleccione...</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Rol*</label>
            <select
              className="form-select"
              name="rol"
              value={form.rol}
              onChange={handleChange}
              required
              disabled
            >
              <option value="admin">Admin</option>
            </select>
          </div>
          {!editId && (
            <div className="col-md-4">
              <label className="form-label">Contraseña*</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                  required
                />
                <span
                  className="input-group-text bg-white"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="bi bi-eye-slash-fill"></i>
                  ) : (
                    <i className="bi bi-eye-fill"></i>
                  )}
                </span>
              </div>
            </div>
          )}
          <div className="col-12 d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary fw-bold"
              style={{
                background: "#2e5da1",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                letterSpacing: "0.5px",
              }}
            >
              {editId ? "Actualizar" : "Agregar"}
            </button>
            {editId && (
              <button
                type="button"
                className="btn btn-outline-secondary fw-bold"
                style={{
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  letterSpacing: "0.5px",
                }}
                onClick={handleCancelEdit}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ background: "#e3eafc" }}>
              <tr>
                <th>ID</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Sexo</th>
                <th>Rol</th>
                <th>ID especial</th>
                <th style={{ width: "140px" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-secondary py-4">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.id_usuario}</td>
                    <td>{usuario.nombres}</td>
                    <td>{usuario.apellidos}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.direccion}</td>
                    <td>{usuario.telefono}</td>
                    <td>{usuario.sexo}</td>
                    <td>{usuario.rol}</td>
                    <td>
                      {usuario.rol === "paciente" && usuario.id_paciente
                        ? `Paciente: ${usuario.id_paciente}`
                        : usuario.rol === "medico" && usuario.id_medico
                        ? `Médico: ${usuario.id_medico}`
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(usuario)}
                      >
                        Editar
                      </button>
                      {usuario.rol === "admin" && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(usuario.id_usuario, usuario.rol)}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsuariosAdmin;