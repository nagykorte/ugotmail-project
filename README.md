# UgotMail - proyecto de CRUD con mongo

CRUD realizado en nodejs con express y mongo con una interfaz visual web mínima.

### Inicialización

Para encender el servidor web:
    
    > yarn install 
    > yarn start

El servidor corre por defecto en localhost:3000.
    
El proyecto requiere una instancia de mongod corriendo.
Funciona por defecto en localhost:27017 dbpath=/data/db creando una base de datos 'mail'.


 ## Implementación

 El proyecto implementa dos objetos principales User y Main para manejar la validación y envío del correo propiamente dicho. Las contraseñas están encriptadas con 10 de salt en bcrypt. La API está implementada sólo para funcionalidad mínima a la hora de cambiar estados de email. Maneja logueo de usuario, validaciones por front y backend. Usa expresiones regulares simples pero fue a propósito, para no limitar demasiado el charset aceptado. 

### Info adicional

#### 
    "dependencies": {
        "bcrypt": "^5.0.0" 
        "body-parser": "^1.19.0",
        "cookie-parser": "~1.4.4",
        "debug": "~2.6.9",
        "ejs": "~2.6.1",
        "express": "~4.16.1",
        "express-session": "^1.17.1",
        "http-errors": "~1.6.3",
        "mongoose": "^5.10.9",
        "morgan": "~1.9.1",
        "node-sass-middleware": "0.11.0",
        "nodemon": "^2.0.4"
    }

### Known issues / Testing

El proyecto en general funciona as intended. Las validaciones por back y front no lo hacen inexpugnable pero sí estable. 

Issue #1, la implementación del toggle para read/fav/spam/deleted es sólida pero el front chilla. No con errores en los datos (o al menos yo no encontré nada así) pero te deja en la vista filtro _de la propiedad que acabás de togglear_. 

Issue #2, en un par de forms si hay un error solo te redirige a otra página (puse un par por las dudas, pero me refiero específicamente al de registro. Si funciona, te manda a login. Si no, te redirige a registro). Sólo pasa cuando salteás las validaciones por front. También puse un par de ``` alert() ``` por ahí. 


On a personal note, el proyecto tuvo sus traspiés. A mitad de camino me arrepentí de no hacer la aplicación en React con más énfasis en la api en vez de la interfaz visual. Por las dudas decidí no hacerlo porque no lo pedía específicamente pero siento que hubiera resultado más natural para una bandeja de entrada de un correo. Toda la aplicación también es responsive con un diseño mobile-first. Por qué, si es backend? No sé. La costumbre, supongo.

Made with Bootstrap? More like tied with boot straps, am I right?
