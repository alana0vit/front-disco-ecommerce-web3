// src/pages/cliente/EditarEndereco.jsx
// Wrapper to reuse the existing CadastroEndereco (Endereco.jsx) in edit mode
import React from "react";
import CadastroEndereco from "./Endereco";

// This component relies on :id route param; Endereco.jsx switches to edit mode when id exists
const EditarEndereco = () => {
  return <CadastroEndereco />;
};

export default EditarEndereco;
