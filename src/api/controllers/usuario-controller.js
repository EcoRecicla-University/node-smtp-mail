const BaseController = require("../../core/base/controller/base-controller");

const emailTemplates = require("../../templates/templates");
const emailHelper = require("../../core/helpers/email-helper");

class UsuarioController extends BaseController {

  constructor(req, res, next) {
    super(req, res, next);
  }

  async redefinirSenha() {

    const destinatario = this.req.body['usuarioEmail'];
    const nome = this.req.body['usuarioNome'];
    const senha = this.req.body['usuarioSenhaTemporaria'];

    const data = {
      user: {
        nome: nome,
        email: destinatario,
        senha: senha
      }
    };

    const subject = "Redefinição de senha";

    // Definindo template a ser utilizado e enviando e-mail
    emailHelper
      .useTemplate(emailTemplates.usuario.recuperacaoSenha)
      .send({
        to: destinatario,
        subject: subject
      }, data, (err, res) => {

        if (err) {
          return this.res.status(500).json({
            message: 'Erro ao enviar o e-mail de redefinição de senha',
            success: false
          });
        }

        return this.res.json({
            message: 'E-mail de redefinição de senha enviado com sucesso',
            success: true
          });
      });
  }
}

module.exports = (req, res, next) => new UsuarioController(req, res, next);