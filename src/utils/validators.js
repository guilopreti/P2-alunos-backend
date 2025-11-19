const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return EMAIL_REGEX.test(email.trim());
};

export const isValidNomeCompleto = (nome) => {
  if (!nome || typeof nome !== "string") return false;
  const trimmed = nome.trim();
  return trimmed.length >= 3 && trimmed.length <= 150;
};

export const isValidUsuarioAcesso = (usuario) => {
  if (!usuario || typeof usuario !== "string") return false;
  const trimmed = usuario.trim();
  return (
    trimmed.length >= 3 && trimmed.length <= 50 && USERNAME_REGEX.test(trimmed)
  );
};

export const isValidSenha = (senha) => {
  if (!senha || typeof senha !== "string") return false;
  return senha.length >= 6 && senha.length <= 100;
};

export const isValidObservacao = (observacao) => {
  if (!observacao) return true;
  if (typeof observacao !== "string") return false;
  return observacao.length <= 5000;
};

export const validateAlunoData = (data) => {
  const errors = [];
  if (!data.nome_completo) {
    errors.push("Campo nome_completo é obrigatório");
  } else if (!isValidNomeCompleto(data.nome_completo)) {
    errors.push("Nome completo deve ter entre 3 e 150 caracteres");
  }

  // Usuário de acesso
  if (!data.usuario_acesso) {
    errors.push("Campo usuario_acesso é obrigatório");
  } else if (!isValidUsuarioAcesso(data.usuario_acesso)) {
    errors.push(
      "Usuário de acesso deve ter entre 3 e 50 caracteres e conter apenas letras, números e underscores",
    );
  }

  // Senha
  if (!data.senha) {
    errors.push("Campo senha é obrigatório");
  } else if (!isValidSenha(data.senha)) {
    errors.push("Senha deve ter entre 6 e 100 caracteres");
  }

  // Email
  if (!data.email_aluno) {
    errors.push("Campo email_aluno é obrigatório");
  } else if (!isValidEmail(data.email_aluno)) {
    errors.push("Email inválido");
  }

  // Observação (opcional)
  if (data.observacao && !isValidObservacao(data.observacao)) {
    errors.push("Observação não pode ter mais de 5000 caracteres");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateAlunoUpdateData = (data) => {
  const errors = [];

  if (data.nome_completo !== undefined) {
    if (!isValidNomeCompleto(data.nome_completo)) {
      errors.push("Nome completo deve ter entre 3 e 150 caracteres");
    }
  }

  if (data.usuario_acesso !== undefined) {
    if (!isValidUsuarioAcesso(data.usuario_acesso)) {
      errors.push(
        "Usuário de acesso deve ter entre 3 e 50 caracteres e conter apenas letras, números e underscores",
      );
    }
  }

  if (data.senha !== undefined) {
    if (!isValidSenha(data.senha)) {
      errors.push("Senha deve ter entre 6 e 100 caracteres");
    }
  }

  if (data.email_aluno !== undefined) {
    if (!isValidEmail(data.email_aluno)) {
      errors.push("Email inválido");
    }
  }

  if (data.observacao !== undefined && data.observacao !== null) {
    if (!isValidObservacao(data.observacao)) {
      errors.push("Observação não pode ter mais de 5000 caracteres");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
