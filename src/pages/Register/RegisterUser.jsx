import { React, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "./styleRegister.css";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

const RegisterUser = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hoverDisabled, setHoverDisabled] = useState(false);
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const navigate = useNavigate();

  //Para ingresar el usuario
  const handleRegister = () => {
    // Validar el formato del correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Validar que la fecha de nacimiento no sea futura
    if (fechaNacimiento) {
      const hoy = new Date();
      const fechaNac = new Date(fechaNacimiento);
      hoy.setHours(0, 0, 0, 0);
      if (fechaNac > hoy) {
        Swal.fire({
          title: "Error",
          text: "La fecha de nacimiento no puede ser una fecha futura.",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }
    }

    if (
      name &&
      lastName &&
      address &&
      phone &&
      email &&
      password &&
      gender
    ) {
      // Verificar si el correo tiene un formato válido
      if (!emailRegex.test(email)) {
        Swal.fire({
          title: "Error",
          text: "Por favor, ingresa un correo electrónico válido.",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
        });
        return; // Detener el registro si el correo no es válido
      }
      // Hacer la solicitud al backend para registrar el usuario
      axios
        .post("http://localhost:5000/api/usuarios/registrarUsuario", {
          nombres: name,
          apellidos: lastName,
          direccion: address,
          telefono: phone,
          correo: email,
          contrasena: password,
          sexo: gender,
          rol: "paciente", // <-- Forzar rol paciente
          fechaNacimiento,
        })
        .then(() => {
          Swal.fire({
            title: "Registro",
            text: "Usuario ingresado correctamente.",
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
          });

          navigate("/"); //Aquí lo manda al login
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            if (error.response.data.message.includes("La contraseña")) {
              Swal.fire({
                title: "Contraseña",
                text: "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula y un número.",
                icon: "error",
                showConfirmButton: false,
                timer: 3000,
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "El correo ya está registrado. Usa otro email.",
                icon: "error",
                showConfirmButton: false,
                timer: 3000,
              });
            }
          } else {
            console.error("Error registrando usuario:", error);
            Swal.fire({
              title: "Registro",
              text: "Hubo un problema al registrar el usuario.",
              icon: "error",
              showConfirmButton: false,
              timer: 3000,
            });
          }
        });
    } else {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa todos los campos.",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <div className="fondo">
      <div className="register-user-container mx-auto ">
        <h2 className="text-dark text-center fw-bold pb-2">Registro de Paciente</h2>
        <RegisterForm
          text={<span className="text-dark">Nombres:</span>}
          type="text"
          placeholder="Nombres"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <RegisterForm
          text={<span className="text-dark">Apellidos:</span>}
          type="text"
          placeholder="Apellidos"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <RegisterForm
          text={<span className="text-dark">Dirección:</span>}
          type="text"
          placeholder="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <RegisterForm
          text={<span className="text-dark">Teléfono:</span>}
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="form-group-email">
          <RegisterForm
            text={<span className="text-dark">Correo:</span>}
            type="text"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-start align-items-center mb-3 form-group-gender">
          <p className="text-dark fw-bold mb-0 me-3">Género:</p>
          <select
            className="form-select text-dark"
            aria-label="Default select example"
            onChange={(e) => setGender(e.target.value)}
          >
            <option className="text-dark" defaultValue>Genero</option>
            <option className="text-dark" value="M">Masculino</option>
            <option className="text-dark" value="F">Femenino</option>
          </select>
        </div>
        <RegisterForm
          text={<span className="text-dark">Fecha de nacimiento:</span>}
          type="date"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          max={new Date().toISOString().split("T")[0]} // <-- No permite fechas futuras
        />
        <div className="form-group-password mb-3 d-flex align-items-center justify-content-between">
          <label className="fw-bold text-dark mb-1" htmlFor="passwordInput">
            Contraseña:
          </label>
          <div className="input-group w-75">
            <input
              id="passwordInput"
              className="form-control "
              type={showPassword ? "text" : "password"}
              placeholder="contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderRight: "none" }}
            />
            <span
              className="input-group-text bg-white"
              style={{ cursor: "pointer", borderLeft: "none" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className="bi bi-eye-slash-fill fs-5 text-dark"></i>
              ) : (
                <i className="bi bi-eye-fill fs-5 text-dark"></i>
              )}
            </span>
          </div>
        </div>
        <section className="d-flex justify-content-center mt-3 flex-wrap gap-2">
          <div
            className="position-relative d-inline-block"
            onMouseEnter={() => setHoverDisabled(true)}
            onMouseLeave={() => setHoverDisabled(false)}
          >
            <button
              type="button"
              className="btn btn-primary fw-bold px-4 me-3"
              disabled={
                !name ||
                !lastName ||
                !address ||
                !phone ||
                !email ||
                !password ||
                !gender
              }
              onClick={handleRegister}
            >
              Registrarme
            </button>
            {(!name || !lastName || !email || !password) && hoverDisabled && (
              <div
                className="position-absolute top-50 start-50 translate-middle"
                style={{ pointerEvents: "none" }}
              >
                <i className="bi bi-ban text-danger fw-bold fs-4"></i>
              </div>
            )}
          </div>
          <Link to="/">
            <button className="btn btn-primary fw-bold px-4 mt-2 mt-md-0">
              Regresar
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default RegisterUser;
