const routeRegister = require('../../core/helpers/route-register');
const controller = require("../controllers/usuario-controller");

/**
 * Sub-rotas registradas para o entrypoint "usuario"
 */
const router = routeRegister("../controllers/usuario-controller");

// Rotas
router.post('/redefinir-senha', (req, res, next) => controller(req, res, next).redefinirSenha());

module.exports = router;