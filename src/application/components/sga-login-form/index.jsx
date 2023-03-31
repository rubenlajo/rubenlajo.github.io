import React, { Component } from "react";

import Form from "amiga-core/components/forms/form";
import { TextField, FieldPassword, Icon } from "lib-frontsga";
// import CheckboxField from "amiga-core/components/forms/fields/checkbox-field";
import { Checkbox } from "lib-frontsga";
import ButtonGroup from "amiga-core/components/forms/form-buttons-container";
import PrimaryButton from "amiga-core/components/buttons/primary-button";
import injectAuthenticationContext from "amiga-core/components/auth/inject-authentication-context";

import { checkCredentials } from "@/utils/";
import "./styles.css";

class LoginForm extends Component {
  handleLogin = (form) => {
    checkCredentials(
      form.username,
      form.password,
      this.props.authenticationContext.endpoint
    );
  };

  render() {
    return (
      <div className="login-form">
        <div className="login-title">
          <Icon
            icon="sga-icon-user-circle"
            iconColor="#FFFFFF"
            size="size-xs"
          />
          <span>Conectate con tu cuenta de Inditex</span>
        </div>
        <Form onSubmit={this.handleLogin}>
          <TextField
            field="username"
            label="Usuario"
            helperMessage="Introduce tu usuario o dirección de correo"
            autoComplete={false}
            required
          />
          <FieldPassword
            field="password"
            label="Contraseña"
            helperMessage="Introduce tu contraseña"
            autoComplete={false}
            required
          />
          <Checkbox name="rememberme" label="Recuérdame en este equipo" />
          <ButtonGroup>
            <PrimaryButton type="submit">Entrar en IMMS</PrimaryButton>
          </ButtonGroup>
        </Form>
      </div>
    );
  }
}

// Se inyecta el contexto de autenticación para obtener el endpoint
// de chequeo de credenciales.
export default injectAuthenticationContext(LoginForm);
