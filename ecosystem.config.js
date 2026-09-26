module.exports = {
 apps : [{
 name: "mi-node-app",
 script: "./index.js",
 instances: "max", // Modo Cluster: usa todos los núcleos de la CPU
 exec_mode: "cluster",
 // Producción: Variables de entorno protegidas
 env: {
 NODE_ENV: "production",
 PORT: 3000,
 DB_HOST: "://amazonaws.com",
 DB_USER: "db_admin",
 DB_PASS: "password_seguro_de_base_de_datos"
 },
 // Logs y Monitoreo del Servidor
 error_file: "/var/www/tu-app/logs/err.log",
 out_file: "/var/www/tu-app/logs/out.log",
 log_date_format: "YYYY-MM-DD HH:mm:ss Z",
 merge_logs: true
 }],
 // Automatización del Despliegue desde tu PC local
 deploy : {
 production : {
 user : 'ubuntu',
 host : '3.136.128.2',
 ref : 'origin/main',
 repo : 'git@github.com:edulima1989/pda-stack-mean-backend.git',
 path : '/var/www/tu-app',
 'post-deploy' : 'mkdir -p logs && npm install && pm2 reload ecosystem.config.js --env production
&& pm2 save',
 ssh_options: "IdentityFile=~/.ssh/server-maestria.pem" // Ruta a tu llave .pem local
 }
 }
};