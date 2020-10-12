function testMail(adress) {
    var re = /\S+@\S+\.\S+/;
    return re.test(adress);
}
window.addEventListener('load', function (e) {
    let passField = document.getElementById('pass');
    let mailField = document.getElementById('exampleInputEmail1');
    let submitButton = document.getElementById('submitBtn')
    submitButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (passField.value.trim().length>7) {
            if (testMail(mailField.value)) {
                document.getElementById("myForm").submit(); 
            } else {
                alert('correo inválido')
            }
        } else {
            alert('contraseña demasiado corta')
            
        }
    })
})