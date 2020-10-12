window.addEventListener('load', function (e) {
    let passField = document.getElementById('pass');
    let submitButton = document.getElementById('submitBtn')
    submitButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (passField.value.trim().length>7) {
            document.getElementById("myForm").submit(); 
        } else {
            let warning = 'La contraseña debe tener al menos 8 caracteres';
            
            passField.appendChild(warning)
        }
    })
})