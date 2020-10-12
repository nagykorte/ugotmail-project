window.history.pushState("", "", "/inbox")
window.addEventListener('load', function () {
    // vars
    let submitter = document.getElementById('submitBtn')
    let modalBtn = document.getElementById('modalBtn')
    let recipientField = document.getElementById('recipient-name')
    let subjectField = document.getElementById('subject')
    let msgField = document.getElementById('message-text')
    //validation
    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    // mail sending function
    submitter.addEventListener('click', e => { //
        let form = document.getElementById('sendForm')
        e.preventDefault();
        if (recipientField.value && subjectField.value && msgField.value) {
            if (validateEmail(recipientField.value)) {
                form.submit()
            } else {
                alert('ingrese un email válido')
            }
        } else {
            alert('Todos los campos deben estar llenos para continuar.');
        }
    })

    // replying function
    let replies = document.getElementsByClassName('fa-reply');
    console.log(replies);
    for (let i = 0; i < replies.length; i++) {
        replies[i].addEventListener('click', e => {
            modalBtn.click();
            recipientField.value = replies[i].parentElement.innerText.trim().split("\n")[0] //gets the sender and attaches it
        })
    }
})