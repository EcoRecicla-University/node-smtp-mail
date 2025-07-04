"use strict";
const environment = require("../../env/environment");

const nodemailer = require("nodemailer");
// const handlebars = require("handlebars");

const templateHelper = require("./template-helper");

class EmailHelper {

  constructor() { }

  /**
   * @param {string} name 
   * @returns {void}
   */
  updateFromName(name) {

    if (!name)
      throw new Error("Invalid from name");

    this._from = name;
  }

  /**
   * 
   * @param {string} templatePath Path relativo do arquivo de template a ser utilizado, 
   * considerado a partir do diretório de templates definido no `environment`
   * 
   * ### Observação importante: 
   * O argumento `templatePath` será pesquisado a partir da variável de ambiente `directory`, 
   * definida no `environment` da aplicação, na chave `email` (`environment.template.directory`)
   * 
   * @example
   * Considerando:
   * ```js
   * const environment = {
   *  email: {
   *    directory: '/templates'
   *  }
   * }
   * ```
   * Caso o template desejado esteja localizado em:
   * - `/templates/main/hello-world-template.html`,
   * 
   * o argumento `templatePath` deverá ser: 
   * - `main/hello-world-template.html`
   * 
   * @returns {EmailHelper}
   */
  useTemplate(templatePath) {

    const path = environment.template.directory + '/' + templatePath;

    // if (!templateHelper.directoryExists(path))
    //   throw new Error("Template path not found. Searching by " + path);

    // this._template = templatePath;
    this._template = path;

    return this;
  }

  /**
   * Enviar e-mail
   * 
   * @param {{to: string|string[], subject: string}} config 
   * @param {*} data 
   * @param {(err, response) => void} callback
   * 
   * @returns {void}
   */
  async send(config, data, callback) {

    // Teste receiver address with Regex

    const emailEnv = environment.email;

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({

      host: emailEnv.smtp.host,
      port: emailEnv.smtp.port,
      secure: emailEnv.smtp.secure, 
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: emailEnv.smtp.account.username,
        pass: emailEnv.smtp.account.password,
      },
    });

    console.info('Lendo template selecionado:', this._template, '...');

    // send mail with defined transport object
    templateHelper.readTemplate(this._template, async (error, html) => {

      const replacements = {
        ...data,
        appName: environment.applicationName,
      };

      console.info('Compilando template...', 'Substituindo variáveis...');
      
      const template = await templateHelper.compileTemplate(html, replacements);

      const mailOptions = {
        from: this._from ?? environment.email.from, 
        to: config.to, 
        subject: config.subject, 
        html: template
      };

      console.info('Destinatário:', mailOptions.to);
      console.info('Assunto:', mailOptions.subject);

      console.info('Enviando e-mail...');

      transporter.sendMail({
        ...mailOptions,
        headers: {
          'From': mailOptions.from
        }
      }, function (error, response) {

        console.log('E-mail enviado!');

        if (error) {
          console.error(error);
          return callback(error, null);
        }

        console.info(response.response);
        return callback(null, response.response);
      });
      
    });
  }

}

module.exports = new EmailHelper();